"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
import type { PartCondition, PartInspection } from "@/types";
import { cn } from "@/lib/utils";

interface VehicleDiagramProps {
  parts: Record<string, PartInspection>;
  activePartId?: string | null;
  onPartClick: (partId: string) => void;
  view?: "top" | "side";
}

const TOP_DOWN_PATHS: Record<
  string,
  { d: string; label: string; x: number; y: number }
> = {
  hood: {
    d: "M 175 80 L 225 80 L 230 130 L 170 130 Z",
    label: "Hood",
    x: 200,
    y: 105,
  },
  front_bumper: {
    d: "M 165 55 L 235 55 L 225 80 L 175 80 Z",
    label: "Front Bumper",
    x: 200,
    y: 67,
  },
  front_grille: {
    d: "M 185 70 L 215 70 L 215 78 L 185 78 Z",
    label: "Grille",
    x: 200,
    y: 74,
  },
  left_fender: {
    d: "M 130 80 L 170 80 L 170 130 L 130 130 Z",
    label: "L Fender",
    x: 150,
    y: 105,
  },
  right_fender: {
    d: "M 230 80 L 270 80 L 270 130 L 230 130 Z",
    label: "R Fender",
    x: 250,
    y: 105,
  },
  left_front_door: {
    d: "M 130 130 L 170 130 L 170 180 L 130 180 Z",
    label: "L F Door",
    x: 150,
    y: 155,
  },
  right_front_door: {
    d: "M 230 130 L 270 130 L 270 180 L 230 180 Z",
    label: "R F Door",
    x: 250,
    y: 155,
  },
  left_rear_door: {
    d: "M 130 180 L 170 180 L 170 230 L 130 230 Z",
    label: "L R Door",
    x: 150,
    y: 205,
  },
  right_rear_door: {
    d: "M 230 180 L 270 180 L 270 230 L 230 230 Z",
    label: "R R Door",
    x: 250,
    y: 205,
  },
  left_quarter: {
    d: "M 130 230 L 170 230 L 170 275 L 130 275 Z",
    label: "L Quarter",
    x: 150,
    y: 252,
  },
  right_quarter: {
    d: "M 230 230 L 270 230 L 270 275 L 230 275 Z",
    label: "R Quarter",
    x: 250,
    y: 252,
  },
  roof: {
    d: "M 170 130 L 230 130 L 230 230 L 170 230 Z",
    label: "Roof",
    x: 200,
    y: 180,
  },
  trunk: {
    d: "M 175 275 L 225 275 L 230 310 L 170 310 Z",
    label: "Trunk",
    x: 200,
    y: 292,
  },
  rear_bumper: {
    d: "M 165 310 L 235 310 L 225 335 L 175 335 Z",
    label: "Rear Bumper",
    x: 200,
    y: 322,
  },
  left_mirror: {
    d: "M 115 140 L 130 140 L 130 155 L 115 155 Z",
    label: "L Mirror",
    x: 122,
    y: 147,
  },
  right_mirror: {
    d: "M 270 140 L 285 140 L 285 155 L 270 155 Z",
    label: "R Mirror",
    x: 277,
    y: 147,
  },
  windshield: {
    d: "M 175 130 L 225 130 L 220 155 L 180 155 Z",
    label: "Windshield",
    x: 200,
    y: 142,
  },
  rear_glass: {
    d: "M 180 255 L 220 255 L 225 275 L 175 275 Z",
    label: "Rear Glass",
    x: 200,
    y: 265,
  },
  side_windows: {
    d: "M 175 155 L 225 155 L 225 255 L 175 255 Z",
    label: "Side Windows",
    x: 200,
    y: 205,
  },
};

function getPartColor(partId: string, parts: Record<string, PartInspection>): string {
  const inspection = parts[partId];
  if (!inspection) return "#e2e8f0";
  return CONDITION_COLORS[inspection.condition as PartCondition] || "#e2e8f0";
}

export function VehicleDiagram({
  parts,
  activePartId,
  onPartClick,
  view = "top",
}: VehicleDiagramProps) {
  const partList = useMemo(() => EXTERIOR_PARTS.map((p) => p.id), []);

  if (view === "side") {
    return (
      <div className="rounded-xl border bg-slate-50 p-4">
        <svg viewBox="0 0 400 120" className="w-full max-w-lg mx-auto">
          <text x="200" y="15" textAnchor="middle" className="fill-muted-foreground text-xs">
            Side View
          </text>
          {/* Body outline */}
          <path
            d="M 40 80 Q 60 50 120 45 L 280 45 Q 340 50 360 80 L 360 90 Q 350 95 340 90 L 60 90 Q 50 95 40 90 Z"
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          {/* Wheels */}
          <circle cx="100" cy="90" r="18" fill="#334155" />
          <circle cx="100" cy="90" r="10" fill="#64748b" />
          <circle cx="300" cy="90" r="18" fill="#334155" />
          <circle cx="300" cy="90" r="10" fill="#64748b" />
          {/* Hood area */}
          <path
            d="M 120 45 L 180 45 L 180 85 L 120 85 Z"
            fill={getPartColor("hood", parts)}
            stroke={activePartId === "hood" ? "#2563eb" : "#64748b"}
            strokeWidth={activePartId === "hood" ? 3 : 1}
            className="cursor-pointer hover:opacity-80"
            onClick={() => onPartClick("hood")}
          />
          {/* Doors area */}
          <path
            d="M 180 45 L 260 45 L 260 85 L 180 85 Z"
            fill={getPartColor("left_front_door", parts)}
            stroke={activePartId?.includes("door") ? "#2563eb" : "#64748b"}
            strokeWidth={activePartId?.includes("door") ? 3 : 1}
            className="cursor-pointer hover:opacity-80"
            onClick={() => onPartClick("left_front_door")}
          />
          {/* Trunk area */}
          <path
            d="M 260 45 L 320 45 L 340 80 L 260 85 Z"
            fill={getPartColor("trunk", parts)}
            stroke={activePartId === "trunk" ? "#2563eb" : "#64748b"}
            strokeWidth={activePartId === "trunk" ? 3 : 1}
            className="cursor-pointer hover:opacity-80"
            onClick={() => onPartClick("trunk")}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <svg viewBox="0 0 400 380" className="w-full max-w-md mx-auto">
        <text x="200" y="25" textAnchor="middle" className="fill-muted-foreground text-sm font-medium">
          Top-Down View — Click a panel to inspect
        </text>

        {/* Car body outline */}
        <rect
          x="125"
          y="50"
          width="150"
          height="290"
          rx="20"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 2"
        />

        {partList.map((partId) => {
          const pathData = TOP_DOWN_PATHS[partId];
          if (!pathData) return null;
          const isActive = activePartId === partId;
          const fill = getPartColor(partId, parts);
          const hasIssue = parts[partId] && parts[partId].condition !== "good";

          return (
            <motion.g
              key={partId}
              initial={false}
              animate={{ scale: isActive ? 1.02 : 1 }}
              style={{ transformOrigin: `${pathData.x}px ${pathData.y}px` }}
            >
              <path
                d={pathData.d}
                fill={fill}
                fillOpacity={hasIssue ? 0.85 : 0.6}
                stroke={isActive ? "#2563eb" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 1}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onPartClick(partId)}
              />
              <title>{pathData.label}</title>
            </motion.g>
          );
        })}

        {/* Wheels */}
        {[
          [145, 125],
          [255, 125],
          [145, 265],
          [255, 265],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="12"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(CONDITION_COLORS).map(([condition, color]) => (
          <div key={condition} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-3 w-3 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize text-muted-foreground">{condition}</span>
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
  const inspected = Object.entries(parts).filter(
    ([, v]) => v.condition !== "good"
  );

  if (inspected.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">Issues Found</p>
      <div className="flex flex-wrap gap-2">
        {inspected.map(([partId, data]) => {
          const part = EXTERIOR_PARTS.find((p) => p.id === partId);
          return (
            <span
              key={partId}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{
                backgroundColor:
                  CONDITION_COLORS[data.condition as PartCondition],
              }}
            >
              {part?.label}: {data.condition}
            </span>
          );
        })}
      </div>
    </div>
  );
}
