"use client";

import { motion } from "framer-motion";
import { CONDITION_COLORS } from "@/constants/inspection";
import type { PartCondition, PartInspection } from "@/types";

interface VehiclePartProps {
  id: string;
  parts: Record<string, PartInspection>;
  activePartId?: string | null;
  onPartClick: (id: string) => void;
  children: React.ReactNode;
}

export function VehiclePart({
  id,
  parts,
  activePartId,
  onPartClick,
  children,
}: VehiclePartProps) {
  const inspection = parts[id];
  const condition = inspection?.condition ?? "good";

  const fill =
    CONDITION_COLORS[condition as PartCondition] ?? "#E2E8F0";

  const active = activePartId === id;

  return (
    <motion.g
      id={id}
      initial={false}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: active ? 1.02 : 1,
      }}
      style={{
        transformOrigin: "center",
        cursor: "pointer",
      }}
      onClick={() => onPartClick(id)}
    >
      <g
        fill={fill}
        fillOpacity={condition === "good" ? 0.6 : 0.9}
        stroke={active ? "#2563EB" : "#64748B"}
        strokeWidth={active ? 3 : 1}
      >
        {children}
      </g>

      <title>{id.replace(/_/g, " ")}</title>
    </motion.g>
  );
}