// Suggested path: src/components/inspection/report/inspection-pdf-document.tsx
//
// Only ever imported dynamically (see page's handleExportPDF) so nothing
// from @react-pdf/renderer is touched during SSR/build — it's fine for this
// file itself to import it statically, since it's never reachable from a
// server-rendered path.

import { Document, Page, Text, View, StyleSheet, Image as PDFImage } from "@react-pdf/renderer";
import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
import type { PartCondition } from "@/types";
import type { CompanySettings, InspectionData, ReportAssets } from "@/types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 70, // extra room for the fixed footer
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // --- Headers & footers ---
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
  // --- Typography & layout ---
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
  // --- Info boxes ---
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
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 8,
  },
  // --- Vehicle diagram (new) ---
  diagramSection: {
    marginBottom: 16,
  },
  diagramBox: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 4,
    padding: 6,
  },
  diagramImage: {
    // No explicit height: react-pdf reads the PNG's own intrinsic
    // dimensions and scales it to fit this width while preserving aspect
    // ratio, same behavior fullHeaderImage/footerImage already rely on.
    width: "100%",
  },
  // --- Table ---
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
  // --- Sign-off ---
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
  },
});

interface InspectionPDFDocumentProps {
  inspection: InspectionData;
  company: CompanySettings;
  accent: string;
  assets: ReportAssets;
}

export function InspectionPDFDocument({ inspection, company, accent, assets }: InspectionPDFDocumentProps) {
  const exterior = inspection.exterior_data || {};
  const annotations = inspection.annotations_data || [];
  const issues = Object.entries(exterior).filter(([, v]) => v.condition !== "good");
  const showDiagram = issues.length > 0 || annotations.length > 0;

  const metaLine = [
    company.license_number ? `License: ${company.license_number}` : null,
    company.phone,
    company.email,
  ]
    .filter(Boolean)
    .join("   •   ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Simplified header: page 2 and beyond only */}
        <View
          fixed
          style={styles.simplifiedHeader}
          render={({ pageNumber }) =>
            pageNumber > 1 ? (
              <>
                <Text style={styles.simplifiedHeaderText}>{company.name || "Inspection Report"}</Text>
                <Text style={styles.simplifiedHeaderText}>
                  Report: #{inspection.id.slice(0, 8).toUpperCase()} | VIN: {inspection.vehicle_data?.vin || "N/A"}
                </Text>
              </>
            ) : null
          }
        />

        {/* Footer: every page */}
        <View fixed style={styles.footer}>
          {assets.footer && <PDFImage src={assets.footer.dataUrl} style={styles.footerImage} />}
          <View style={styles.footerTextRow}>
            <Text style={styles.footerText}>{company.settings?.reportFooter || ""}</Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </View>

        {/* Page 1 full header */}
        {assets.header && <PDFImage src={assets.header.dataUrl} style={styles.fullHeaderImage} />}

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: accent }]}>{company.name || "Vehicle Inspection Report"}</Text>
          {metaLine && <Text style={styles.metaLine}>{metaLine}</Text>}
        </View>

        <View style={[styles.divider, { backgroundColor: accent }]} />

        <View style={styles.reportMetaRow}>
          <Text style={styles.metaBold}>Report #{inspection.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.metaLight}>Status: {inspection.status.toUpperCase()}</Text>
        </View>
        <View style={styles.reportMetaRow}>
          <Text style={styles.metaLight}>Date: {new Date(inspection.created_at).toLocaleString()}</Text>
          <Text style={styles.metaLight}>Inspector: {inspection.profiles?.full_name || "N/A"}</Text>
        </View>

        {/* Customer & Vehicle */}
        <View style={styles.boxesContainer}>
          <View style={styles.infoBox}>
            <Text style={[styles.boxTitle, { color: accent }]}>Customer</Text>
            <Text style={styles.boxText}>{inspection.customer_data?.name || "N/A"}</Text>
            <Text style={styles.boxText}>{inspection.customer_data?.mobile || ""}</Text>
            <Text style={styles.boxText}>{inspection.customer_data?.email || ""}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={[styles.boxTitle, { color: accent }]}>Vehicle</Text>
            <Text style={styles.boxText}>{inspection.vehicle_data?.plateNumber?.toString() || "N/A"}</Text>
            <Text style={styles.boxText}>
              {`${inspection.vehicle_data?.make || ""} ${inspection.vehicle_data?.model || ""} ${inspection.vehicle_data?.year || ""}`.trim()}
            </Text>
            <Text style={styles.boxText}>VIN: {inspection.vehicle_data?.vin || "N/A"}</Text>
          </View>
        </View>

        {/* Vehicle diagram — the piece that was missing entirely before.
            Same rasterized image the jsPDF exporter (and, by construction,
            nothing else) produces, via assets.diagram. */}
        {showDiagram && assets.diagram && (
          <View style={styles.diagramSection} wrap={false}>
            <Text style={[styles.sectionTitle, { color: accent }]}>Vehicle Diagram</Text>
            <View style={styles.diagramBox}>
              <PDFImage src={assets.diagram.dataUrl} style={styles.diagramImage} />
            </View>
          </View>
        )}

        {/* Exterior issues table */}
        {issues.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: accent }]}>Exterior Issues ({issues.length})</Text>
            {issues.map(([partId, data], index) => {
              const part = EXTERIOR_PARTS.find((p) => p.id === partId);
              const statusColor = CONDITION_COLORS[data.condition as PartCondition] || "#999999";
              const detail = `${data.condition}${data.severity ? ` — ${data.severity}` : ""}`;

              return (
                <View
                  key={partId}
                  wrap={false} // keeps a row from splitting across a page break
                  style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={styles.tableCellPart}>{part?.label || partId}</Text>
                  </View>
                  <Text style={styles.tableCellNotes}>{detail}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Sign-off */}
        <View wrap={false} style={styles.signOffSection}>
          <Text style={styles.signOffText}>Inspector Signature</Text>
          <View style={styles.signatureLine} />
          {assets.stamp && <PDFImage src={assets.stamp.dataUrl} style={styles.stampImage} />}
        </View>
      </Page>
    </Document>
  );
}