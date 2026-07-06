import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireCompany } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const includeHistory = searchParams.get("history") === "true";

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (!includeHistory) {
    return NextResponse.json(customer);
  }

  const { data: inspections } = await supabase
    .from("inspections")
    .select(
      "id, status, created_at, completed_at, vehicle_data, profiles:inspector_id(full_name)"
    )
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ customer, inspections: inspections || [], vehicles: vehicles || [] });
}
