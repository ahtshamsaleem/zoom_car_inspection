"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
import { VehicleDiagram } from "@/components/inspection/vehicle-diagram";
import type { PartCondition, PartInspection } from "@/types";

interface InspectionData {
  id: string;
  status: string;
  created_at: string;
  completed_at?: string;
  customer_data?: Record<string, string>;
  vehicle_data?: Record<string, string | number>;
  exterior_data?: Record<string, PartInspection>;
  profiles?: { full_name?: string };
}

export default function InspectionReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then((r) => r.json())
      .then(setInspection)
      .catch(() => setInspection(null));
  }, [id]);

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Zoom Car Inspection Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Customer: ${inspection?.customer_data?.name || "N/A"}`, 20, 35);
    doc.text(`Vehicle: ${inspection?.vehicle_data?.plateNumber || "N/A"}`, 20, 42);
    doc.text(`Make/Model: ${inspection?.vehicle_data?.make || ""} ${inspection?.vehicle_data?.model || ""}`, 20, 49);
    doc.text(`Status: ${inspection?.status || "N/A"}`, 20, 56);
    doc.text(`Inspector: ${inspection?.profiles?.full_name || "N/A"}`, 20, 63);
    doc.text(`Date: ${inspection?.created_at ? new Date(inspection.created_at).toLocaleDateString() : "N/A"}`, 20, 70);
    doc.save(`inspection-${id}.pdf`);

     
  };

  if (!inspection) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading report...
      </div>
    );
  }

  const exterior = inspection.exterior_data || {};
  const issues = Object.entries(exterior).filter(
    ([, v]) => v.condition !== "good"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Inspection Report</h1>
          <p className="text-muted-foreground">Report #{id.slice(0, 8)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Zoom Car Inspection</CardTitle>
              <Badge>{inspection.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Customer</h3>
              <p>{inspection.customer_data?.name}</p>
              <p className="text-sm text-muted-foreground">
                {inspection.customer_data?.mobile}
              </p>
              <p className="text-sm text-muted-foreground">
                {inspection.customer_data?.email}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vehicle</h3>
              <p>{inspection.vehicle_data?.plateNumber}</p>
              <p className="text-sm text-muted-foreground">
                {inspection.vehicle_data?.make} {inspection.vehicle_data?.model}{" "}
                {inspection.vehicle_data?.year}
              </p>
              <p className="text-sm text-muted-foreground">
                VIN: {inspection.vehicle_data?.vin || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Exterior Issues ({issues.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleDiagram parts={exterior} onPartClick={() => {}} view="top" />
              <Separator className="my-4" />
              <div className="grid gap-2 sm:grid-cols-2">
                {issues.map(([partId, data]) => {
                  const part = EXTERIOR_PARTS.find((p) => p.id === partId);
                  return (
                    <div
                      key={partId}
                      className="flex items-center gap-2 rounded-lg border p-3"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            CONDITION_COLORS[data.condition as PartCondition],
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{part?.label}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {data.condition}
                          {data.severity && ` — ${data.severity}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p>Inspector: {inspection.profiles?.full_name || "N/A"}</p>
            <p>
              Date: {new Date(inspection.created_at).toLocaleString()}
            </p>
            {inspection.completed_at && (
              <p>
                Completed: {new Date(inspection.completed_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
