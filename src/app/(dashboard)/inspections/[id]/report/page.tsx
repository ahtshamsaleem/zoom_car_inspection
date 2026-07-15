// Suggested path: wherever your current react-pdf report page lives,
// e.g. app/(dashboard)/inspections/[id]/report/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EXTERIOR_PARTS, CONDITION_COLORS, DEFAULT_ACCENT } from "@/constants/inspection";
import { VehicleDiagram } from "@/components/inspection/vehicle-diagram";
import type { PartCondition } from "@/types";
import { useInspectionReport } from "@/hooks/use-inspection-report";
import { prepareReportAssets } from "@/lib/inspection-report/prepare-report-assets";
import { preloadImage, shouldShowDiagram } from "@/lib/inspection-report/vehicle-diagram-image";
 

export default function InspectionReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { inspection, company } = useInspectionReport(id);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  const accent = company.accent_color || DEFAULT_ACCENT;

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await Promise.all([
        preloadImage(company.letterhead_header_url),
        preloadImage(company.letterhead_footer_url),
        preloadImage(company.logo_url),
        preloadImage(company.stamp_url),
      ]);
      window.print();
    } finally {
      setPrinting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!inspection) return;
    setExporting(true);
    try {
      // Both dynamically imported so @react-pdf/renderer (which touches
      // Node's fs/path at module-eval time) never lands in a
      // server-rendered bundle — only fetched in the browser, on click.
      const [{ pdf }, { InspectionPDFDocument }, assets] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/inspection/report/inspection-pdf-document"),
        prepareReportAssets(inspection, company),
      ]);

      const blob = await pdf(
        <InspectionPDFDocument inspection={inspection} company={company} accent={accent} assets={assets} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inspection-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setExporting(false);
    }
  };

  if (!inspection) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading report...
      </div>
    );
  }

  const exterior = inspection.exterior_data || {};
  const annotations = inspection.annotations_data || [];
  const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");
  const showDiagram = shouldShowDiagram(exterior, annotations);

  return (
    <div className="space-y-6">
      {/* UI Controls Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Inspection Report</h1>
          <p className="text-muted-foreground">Report #{id.slice(0, 8)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} disabled={printing}>
            {printing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Printer className="h-4 w-4 mr-1" />}
            Print
          </Button>
          <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700" disabled={exporting}>
            {exporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
            Export PDF
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: ${company.letterhead_header_url ? "32mm" : "14mm"} 12mm ${company.letterhead_footer_url ? "26mm" : "14mm"} 12mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-header { position: fixed; top: 0; left: 0; right: 0; }
          .print-footer { position: fixed; bottom: 0; left: 0; right: 0; }
        }
      `}</style>

      {/* HTML print/preview view */}
      {company.letterhead_header_url && (
        <img
          src={company.letterhead_header_url}
          alt="Letterhead header"
          className="print-header block w-full rounded-md border"
        />
      )}

      <div className="space-y-6">
        <Card style={{ borderTop: `3px solid ${accent}` }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {company.logo_url && (
                  <img src={company.logo_url} alt={company.name || "Company logo"} className="h-10 w-10 rounded object-contain" />
                )}
                <div>
                  <CardTitle style={{ color: accent }}>{company.name || "Vehicle Inspection Report"}</CardTitle>
                  {company.license_number && (
                    <p className="text-xs text-muted-foreground">License: {company.license_number}</p>
                  )}
                </div>
              </div>
              <Badge style={{ backgroundColor: accent }} className="text-white capitalize">
                {inspection.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Customer</h3>
              <p>{inspection.customer_data?.name}</p>
              <p className="text-sm text-muted-foreground">{inspection.customer_data?.mobile}</p>
              <p className="text-sm text-muted-foreground">{inspection.customer_data?.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vehicle</h3>
              <p>{inspection.vehicle_data?.plateNumber}</p>
              <p className="text-sm text-muted-foreground">
                {inspection.vehicle_data?.make} {inspection.vehicle_data?.model} {inspection.vehicle_data?.year}
              </p>
              <p className="text-sm text-muted-foreground">VIN: {inspection.vehicle_data?.vin || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Gated on shouldShowDiagram (issues OR annotations) instead of
            just issues.length > 0, so this now agrees with the PDF export. */}
        {showDiagram && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: accent }}>
                {issues.length > 0 ? `Exterior Issues (${issues.length})` : "Vehicle Diagram"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleDiagram parts={exterior} onPartClick={() => {}} view="top" readOnly annotations={annotations} />
              {issues.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    {issues.map(([partId, data]) => {
                      const part = EXTERIOR_PARTS.find((p) => p.id === partId);
                      return (
                        <div key={partId} className="flex items-center gap-2 rounded-lg border p-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: CONDITION_COLORS[data.condition as PartCondition] }}
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
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2 text-sm">
            <div className="text-muted-foreground">
              <p>Inspector: {inspection.profiles?.full_name || "N/A"}</p>
              <p>Date: {new Date(inspection.created_at).toLocaleString()}</p>
              {inspection.completed_at && <p>Completed: {new Date(inspection.completed_at).toLocaleString()}</p>}
            </div>
            {company.stamp_url && (
              <div className="flex justify-end">
                <img src={company.stamp_url} alt="Authorized stamp" className="h-16 w-auto object-contain" />
              </div>
            )}
          </CardContent>
        </Card>

        {company.settings?.reportFooter && (
          <p className="text-xs text-muted-foreground print:hidden">{company.settings.reportFooter}</p>
        )}
      </div>

      {company.letterhead_footer_url && (
        <img
          src={company.letterhead_footer_url}
          alt="Letterhead footer"
          className="print-footer block w-full rounded-md border"
        />
      )}
    </div>
  );
}