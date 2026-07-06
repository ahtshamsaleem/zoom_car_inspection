import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerFormData, VehicleFormData } from "@/types";

export async function upsertCustomerAndVehicle(
  supabase: SupabaseClient,
  companyId: string,
  customerData: CustomerFormData,
  vehicleData: VehicleFormData
): Promise<{ customerId: string | null; vehicleId: string | null }> {
  let customerId: string | null = null;
  let vehicleId: string | null = null;

  if (customerData?.name && customerData?.mobile) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("company_id", companyId)
      .eq("mobile", customerData.mobile)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      await supabase
        .from("customers")
        .update({
          name: customerData.name,
          email: customerData.email || null,
          emirates_id: customerData.emiratesId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          company_id: companyId,
          name: customerData.name,
          mobile: customerData.mobile,
          email: customerData.email || null,
          emirates_id: customerData.emiratesId || null,
        })
        .select("id")
        .single();
      customerId = newCustomer?.id ?? null;
    }
  }

  if (vehicleData?.plateNumber) {
    const { data: existingVehicle } = await supabase
      .from("vehicles")
      .select("id")
      .eq("company_id", companyId)
      .eq("plate_number", vehicleData.plateNumber)
      .maybeSingle();

    const vehiclePayload = {
      company_id: companyId,
      customer_id: customerId,
      vin: vehicleData.vin || null,
      plate_number: vehicleData.plateNumber,
      make: vehicleData.make || null,
      model: vehicleData.model || null,
      trim: vehicleData.trim || null,
      year: vehicleData.year || null,
      mileage: vehicleData.mileage || null,
      engine_size: vehicleData.engineSize || null,
      fuel_type: vehicleData.fuelType || null,
      transmission: vehicleData.transmission || null,
      color: vehicleData.color || null,
      chassis_number: vehicleData.chassisNumber || null,
      updated_at: new Date().toISOString(),
    };

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
      await supabase.from("vehicles").update(vehiclePayload).eq("id", vehicleId);
    } else {
      const { data: newVehicle } = await supabase
        .from("vehicles")
        .insert(vehiclePayload)
        .select("id")
        .single();
      vehicleId = newVehicle?.id ?? null;
    }
  }

  return { customerId, vehicleId };
}

export async function getDefaultPrice(
  supabase: SupabaseClient,
  companyId: string
): Promise<number | null> {
  const { data } = await supabase
    .from("pricing")
    .select("base_price")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.base_price ? Number(data.base_price) : null;
}

export function calculateInspectionMinutes(
  startedAt?: string | null,
  completedAt?: string
): number | null {
  if (!startedAt) return null;
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  return Math.max(1, Math.round((end - start) / 60000));
}
