import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireManager, requireCompany } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const { data, error } = await supabase
    .from("pricing")
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

  const { data, error } = await supabase
    .from("pricing")
    .insert({
      company_id: auth!.profile.company_id,
      name: body.name,
      base_price: body.base_price,
      description: body.description,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
