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
      style={{
        transformOrigin: "center",
        cursor: "pointer",
      }}
      onClick={() => onPartClick(id)}
    >
      <motion.g
        animate={{
          fill,
          stroke:  "#616161",
          // strokeWidth: active ? 2 : 1,
        }}
        whileHover={{ fill: "#93C5FD",  }}
        transition={{ duration: 0.15 }}
        style={{ transformOrigin: "center" }}
      >
        {children}
      </motion.g>

      <title>{id.replace(/_/g, " ")}</title>
    </motion.g>
  );
}