import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireManager, requireCompany } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const { data, error } = await supabase
    .from("inspection_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const body = await request.json();

  if (body.is_default) {
    await supabase
      .from("inspection_templates")
      .update({ is_default: false })
      .eq("company_id", auth!.profile.company_id!);
  }

  const { data, error } = await supabase
    .from("inspection_templates")
    .insert({
      company_id: auth!.profile.company_id,
      name: body.name,
      description: body.description,
      template_data: body.template_data || {},
      is_default: body.is_default ?? false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
