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

  const { data, error } = await supabase
    .from("pricing")
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.base_price !== undefined && { base_price: body.base_price }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.is_active !== undefined && { is_active: body.is_active }),
       ...(body.template_id !== undefined && { template_id: body.template_id }),
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

  const { error } = await supabase.from("pricing").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
