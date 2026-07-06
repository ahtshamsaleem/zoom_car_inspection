"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, ClipboardList, Clock, CheckCircle, Timer, Car, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const statCards = [
  { key: "totalToday", label: "Today's Inspections", icon: ClipboardList, color: "text-blue-600" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600" },
  { key: "completed", label: "Completed", icon: CheckCircle, color: "text-green-600" },
  { key: "avgInspectionTime", label: "Avg Time (min)", icon: Timer, color: "text-purple-600" },
  { key: "vehiclesThisMonth", label: "This Month", icon: Car, color: "text-indigo-600" },
  { key: "revenue", label: "Revenue (AED)", icon: DollarSign, color: "text-emerald-600" },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() =>
        setStats({
          totalToday: 0,
          pending: 0,
          completed: 0,
          avgInspectionTime: 0,
          vehiclesThisMonth: 0,
          revenue: 0,
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of inspection activity</p>
        </div>
        <Link
          href="/inspections/new"
          className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700")}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Inspection
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {loading
                    ? "—"
                    : card.key === "revenue"
                      ? `${(stats?.[card.key] ?? 0).toLocaleString()}`
                      : (stats?.[card.key] ?? 0)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.recentInspections?.length ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No inspections yet. Start your first inspection!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentInspections.map(
                (insp: {
                  id: string;
                  status: string;
                  created_at: string;
                  customer_data?: { name?: string };
                  vehicle_data?: { plateNumber?: string; make?: string; model?: string };
                  profiles?: { full_name?: string };
                }) => (
                  <Link
                    key={insp.id}
                    href={`/inspections/${insp.id}/report`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {insp.customer_data?.name || "Unknown Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {insp.vehicle_data?.plateNumber}{" "}
                        {insp.vehicle_data?.make} {insp.vehicle_data?.model}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          insp.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {insp.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(insp.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
