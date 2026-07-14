// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import { Printer, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
// import { VehicleDiagram } from "@/components/inspection/vehicle-diagram";
// import type { PartCondition, PartInspection } from "@/types";

// interface InspectionData {
//   id: string;
//   status: string;
//   created_at: string;
//   completed_at?: string;
//   customer_data?: Record<string, string>;
//   vehicle_data?: Record<string, string | number>;
//   exterior_data?: Record<string, PartInspection>;
//   profiles?: { full_name?: string };
// }

// export default function InspectionReportPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const [inspection, setInspection] = useState<InspectionData | null>(null);
//   const reportRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetch(`/api/inspections/${id}`)
//       .then((r) => r.json())
//       .then(setInspection)
//       .catch(() => setInspection(null));
//   }, [id]);

//   const handlePrint = () => window.print();

//   const handleExportPDF = async () => {
//     const { default: jsPDF } = await import("jspdf");
//     const doc = new jsPDF();
//     doc.setFontSize(20);
//     doc.text("Zoom Car Inspection Report", 20, 20);
//     doc.setFontSize(12);
//     doc.text(`Customer: ${inspection?.customer_data?.name || "N/A"}`, 20, 35);
//     doc.text(`Vehicle: ${inspection?.vehicle_data?.plateNumber || "N/A"}`, 20, 42);
//     doc.text(`Make/Model: ${inspection?.vehicle_data?.make || ""} ${inspection?.vehicle_data?.model || ""}`, 20, 49);
//     doc.text(`Status: ${inspection?.status || "N/A"}`, 20, 56);
//     doc.text(`Inspector: ${inspection?.profiles?.full_name || "N/A"}`, 20, 63);
//     doc.text(`Date: ${inspection?.created_at ? new Date(inspection.created_at).toLocaleDateString() : "N/A"}`, 20, 70);
//     doc.save(`inspection-${id}.pdf`);

     
//   };

//   if (!inspection) {
//     return (
//       <div className="flex items-center justify-center py-20 text-muted-foreground">
//         Loading report...
//       </div>
//     );
//   }

//   const exterior = inspection.exterior_data || {};
//   const issues = Object.entries(exterior).filter(
//     ([, v]) => v.condition !== "good"
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between print:hidden">
//         <div>
//           <h1 className="text-2xl font-bold">Inspection Report</h1>
//           <p className="text-muted-foreground">Report #{id.slice(0, 8)}</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handlePrint}>
//             <Printer className="h-4 w-4 mr-1" />
//             Print
//           </Button>
//           <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
//             <Download className="h-4 w-4 mr-1" />
//             Export PDF
//           </Button>
//         </div>
//       </div>

//       <div ref={reportRef} className="space-y-6">
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Zoom Car Inspection</CardTitle>
//               <Badge>{inspection.status}</Badge>
//             </div>
//           </CardHeader>
//           <CardContent className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <h3 className="font-semibold mb-2">Customer</h3>
//               <p>{inspection.customer_data?.name}</p>
//               <p className="text-sm text-muted-foreground">
//                 {inspection.customer_data?.mobile}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {inspection.customer_data?.email}
//               </p>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Vehicle</h3>
//               <p>{inspection.vehicle_data?.plateNumber}</p>
//               <p className="text-sm text-muted-foreground">
//                 {inspection.vehicle_data?.make} {inspection.vehicle_data?.model}{" "}
//                 {inspection.vehicle_data?.year}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 VIN: {inspection.vehicle_data?.vin || "N/A"}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {issues.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Exterior Issues ({issues.length})</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <VehicleDiagram parts={exterior} onPartClick={() => {}} view="top" />
//               <Separator className="my-4" />
//               <div className="grid gap-2 sm:grid-cols-2">
//                 {issues.map(([partId, data]) => {
//                   const part = EXTERIOR_PARTS.find((p) => p.id === partId);
//                   return (
//                     <div
//                       key={partId}
//                       className="flex items-center gap-2 rounded-lg border p-3"
//                     >
//                       <div
//                         className="h-3 w-3 rounded-full"
//                         style={{
//                           backgroundColor:
//                             CONDITION_COLORS[data.condition as PartCondition],
//                         }}
//                       />
//                       <div>
//                         <p className="text-sm font-medium">{part?.label}</p>
//                         <p className="text-xs text-muted-foreground capitalize">
//                           {data.condition}
//                           {data.severity && ` — ${data.severity}`}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <Card>
//           <CardContent className="pt-6 text-sm text-muted-foreground">
//             <p>Inspector: {inspection.profiles?.full_name || "N/A"}</p>
//             <p>
//               Date: {new Date(inspection.created_at).toLocaleString()}
//             </p>
//             {inspection.completed_at && (
//               <p>
//                 Completed: {new Date(inspection.completed_at).toLocaleString()}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }









































































"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, Loader2 } from "lucide-react";
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

interface CompanySettings {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  letterhead_header_url?: string;
  letterhead_footer_url?: string;
  stamp_url?: string;
  website?: string;
  license_number?: string;
  accent_color?: string;
  settings?: { reportFooter?: string };
}

const DEFAULT_ACCENT = "#2563eb";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean,
    16
  );
  if (isNaN(bigint)) return [37, 99, 235];
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

async function loadImageAsset(
  url: string
): Promise<{ dataUrl: string; width: number; height: number; format: "PNG" | "JPEG" } | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const format: "PNG" | "JPEG" = blob.type.includes("png") ? "PNG" : "JPEG";
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    return { dataUrl, width: dims.width, height: dims.height, format };
  } catch {
    return null;
  }
}

// Preloads an image URL into the browser cache so it's ready instantly
// when window.print() or the PDF export needs to draw it.
function preloadImage(src?: string): Promise<void> {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function InspectionReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [company, setCompany] = useState<CompanySettings>({});
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then((r) => r.json())
      .then(setInspection)
      .catch(() => setInspection(null));

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setCompany(data || {}))
      .catch(() => setCompany({}));
  }, [id]);

  const accent = company.accent_color || DEFAULT_ACCENT;
  const [accentR, accentG, accentB] = hexToRgb(accent);

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
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;

      const [headerAsset, footerAsset, stampAsset] = await Promise.all([
        company.letterhead_header_url ? loadImageAsset(company.letterhead_header_url) : null,
        company.letterhead_footer_url ? loadImageAsset(company.letterhead_footer_url) : null,
        company.stamp_url ? loadImageAsset(company.stamp_url) : null,
      ]);

      const headerHeight = headerAsset ? (pageWidth * headerAsset.height) / headerAsset.width : 0;
      const footerHeight = footerAsset ? (pageWidth * footerAsset.height) / footerAsset.width : 0;

      const contentTop = headerAsset ? headerHeight + 6 : margin;
      const contentBottom = pageHeight - (footerAsset ? footerHeight + 6 : margin);

      const drawHeader = () => {
        if (headerAsset) {
          doc.addImage(headerAsset.dataUrl, headerAsset.format, 0, 0, pageWidth, headerHeight);
        }
      };

      let cursorY = contentTop;
      drawHeader();

      const ensureSpace = (needed: number) => {
        if (cursorY + needed > contentBottom) {
          doc.addPage();
          cursorY = contentTop;
          drawHeader();
        }
      };

      // Title block
      doc.setFontSize(18);
      doc.setTextColor(accentR, accentG, accentB);
      doc.setFont("helvetica", "bold");
      doc.text(company.name || "Vehicle Inspection Report", margin, cursorY);
      cursorY += 6;

      doc.setFontSize(10);
      doc.setTextColor(110, 110, 110);
      doc.setFont("helvetica", "normal");
      const metaLine = [
        company.license_number ? `License: ${company.license_number}` : null,
        company.phone,
        company.email,
      ]
        .filter(Boolean)
        .join("   •   ");
      if (metaLine) {
        doc.text(metaLine, margin, cursorY);
        cursorY += 8;
      } else {
        cursorY += 4;
      }

      doc.setDrawColor(accentR, accentG, accentB);
      doc.setLineWidth(0.6);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;

      // Report meta
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.text(`Report #${id.slice(0, 8).toUpperCase()}`, margin, cursorY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Status: ${inspection.status}`, pageWidth - margin, cursorY, { align: "right" });
      cursorY += 6;

      doc.setTextColor(110, 110, 110);
      doc.text(`Date: ${new Date(inspection.created_at).toLocaleString()}`, margin, cursorY);
      doc.text(
        `Inspector: ${inspection.profiles?.full_name || "N/A"}`,
        pageWidth - margin,
        cursorY,
        { align: "right" }
      );
      cursorY += 10;

      // Customer / Vehicle boxes
      const colWidth = (pageWidth - margin * 2 - 10) / 2;
      const sectionTop = cursorY;

      const drawSectionBox = (x: number, title: string, lines: string[]) => {
        doc.setFillColor(248, 249, 251);
        doc.setDrawColor(230, 230, 230);
        const boxHeight = 10 + lines.length * 6 + 4;
        doc.roundedRect(x, sectionTop, colWidth, boxHeight, 2, 2, "FD");

        doc.setFontSize(10);
        doc.setTextColor(accentR, accentG, accentB);
        doc.setFont("helvetica", "bold");
        doc.text(title, x + 4, sectionTop + 7);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9.5);
        lines.forEach((line, i) => doc.text(line, x + 4, sectionTop + 14 + i * 6));

        return boxHeight;
      };

      ensureSpace(40);
      const custHeight = drawSectionBox(margin, "Customer", [
        inspection.customer_data?.name || "N/A",
        inspection.customer_data?.mobile || "",
        inspection.customer_data?.email || "",
      ]);
      const vehHeight = drawSectionBox(margin + colWidth + 10, "Vehicle", [
        inspection.vehicle_data?.plateNumber?.toString() || "N/A",
        `${inspection.vehicle_data?.make || ""} ${inspection.vehicle_data?.model || ""} ${inspection.vehicle_data?.year || ""}`.trim(),
        `VIN: ${inspection.vehicle_data?.vin || "N/A"}`,
      ]);
      cursorY = sectionTop + Math.max(custHeight, vehHeight) + 10;

      // Exterior issues table
      const exterior = inspection.exterior_data || {};
      const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");

      if (issues.length > 0) {
        ensureSpace(16);
        doc.setFontSize(12);
        doc.setTextColor(accentR, accentG, accentB);
        doc.setFont("helvetica", "bold");
        doc.text(`Exterior Issues (${issues.length})`, margin, cursorY);
        cursorY += 7;

        const rowHeight = 8;
        issues.forEach(([partId, data], i) => {
          ensureSpace(rowHeight + 2);

          if (i % 2 === 0) {
            doc.setFillColor(248, 249, 251);
            doc.rect(margin, cursorY - 5, pageWidth - margin * 2, rowHeight, "F");
          }

          const part = EXTERIOR_PARTS.find((p) => p.id === partId);
          const [dr, dg, db] = hexToRgb(CONDITION_COLORS[data.condition as PartCondition] || "#999999");
          doc.setFillColor(dr, dg, db);
          doc.circle(margin + 3, cursorY - 1.5, 1.6, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(40, 40, 40);
          doc.text(part?.label || partId, margin + 8, cursorY);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(120, 120, 120);
          const detail = `${data.condition}${data.severity ? ` — ${data.severity}` : ""}`;
          doc.text(detail, pageWidth - margin, cursorY, { align: "right" });

          cursorY += rowHeight;
        });
        cursorY += 6;
      }

      // Sign-off block
      ensureSpace(34);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 10;

      doc.setFontSize(9.5);
      doc.setTextColor(90, 90, 90);
      doc.setFont("helvetica", "normal");
      doc.text("Inspector Signature", margin, cursorY + 16);
      doc.line(margin, cursorY + 12, margin + 60, cursorY + 12);

      if (stampAsset) {
        const stampW = 28;
        const stampH = (stampW * stampAsset.height) / stampAsset.width;
        doc.addImage(stampAsset.dataUrl, stampAsset.format, pageWidth - margin - stampW, cursorY - 4, stampW, stampH);
      }

      const footerNote = company.settings?.reportFooter;
      if (footerNote) {
        cursorY += 24;
        ensureSpace(14);
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        const wrapped = doc.splitTextToSize(footerNote, pageWidth - margin * 2);
        doc.text(wrapped, margin, cursorY);
      }

      // Footer image + page numbers on every page — must read the REAL page
      // count after all content is drawn, not a hardcoded number.
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        if (footerAsset) {
          doc.addImage(footerAsset.dataUrl, footerAsset.format, 0, pageHeight - footerHeight, pageWidth, footerHeight);
        }
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${p} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - (footerAsset ? footerHeight + 3 : 6),
          { align: "right" }
        );
      }

      doc.save(`inspection-${id}.pdf`);
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
  const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");

  return (
    <div className="space-y-6">
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
          /* Take these out of normal flow only while printing, so Chrome
             repeats them on every physical page. top/bottom must stay at 0 —
             any offset pushes the image off the page and it won't render. */
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
          }
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      `}</style>

      {/* Rendered in normal flow on screen (so you get an accurate preview),
          and only switches to fixed/repeating once @media print kicks in. */}
      {company.letterhead_header_url && (
        <img
          src={company.letterhead_header_url}
          alt="Letterhead header"
          className="print-header block w-full rounded-md border"
        />
      )}

      <div ref={reportRef} className="space-y-6">
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

        {issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: accent }}>Exterior Issues ({issues.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleDiagram parts={exterior} onPartClick={() => {}} view="top" />
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
