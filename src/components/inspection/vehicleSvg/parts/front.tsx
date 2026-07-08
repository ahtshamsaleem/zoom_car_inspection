// components/vehicle/FrontLeftWheelArch.tsx

"use client";

import { motion } from "framer-motion";
import { CONDITION_COLORS } from "@/constants/inspection";
import type { PartCondition, PartInspection } from "@/types";

interface FrontLeftWheelArchProps {
  inspection?: PartInspection;
  active?: boolean;
  onClick?: () => void;
}

export function FrontLeftWheelArch({
  inspection,
  active = false,
  onClick,
}: FrontLeftWheelArchProps) {
  const fill =
    CONDITION_COLORS[inspection?.condition as PartCondition] ?? "#E2E8F0";

  return (
    <motion.g
      id="front_left_wheel_arch"
      onClick={onClick}
      className="cursor-pointer"
      initial={false}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: active ? 1.02 : 1,
      }}
    >
      <path
        d="M727.95,241.74c-0.71-4.37-1.66-8.68-2.84-12.8c-5.23-18.36-14.76-33.4-27.56-43.47
        c-11.96-9.41-28.16-14.81-44.43-14.81c-3.36,0-6.74,0.23-10.03,0.68c-17.58,2.41-34.05,10.92-44.06,22.75
        c-4.18,4.94-7.77,10.78-10.66,17.36c-3.45,7.84-5.74,16.3-6.81,25.14c-0.88,7.29-0.45,14.95-0.04,22.36
        c0.13,2.24,0.25,4.55,0.34,6.81l6.85,0.76c-0.18-4.73-0.81-22.04-0.6-24.91c1.17-16.49,7.1-32.16,16.26-42.99
        c8.79-10.39,23.99-18.18,39.67-20.33c17.61-2.42,36,2.33,49.17,12.69c14.71,11.57,21.8,28.08,25.16,39.89
        c1.1,3.87,2,7.91,2.66,12.01c0.56,3.48,0.98,7.09,1.26,10.74l7.01-0.15
        C729.02,249.48,728.57,245.55,727.95,241.74z"
        fill={fill}
        fillOpacity={inspection?.condition === "good" ? 0.6 : 0.9}
        stroke={active ? "#2563EB" : "#64748B"}
        strokeWidth={active ? 3 : 1}
      />

      <path
        d="M595.51,243.07c0-31.57,25.68-57.25,57.25-57.25s57.25,25.68,57.25,57.25
        c0,5.05-0.66,9.95-1.9,14.62
        l12.44-0.02c-0.05-0.93-0.09-1.87-0.15-2.78
        c-0.27-3.98-0.72-7.91-1.33-11.7
        c-0.65-4.02-1.53-7.99-2.61-11.78
        c-3.28-11.52-10.19-27.62-24.47-38.86
        c-12.76-10.04-30.58-14.63-47.67-12.29
        c-15.21,2.09-29.93,9.62-38.41,19.64
        c-8.89,10.51-14.65,25.76-15.8,41.84
        c-0.13,1.77,0.09,9.56,0.31,16.14
        l7.03-0.01
        C596.19,253.14,595.51,248.18,595.51,243.07z"
        fill={fill}
        fillOpacity={inspection?.condition === "good" ? 0.6 : 0.9}
        stroke={active ? "#2563EB" : "#64748B"}
        strokeWidth={active ? 3 : 1}
      />

      <title>Front Left Wheel Arch</title>
    </motion.g>
  );
}