import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireCompany } from "@/lib/auth-helpers";
import {
  upsertCustomerAndVehicle,
  getDefaultPrice,
  calculateInspectionMinutes,
} from "@/lib/inspection-helpers";
import { NextResponse } from "next/server";
import dayjs from "@/lib/dayjs"

export async function GET(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const today = searchParams.get("today");

  let query = supabase
    .from("inspections")
    .select(
      `
      *,
      profiles:inspector_id(full_name),
      vehicles(plate_number, make, model),
      customers(name, mobile)
    `
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(
      `vehicle_data->>plateNumber.ilike.%${search}%,customer_data->>name.ilike.%${search}%`
    );
  }
  if (today === "true") {
    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);
    // query = query.gte("created_at", startOfDay.toISOString());

    const timezone = searchParams.get("timezone") || "UTC";

const start = dayjs().tz(timezone).startOf("day");
const end = start.add(1, "day");

query = query
  .gte("created_at", start.utc().toISOString())
  .lt("created_at", end.utc().toISOString());
  }

  console.log("THE FETCH QUERY IS THIS", query )

  
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const body = await request.json();
  const companyId = auth!.profile.company_id!;

  const { customerId, vehicleId } = await upsertCustomerAndVehicle(
    supabase,
    companyId,
    body.customer_data,
    body.vehicle_data
  );

  const startedAt = body.started_at || new Date().toISOString();
  const price = body.price ?? (await getDefaultPrice(supabase, companyId));

  const { data, error } = await supabase
    .from("inspections")
    .insert({
      ...body,
      inspector_id: auth!.user.id,
      company_id: companyId,
      customer_id: customerId,
      vehicle_id: vehicleId,
      status: body.status || "draft",
      started_at: startedAt,
      price,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
