import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthProfile, requireManager } from "@/lib/auth-helpers";
import { updateEmployeeSchema } from "@/lib/validations/schemas";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

   const { id } = await params;


  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const body = await request.json();
  const parsed = updateEmployeeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  // Make sure the target employee belongs to the same company
  const { data: target, error: fetchError } = await admin
    .from("profiles")
    .select("id, company_id")
    .eq("id", id)
    .single();

  if (fetchError || !target) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  if (target.company_id !== auth!.profile.company_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fullName, phone, role, password, isActive } = parsed.data;

  // Update auth user (password and/or metadata) if needed
  if (password || fullName || role) {
    const { error: authError } = await admin.auth.admin.updateUserById(id, {
      ...(password ? { password } : {}),
      user_metadata: {
        ...(fullName ? { full_name: fullName } : {}),
        ...(role ? { role } : {}),
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }
  }

  // If deactivating, also ban the auth user so they can't log in
if (isActive !== undefined) {
  const { error: banError } = await admin.auth.admin.updateUserById(id, {
    ban_duration: isActive ? "none" : "876000h", // ~100 years = effectively permanent
  });
  if (banError) {
    return NextResponse.json({ error: banError.message }, { status: 500 });
  }
}



  // Update profile row
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
if (fullName !== undefined) updatePayload.full_name = fullName;
if (phone !== undefined) updatePayload.phone = phone || null;
if (role !== undefined) updatePayload.role = role;
if (isActive !== undefined) updatePayload.is_active = isActive;

const { data, error } = await admin
  .from("profiles")
  .update(updatePayload)
  .eq("id", id)
  .select()
  .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}




export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {

   const { id } = await params;

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

  const { data: target } = await admin
    .from("profiles")
    .select("id, company_id")
    .eq("id", id)
    .single();

  if (!target || target.company_id !== auth!.profile.company_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}