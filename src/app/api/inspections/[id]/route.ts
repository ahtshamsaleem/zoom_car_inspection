import { createClient } from "@/lib/supabase/server";
import {
  upsertCustomerAndVehicle,
  calculateInspectionMinutes,
} from "@/lib/inspection-helpers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inspections")
    .select(
      `
      *,
      profiles:inspector_id(full_name, email),
      vehicles(*),
      customers(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const { data: existing } = await supabase
    .from("inspections")
    .select("company_id, started_at, price")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let customerId = body.customer_id;
  let vehicleId = body.vehicle_id;

  if (body.customer_data && body.vehicle_data) {
    const upserted = await upsertCustomerAndVehicle(
      supabase,
      existing.company_id,
      body.customer_data,
      body.vehicle_data
    );
    customerId = upserted.customerId;
    vehicleId = upserted.vehicleId;
  }

  const completedAt =
    body.status === "completed" && !body.completed_at
      ? new Date().toISOString()
      : body.completed_at;

  const inspectionTimeMinutes =
    body.status === "completed"
      ? calculateInspectionMinutes(existing.started_at, completedAt)
      : body.inspection_time_minutes;

  const updateData = {
    ...body,
    customer_id: customerId,
    vehicle_id: vehicleId,
    updated_at: new Date().toISOString(),
    ...(completedAt && { completed_at: completedAt }),
    ...(inspectionTimeMinutes && { inspection_time_minutes: inspectionTimeMinutes }),
    ...(body.status === "completed" && !body.price && existing.price && { price: existing.price }),
  };

  const { data, error } = await supabase
    .from("inspections")
    .update(updateData)
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

  const { error } = await supabase.from("inspections").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
