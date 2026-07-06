"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InspectionRow {
  id: string;
  status: string;
  created_at: string;
  customer_data?: { name?: string; mobile?: string };
  vehicle_data?: { plateNumber?: string; make?: string; model?: string };
  profiles?: { full_name?: string };
}

export default function InspectionsPage() {
  const searchParams = useSearchParams();
  const today = searchParams.get("today");
  const [inspections, setInspections] = useState<InspectionRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (today) params.set("today", "true");
    if (search) params.set("search", search);

    fetch(`/api/inspections?${params}`)
      .then((r) => r.json())
      .then(setInspections)
      .catch(() => setInspections([]))
      .finally(() => setLoading(false));
  }, [today, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {today ? "Today's Inspections" : "All Inspections"}
          </h1>
          <p className="text-muted-foreground">
            View and manage vehicle inspections
          </p>
        </div>
        <Link
          href="/inspections/new"
          className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700")}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Inspection
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by plate or customer..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : inspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No inspections found
                </TableCell>
              </TableRow>
            ) : (
              inspections.map((insp) => (
                <TableRow key={insp.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{insp.customer_data?.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {insp.customer_data?.mobile}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {insp.vehicle_data?.plateNumber}{" "}
                    <span className="text-muted-foreground">
                      {insp.vehicle_data?.make} {insp.vehicle_data?.model}
                    </span>
                  </TableCell>
                  <TableCell>{insp.profiles?.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        insp.status === "completed"
                          ? "default"
                          : insp.status === "draft"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {insp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(insp.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(insp.status === "draft" || insp.status === "in_progress") && (
                        <Link
                          href={`/inspections/${insp.id}/edit`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        >
                          Continue
                        </Link>
                      )}
                      <Link
                        href={`/inspections/${insp.id}/report`}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                      >
                        <FileText className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
