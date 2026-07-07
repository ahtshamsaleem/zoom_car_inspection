import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthProfile, requireManager, requireCompany } from "@/lib/auth-helpers";
import { employeeSchema } from "@/lib/validations/schemas";
import { NextResponse } from "next/server";

// export async function GET() {
//   const supabase = await createClient();
//   const auth = await getAuthProfile(supabase);
//   const denied = requireCompany(auth);
//   if (denied) return denied;

//   const { data, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("company_id", auth!.profile.company_id!)
//     .order("created_at", { ascending: false });

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json(data);
// }

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);

  if (denied) return denied;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const { data: employees, error } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(employees);
}



export async function POST(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  if (!auth!.profile.company_id) {
    return NextResponse.json({ error: "Complete company setup first" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = employeeSchema.safeParse({
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    role: body.role,
    password: body.password,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const tempPassword = parsed.data.password || `Temp${Date.now().toString(36)}!`;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY for employee creation" },
      { status: 500 }
    );
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role,
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const { data, error } = await admin
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
      company_id: auth!.profile.company_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authUser.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      ...data,
      temporaryPassword: parsed.data.password ? undefined : tempPassword,
    },
    { status: 201 }
  );
}
