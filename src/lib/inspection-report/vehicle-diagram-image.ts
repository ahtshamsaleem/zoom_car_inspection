// Suggested path: src/lib/inspection-report/vehicle-diagram-image.ts
//
// This is the single source of truth for turning inspection data into the
// vehicle diagram image used in exports. Both PDF exporters call
// buildVehicleDiagramSvgString + rasterizeSvgToPng (via prepare-report-assets.ts),
// so they can no longer produce two different-looking diagrams.

import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
// Adjust this path if your vehiclePartMarkup.ts lives somewhere else —
// it needs to match wherever VehicleSvg.tsx (the on-screen component) imports it from,
// otherwise the exported diagram can drift from what's shown on screen.
import { VEHICLE_PART_MARKUP, VEHICLE_STATIC_MARKUP } from "@/components/inspection/vehicleSvg/vehiclePartMarkup";
import type { PartCondition, PartInspection, Stroke } from "@/types";
import type { ImageAsset } from "@/types";

// Same viewBox as the interactive <VehicleDiagram/> component, so the
// rasterized export version lines up pixel-for-pixel with what's on screen.
export const DIAGRAM_VIEW_WIDTH = 2000;
export const DIAGRAM_VIEW_HEIGHT = 1200;

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean,
    16
  );
  if (isNaN(bigint)) return [37, 99, 235];
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Used by the "Print" button so browser-rendered <img> tags (letterhead,
// stamp, logo) are already in the image cache before window.print() fires.
export function preloadImage(src?: string): Promise<void> {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

// Fetches a remote image (letterhead header/footer, stamp) and converts it
// to a data URL up front. Both PDF generators embed this resolved data URL
// directly instead of handing a bare remote URL to the PDF library — that
// keeps embedding behavior identical between exporters and avoids relying
// on each library's own internal image fetcher (which is where CORS /
// SSR-related export bugs usually come from).
export async function loadImageAsset(url: string): Promise<ImageAsset | null> {
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
    const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    return { dataUrl, width, height, format };
  } catch {
    return null;
  }
}

// Builds a standalone SVG string: base outline + parts colored by condition
// + inspector's annotation strokes on top — same viewBox as the on-screen
// diagram, so there's zero coordinate conversion.
export function buildVehicleDiagramSvgString(
  exterior: Record<string, PartInspection>,
  annotations: Stroke[]
): string {
  const partsMarkup = EXTERIOR_PARTS.map(({ id }) => {
    const markup = VEHICLE_PART_MARKUP[id];
    if (!markup) return "";
    const condition = exterior[id]?.condition as PartCondition | undefined;
    const fill = condition ? CONDITION_COLORS[condition] : "#ffffff";
    return `<g fill="${fill}" stroke="#616161" stroke-width="1">${markup}</g>`;
  }).join("");

  const annotationsMarkup = annotations
    .map(
      (s) =>
        `<path d="${s.d}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" />`
    )
    .join("");

  // Explicit width/height (not just viewBox) matters — some browsers
  // (Firefox especially) fall back to a 300x150 intrinsic size when
  // rasterizing an SVG that only declares a viewBox, silently shrinking or
  // distorting the diagram.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DIAGRAM_VIEW_WIDTH}" height="${DIAGRAM_VIEW_HEIGHT}" viewBox="0 0 ${DIAGRAM_VIEW_WIDTH} ${DIAGRAM_VIEW_HEIGHT}">
    <g fill="#ffffff" stroke="#616161" stroke-width="1">${VEHICLE_STATIC_MARKUP}</g>
    ${partsMarkup}
    ${annotationsMarkup}
  </svg>`;
}

// Rasterizes an SVG string to a PNG data URL via an offscreen canvas.
// Neither jsPDF nor @react-pdf/renderer can embed live SVG markup with
// arbitrary path data, so this is the bridge from diagram markup to
// something either library can drop straight in.
export function rasterizeSvgToPng(
  svgString: string,
  targetWidthPx = 1600
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const height = Math.round(targetWidthPx * (DIAGRAM_VIEW_HEIGHT / DIAGRAM_VIEW_WIDTH));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidthPx;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height });
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e instanceof Event ? new Error("Failed to load SVG for rasterization") : e);
    };
    img.src = url;
  });
}

// Single rule for "does this report need a diagram section at all" —
// previously the HTML preview only checked for issues, while the jsPDF
// export also checked for annotations, so the two could disagree.
export function shouldShowDiagram(
  exterior: Record<string, PartInspection>,
  annotations: Stroke[]
): boolean {
  const hasIssue = Object.values(exterior).some((v) => v.condition !== "good");
  return hasIssue || annotations.length > 0;
}