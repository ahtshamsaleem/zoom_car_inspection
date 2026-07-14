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
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireManager(auth);
  if (denied) return denied;

  const body = await request.json();
  const {
    name,
    phone,
    email,
    address,
    logo_url,
    letterhead_header_url,
    letterhead_footer_url,
    stamp_url,
    website,
    license_number,
    accent_color,
    settings,
  } = body;

  const { data, error } = await supabase
    .from("companies")
    .update({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
      ...(logo_url !== undefined && { logo_url }),
      ...(letterhead_header_url !== undefined && { letterhead_header_url }),
      ...(letterhead_footer_url !== undefined && { letterhead_footer_url }),
      ...(stamp_url !== undefined && { stamp_url }),
      ...(website !== undefined && { website }),
      ...(license_number !== undefined && { license_number }),
      ...(accent_color !== undefined && { accent_color }),
      ...(settings !== undefined && { settings }),
    })
    .eq("id", auth!.profile.company_id!)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Company not found or update not permitted" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}