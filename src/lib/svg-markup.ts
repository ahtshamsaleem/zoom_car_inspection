// lib/svg-markup.ts
export function extractShapesFromMarkup(markup: string | undefined): string[] {
  if (!markup) return [];
  const shapes: string[] = [];

  const pathRegex = /<path[^>]*\sd="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = pathRegex.exec(markup))) {
    shapes.push(m[1].replace(/\s+/g, " ").trim());
  }

  const polyRegex = /<polygon[^>]*\spoints="([^"]+)"/g;
  while ((m = polyRegex.exec(markup))) {
    const pts = m[1].trim().split(/\s+/).filter(Boolean);
    if (pts.length) shapes.push(`M ${pts.join(" L ")} Z`);
  }

  return shapes;
}