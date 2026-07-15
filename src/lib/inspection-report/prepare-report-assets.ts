// Suggested path: src/lib/inspection-report/prepare-report-assets.ts
//
// Resolves every remote/generated image a report needs (letterhead header
// & footer, stamp, and the vehicle diagram) into ready-to-embed data URLs
// *once*, up front. The react-pdf exporter (and the jsPDF exporter, if you
// keep it) both consume this same object — that's what actually guarantees
// the exported PDFs use identical images instead of drifting apart.

import {
  loadImageAsset,
  buildVehicleDiagramSvgString,
  rasterizeSvgToPng,
  shouldShowDiagram,
} from "./vehicle-diagram-image";
import type { PartInspection, Stroke } from "@/types";
import type { CompanySettings, ImageAsset, InspectionData, ReportAssets } from "@/types";

export async function prepareReportAssets(
  inspection: InspectionData,
  company: CompanySettings
): Promise<ReportAssets> {
  const exterior: Record<string, PartInspection> = inspection.exterior_data || {};
  const annotations: Stroke[] = inspection.annotations_data || [];
  const needsDiagram = shouldShowDiagram(exterior, annotations);

  const [header, footer, stamp, diagram] = await Promise.all([
    company.letterhead_header_url ? loadImageAsset(company.letterhead_header_url) : Promise.resolve(null),
    company.letterhead_footer_url ? loadImageAsset(company.letterhead_footer_url) : Promise.resolve(null),
    company.stamp_url ? loadImageAsset(company.stamp_url) : Promise.resolve(null),
    needsDiagram ? rasterizeDiagram(exterior, annotations) : Promise.resolve(null),
  ]);

  return { header, footer, stamp, diagram };
}

async function rasterizeDiagram(
  exterior: Record<string, PartInspection>,
  annotations: Stroke[]
): Promise<ImageAsset> {
  const svgString = buildVehicleDiagramSvgString(exterior, annotations);
  const { dataUrl, width, height } = await rasterizeSvgToPng(svgString, 1600);
  return { dataUrl, width, height, format: "PNG" };
}