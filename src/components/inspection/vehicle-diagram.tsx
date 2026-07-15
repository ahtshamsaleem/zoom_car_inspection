"use client";

import { useState } from "react";
import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
import type { PartCondition, PartInspection, Stroke } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { VehicleSvg } from "./vehicleSvg/VehicleSvg";
import { DrawingLayer } from "./vehicleSvg/DrawingLayer";
import { DrawingToolbar } from "./vehicleSvg/DrawingToolbar";
import { useInspectionStore } from "@/stores/inspection-store";

interface VehicleDiagramProps {
  parts: Record<string, PartInspection>;
  activePartId?: string | null;
  onPartClick: (partId: string) => void;
  view?: "top" | "side";
  readOnly?: boolean; // pass true on the report page
    annotations?: Stroke[]; 
}

export function VehicleDiagram({
  parts,
  activePartId,
  onPartClick,
  readOnly = false,
    annotations: annotationsProp,
}: VehicleDiagramProps) {
  const { t } = useTranslation();
    const storeAnnotations = useInspectionStore((s) => s.annotations);
  const setAnnotations = useInspectionStore((s) => s.setAnnotations);
  const annotations = annotationsProp ?? storeAnnotations;

  const [drawMode, setDrawMode] = useState(false);
  const [color, setColor] = useState("#ef4444");
  const [width, setWidth] = useState(4);

  return (
    <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
      {!readOnly && (
        <DrawingToolbar
          drawMode={drawMode}
          onToggleDrawMode={() => setDrawMode((v) => !v)}
          color={color}
          onColorChange={setColor}
          width={width}
          onWidthChange={setWidth}
          onUndo={() => setAnnotations(annotations.slice(0, -1))}
          onClear={() => setAnnotations([])}
          canUndo={annotations.length > 0}
        />
      )}

      <div className="w-full flex justify-center items-center">
        {/* `relative` here is required — DrawingLayer is `absolute inset-0` and
            needs this as its positioned ancestor, otherwise it'll misalign
            the moment this wrapper isn't the nearest positioned parent */}
        <div className="relative w-[75%]">
          <VehicleSvg
            parts={parts}
            activePartId={activePartId}
            onPartClick={onPartClick}
          />
          <DrawingLayer
            viewBox="0 0 2000 1200"
            strokes={annotations}
            onStrokesChange={setAnnotations}
            color={color}
            strokeWidth={width}
            enabled={!readOnly && drawMode}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(CONDITION_COLORS).map(([condition, color]) => (
          <div key={condition} className="flex items-center gap-1.5 text-xs">
            <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: color }} />
            <span className="capitalize text-muted-foreground">
              {t(`constants.conditions.${condition}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartLegend({
  parts,
  className,
}: {
  parts: Record<string, PartInspection>;
  className?: string;
}) {
  const { t } = useTranslation();
  const inspected = Object.entries(parts).filter(
    ([, v]) => v.condition !== "good",
  );

  if (inspected.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">{t("vehicle_diagram.issuesFound")}</p>
      <div className="flex flex-wrap gap-2">
        {inspected.map(([partId, data]) => {
          const part = EXTERIOR_PARTS.find((p) => p.id === partId);
          const partLabel = t(`constants.parts.${partId}`) || part?.label;
          return (
            <span
              key={partId}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{
                backgroundColor:
                  CONDITION_COLORS[data.condition as PartCondition],
              }}
            >
              {partLabel}: {t(`constants.conditions.${data.condition}`)}
            </span>
          );
        })}
      </div>
    </div>
  );
}