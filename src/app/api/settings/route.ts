import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireManager } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", auth!.profile.company_id!)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const body = await request.json();
  const { name, phone, email, address, logo_url, settings } = body;

  const { data, error } = await supabase
    .from("companies")
    .update({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
      ...(logo_url !== undefined && { logo_url }),
      ...(settings !== undefined && { settings }),
    })
    .eq("id", auth!.profile.company_id!)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
