import { createClient } from "@/lib/supabase/server";
import { getAuthProfile, requireCompany } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const auth = await getAuthProfile(supabase);
  const denied = requireCompany(auth);
  if (denied) return denied;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data: monthInspections } = await supabase
    .from("inspections")
    .select("id, status, inspection_time_minutes, price, created_at, completed_at")
    .gte("created_at", startOfMonth.toISOString());

  const inspections = monthInspections || [];
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

  const revenue = completed.reduce((sum, i) => sum + Number(i.price || 0), 0);

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const weeklyData = weeks.map((name, weekIndex) => {
    const weekStart = new Date(startOfMonth);
    weekStart.setDate(weekStart.getDate() + weekIndex * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = inspections.filter((i) => {
      const d = new Date(i.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;

    return { name, inspections: count };
  });

  const dailyData: { name: string; inspections: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = inspections.filter((insp) => {
      const d = new Date(insp.created_at);
      return d >= day && d < nextDay;
    }).length;

    dailyData.push({
      name: day.toLocaleDateString("en-US", { weekday: "short" }),
      inspections: count,
    });
  }

  return NextResponse.json({
    statusBreakdown: [
      { name: "Completed", value: completed.length },
      { name: "Pending", value: pending.length },
      { name: "Cancelled", value: inspections.filter((i) => i.status === "cancelled").length },
    ],
    weeklyData,
    dailyData,
    avgInspectionTime: avgTime,
    vehiclesThisMonth: inspections.length,
    revenue,
    completionRate:
      inspections.length > 0
        ? Math.round((completed.length / inspections.length) * 100)
        : 0,
  });
}
