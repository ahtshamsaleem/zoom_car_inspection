"use client";

import { Stroke } from "@/types";
import { useRef, useState, useCallback } from "react";

 
interface DrawingLayerProps {
  viewBox: string;                 // must match VehicleSvg's viewBox exactly
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  color: string;
  strokeWidth: number;
  enabled: boolean;                 // is "pencil mode" toggled on
  readOnly?: boolean;                // report view - fully static
}

function pointsToPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export function DrawingLayer({
  viewBox,
  strokes,
  onStrokesChange,
  color,
  strokeWidth,
  enabled,
  readOnly,
}: DrawingLayerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const [liveDraft, setLiveDraft] = useState("");

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }, []);

  const handleDown = (e: React.PointerEvent) => {
    if (!enabled || readOnly) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = toSvgPoint(e.clientX, e.clientY);
    pointsRef.current = [p];
    setLiveDraft(`M ${p.x} ${p.y}`);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    pointsRef.current.push(toSvgPoint(e.clientX, e.clientY));
    setLiveDraft(pointsToPath(pointsRef.current));
  };

  const handleUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (pointsRef.current.length > 1) {
      onStrokesChange([
        ...strokes,
        { id: crypto.randomUUID(), d: pointsToPath(pointsRef.current), color, width: strokeWidth },
      ]);
    }
    pointsRef.current = [];
    setLiveDraft("");
  };

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className="absolute inset-0 h-full w-full"
      style={{
        touchAction: enabled ? "none" : "auto",
        pointerEvents: readOnly ? "none" : enabled ? "auto" : "none",
      }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
    >
      {strokes.map((s) => (
        <path key={s.id} d={s.d} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {liveDraft && (
        <path d={liveDraft} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}