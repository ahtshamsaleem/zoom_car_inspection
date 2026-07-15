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
import type { PartCondition, PartInspection, Stroke } from "@/types";

// --- REACT-PDF IMPORTS ---
import { Document, Page, Text, View, StyleSheet, Image as PDFImage, Font } from "@react-pdf/renderer";

// --- TYPES ---
interface InspectionData {
  id: string;
  status: string;
  created_at: string;
  completed_at?: string;
  customer_data?: Record<string, string>;
  vehicle_data?: Record<string, string | number>;
  exterior_data?: Record<string, PartInspection>;
    annotations_data?: Stroke[];
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

// --- REACT-PDF STYLESHEET ---
const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 70, // Extra padding at bottom for the fixed footer
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // --- Headers & Footers ---
  fullHeaderImage: {
    width: "100%",
    marginBottom: 20,
  },
  simplifiedHeader: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingBottom: 5,
  },
  simplifiedHeaderText: {
    fontSize: 9,
    color: "#888888",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
  },
  footerImage: {
    width: "100%",
    marginBottom: 10,
  },
  footerTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#aaaaaa",
  },
  // --- Typography & Layout ---
  titleBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  metaLine: {
    fontSize: 10,
    color: "#6e6e6e",
    marginTop: 4,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
  reportMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaBold: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e1e1e",
  },
  metaLight: {
    fontSize: 10,
    color: "#6e6e6e",
  },
  // --- Information Boxes (Flexbox Grid) ---
  boxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#f8f9fb",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  boxTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  boxText: {
    fontSize: 9.5,
    color: "#323232",
    marginBottom: 3,
  },
  // --- Table Layout ---
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 6,
    minHeight: 24,
  },
  tableRowAlt: {
    backgroundColor: "#fcfcfc",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  tableCellPart: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#282828",
    flex: 1,
  },
  tableCellNotes: {
    fontSize: 9.5,
    color: "#787878",
    textAlign: "right",
    flex: 2,
  },
  // --- Sign Off ---
  signOffSection: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#dcdcdc",
  },
  signOffText: {
    fontSize: 9.5,
    color: "#5a5a5a",
    marginTop: 20,
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: "#5a5a5a",
    marginTop: 25,
  },
  stampImage: {
    position: "absolute",
    right: 0,
    top: 10,
    width: 80,
  }
});

// --- REACT-PDF DOCUMENT COMPONENT ---
// This is decoupled from the DOM and renders purely for the PDF Blob
const InspectionPDFDocument = ({
  inspection,
  company,
  accent,
}: {
  inspection: InspectionData;
  company: CompanySettings;
  accent: string;
}) => {
  const exterior = inspection.exterior_data || {};
  const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");
  const metaLine = [
    company.license_number ? `License: ${company.license_number}` : null,
    company.phone,
    company.email,
  ].filter(Boolean).join("   •   ");

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        
        {/* --- REPEATING ELEMENTS --- */}
        {/* Simplified Header: Renders ONLY on Page 2 and beyond */}
        <View fixed style={pdfStyles.simplifiedHeader} render={({ pageNumber }) => (
          pageNumber > 1 ? (
            <>
              <Text style={pdfStyles.simplifiedHeaderText}>{company.name || "Inspection Report"}</Text>
              <Text style={pdfStyles.simplifiedHeaderText}>
                Report: #{inspection.id.slice(0, 8).toUpperCase()} | VIN: {inspection.vehicle_data?.vin || "N/A"}
              </Text>
            </>
          ) : null
        )} />

        {/* Footer: Renders on EVERY page */}
        <View fixed style={pdfStyles.footer}>
          {company.letterhead_footer_url && (
            <PDFImage src={company.letterhead_footer_url} style={pdfStyles.footerImage} />
          )}
          <View style={pdfStyles.footerTextRow}>
            <Text style={pdfStyles.footerText}>{company.settings?.reportFooter || ""}</Text>
            <Text style={pdfStyles.footerText} render={({ pageNumber, totalPages }) => (
              `Page ${pageNumber} of ${totalPages}`
            )} />
          </View>
        </View>

        {/* --- PAGE 1: FULL HEADER --- */}
        {company.letterhead_header_url && (
          <PDFImage src={company.letterhead_header_url} style={pdfStyles.fullHeaderImage} />
        )}

        {/* --- CONTENT START --- */}
        <View style={pdfStyles.titleBlock}>
          <Text style={[pdfStyles.title, { color: accent }]}>{company.name || "Vehicle Inspection Report"}</Text>
          {metaLine && <Text style={pdfStyles.metaLine}>{metaLine}</Text>}
        </View>

        <View style={[pdfStyles.divider, { backgroundColor: accent }]} />

        <View style={pdfStyles.reportMetaRow}>
          <Text style={pdfStyles.metaBold}>Report #{inspection.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={pdfStyles.metaLight}>Status: {inspection.status.toUpperCase()}</Text>
        </View>
        <View style={pdfStyles.reportMetaRow}>
          <Text style={pdfStyles.metaLight}>Date: {new Date(inspection.created_at).toLocaleString()}</Text>
          <Text style={pdfStyles.metaLight}>Inspector: {inspection.profiles?.full_name || "N/A"}</Text>
        </View>

        {/* Customer & Vehicle Grid */}
        <View style={pdfStyles.boxesContainer}>
          <View style={pdfStyles.infoBox}>
            <Text style={[pdfStyles.boxTitle, { color: accent }]}>Customer</Text>
            <Text style={pdfStyles.boxText}>{inspection.customer_data?.name || "N/A"}</Text>
            <Text style={pdfStyles.boxText}>{inspection.customer_data?.mobile || ""}</Text>
            <Text style={pdfStyles.boxText}>{inspection.customer_data?.email || ""}</Text>
          </View>
          <View style={pdfStyles.infoBox}>
            <Text style={[pdfStyles.boxTitle, { color: accent }]}>Vehicle</Text>
            <Text style={pdfStyles.boxText}>{inspection.vehicle_data?.plateNumber?.toString() || "N/A"}</Text>
            <Text style={pdfStyles.boxText}>
              {`${inspection.vehicle_data?.make || ""} ${inspection.vehicle_data?.model || ""} ${inspection.vehicle_data?.year || ""}`.trim()}
            </Text>
            <Text style={pdfStyles.boxText}>VIN: {inspection.vehicle_data?.vin || "N/A"}</Text>
          </View>
        </View>

        {/* Dynamic Table for Issues */}
        {issues.length > 0 && (
          <View>
            <Text style={[pdfStyles.sectionTitle, { color: accent }]}>Exterior Issues ({issues.length})</Text>
            {issues.map(([partId, data], index) => {
              const part = EXTERIOR_PARTS.find((p) => p.id === partId);
              const statusColor = CONDITION_COLORS[data.condition as PartCondition] || "#999999";
              const detail = `${data.condition}${data.severity ? ` — ${data.severity}` : ""}`;

              return (
                <View 
                  key={partId} 
                  wrap={false} // Prevents a row from splitting across a page break
                  style={[pdfStyles.tableRow, index % 2 === 0 ? pdfStyles.tableRowAlt : {}]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[pdfStyles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={pdfStyles.tableCellPart}>{part?.label || partId}</Text>
                  </View>
                  <Text style={pdfStyles.tableCellNotes}>{detail}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Sign-Off Area */}
        <View wrap={false} style={pdfStyles.signOffSection}>
          <Text style={pdfStyles.signOffText}>Inspector Signature</Text>
          <View style={pdfStyles.signatureLine} />
          {company.stamp_url && (
            <PDFImage src={company.stamp_url} style={pdfStyles.stampImage} />
          )}
        </View>

      </Page>
    </Document>
  );
};


// --- PRELOAD HELPER ---
function preloadImage(src?: string): Promise<void> {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}


// --- MAIN PAGE COMPONENT ---
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
      // Dynamically import the PDF renderer to avoid Next.js SSR build errors 
      // (fs, path modules are not available in browser edge runtimes)
      const { pdf } = await import('@react-pdf/renderer');
      
      const blob = await pdf(
        <InspectionPDFDocument 
          inspection={inspection} 
          company={company} 
          accent={accent} 
        />
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
  const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");

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

      {/* HTML Print View (Maintains your existing browser preview) */}
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
              <VehicleDiagram parts={exterior} onPartClick={() => {}} view="top" readOnly annotations={inspection.annotations_data || []}/>
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