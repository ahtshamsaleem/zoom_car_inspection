import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  console.log("IN THE API CALL")
  const { data: todayInspections } = await supabase
    .from("inspections")
    .select("id, status, inspection_time_minutes, price, created_at")
    .gte("created_at", startOfDay.toISOString());

  const { data: monthInspections } = await supabase
    .from("inspections")
    .select("id")
    .gte("created_at", startOfMonth.toISOString());

  const { data: recentInspections } = await supabase
    .from("inspections")
    .select(
      `
      id, status, created_at, customer_data, vehicle_data,
      profiles:inspector_id(full_name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const inspections = todayInspections || [];
  const completed = inspections.filter((i) => i.status === "completed");
  const pending = inspections.filter(
    (i) => i.status === "draft" || i.status === "in_progress"
  );
  const times = completed
    .map((i) => i.inspection_time_minutes)
    .filter(Boolean) as number[];
  const avgTime =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
  const revenue = completed.reduce((sum, i) => sum + (i.price || 0), 0);

  return NextResponse.json({
    totalToday: inspections.length,
    pending: pending.length,
    completed: completed.length,
    avgInspectionTime: avgTime,
    vehiclesThisMonth: monthInspections?.length || 0,
    revenue,
    recentInspections: recentInspections || [],
  });
}
