import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireManager } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.template_data !== undefined && { template_data: body.template_data }),
      ...(body.is_default !== undefined && { is_default: body.is_default }),
    })
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const { error } = await supabase
    .from("inspection_templates")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
