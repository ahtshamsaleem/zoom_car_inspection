// "use client";

// import { useMemo } from "react";
// import { motion } from "framer-motion";
// import { EXTERIOR_PARTS, CONDITION_COLORS } from "@/constants/inspection";
// import type { PartCondition, PartInspection } from "@/types";
// import { cn } from "@/lib/utils";

// interface VehicleDiagramProps {
//   parts: Record<string, PartInspection>;
//   activePartId?: string | null;
//   onPartClick: (partId: string) => void;
//   view?: "top" | "left" | "right" | "side"; // Expanded to accept explicit profiles
// }

// // Enterprise-grade path maps with precise anatomical coordinates (Canvas size base: 400x500)
// const TOP_DOWN_PATHS: Record<
//   string,
//   { d: string; label: string; x: number; y: number }
// > = {
//   front_bumper: {
//     d: "M 150 45 C 165 30, 235 30, 250 45 L 245 65 C 220 62, 180 62, 155 65 Z",
//     label: "Front Bumper",
//     x: 200,
//     y: 48,
//   },
//   front_grille: {
//     d: "M 165 42 Q 200 38, 235 42 L 232 50 Q 200 46, 168 50 Z",
//     label: "Front Grille",
//     x: 200,
//     y: 45,
//   },
//   hood: {
//     d: "M 155 68 C 175 66, 225 66, 245 68 L 255 135 L 145 135 Z",
//     label: "Hood",
//     x: 200,
//     y: 100,
//   },
//   windshield: {
//     d: "M 152 138 L 248 138 L 238 185 L 162 185 Z",
//     label: "Windshield",
//     x: 200,
//     y: 160,
//   },
//   left_fender: {
//     d: "M 125 65 L 150 65 L 142 135 L 122 130 C 120 100, 122 80, 125 65 Z",
//     label: "Left Fender",
//     x: 135,
//     y: 95,
//   },
//   right_fender: {
//     d: "M 250 65 L 275 65 C 278 80, 280 100, 278 130 L 258 135 Z",
//     label: "Right Fender",
//     x: 265,
//     y: 95,
//   },
//   left_mirror: {
//     d: "M 110 142 Q 115 138, 125 142 L 128 152 Q 118 154, 112 148 Z",
//     label: "Left Mirror",
//     x: 118,
//     y: 146,
//   },
//   right_mirror: {
//     d: "M 290 142 Q 285 138, 275 142 L 272 152 Q 282 154, 288 148 Z",
//     label: "Right Mirror",
//     x: 282,
//     y: 146,
//   },
//   left_front_door: {
//     d: "M 124 137 L 160 140 L 158 215 L 122 215 Z",
//     label: "Left Front Door",
//     x: 141,
//     y: 175,
//   },
//   right_front_door: {
//     d: "M 276 137 L 240 140 L 242 215 L 278 215 Z",
//     label: "Right Front Door",
//     x: 259,
//     y: 175,
//   },
//   left_rear_door: {
//     d: "M 122 218 L 158 218 L 158 290 L 122 285 Z",
//     label: "Left Rear Door",
//     x: 140,
//     y: 252,
//   },
//   right_rear_door: {
//     d: "M 278 218 L 242 218 L 242 290 L 278 285 Z",
//     label: "Right Rear Door",
//     x: 260,
//     y: 252,
//   },
//   roof: {
//     d: "M 164 188 L 236 188 L 230 285 L 170 285 Z",
//     label: "Roof",
//     x: 200,
//     y: 235,
//   },
//   side_windows: {
//     d: "M 160 188 H 164 L 170 285 H 158 Z M 240 188 H 236 L 230 285 H 242 Z",
//     label: "Side Windows",
//     x: 200,
//     y: 235,
//   },
//   rear_glass: {
//     d: "M 172 288 L 228 288 L 236 332 L 164 332 Z",
//     label: "Rear Glass",
//     x: 200,
//     y: 310,
//   },
//   left_quarter: {
//     d: "M 122 288 L 156 292 L 160 345 L 126 340 Z",
//     label: "Left Quarter Panel",
//     x: 138,
//     y: 315,
//   },
//   right_quarter: {
//     d: "M 278 288 L 244 292 L 240 345 L 274 340 Z",
//     label: "Right Quarter Panel",
//     x: 262,
//     y: 315,
//   },
//   trunk: {
//     d: "M 162 336 C 180 334, 220 334, 238 336 L 242 385 C 220 390, 180 390, 158 385 Z",
//     label: "Trunk / Decklid",
//     x: 200,
//     y: 360,
//   },
//   rear_bumper: {
//     d: "M 155 388 C 175 392, 225 392, 245 388 L 248 408 C 230 415, 170 415, 152 408 Z",
//     label: "Rear Bumper",
//     x: 200,
//     y: 400,
//   },
// };

// // Side profile vector engine (Left Side View mapping)
// const LEFT_SIDE_PATHS: Record<
//   string,
//   { d: string; label: string; x: number; y: number }
// > = {
//   front_bumper: {
//     d: "M 40 160 C 40 145, 52 142, 62 142 L 65 168 L 48 172 Z",
//     label: "Front Bumper",
//     x: 50,
//     y: 155,
//   },
//   left_fender: {
//     d: "M 62 142 L 115 138 L 128 165 L 105 165 C 105 155, 75 155, 72 168 Z",
//     label: "Left Fender",
//     x: 95,
//     y: 145,
//   },
//   hood: {
//     d: "M 62 142 C 75 135, 95 132, 120 135 L 115 138 Z",
//     label: "Hood (Side Aspect)",
//     x: 90,
//     y: 136,
//   },
//   windshield: {
//     d: "M 120 135 L 165 95 L 168 98 L 124 138 Z",
//     label: "Windshield (Side Aspect)",
//     x: 142,
//     y: 115,
//   },
//   left_front_door: {
//     d: "M 128 165 L 195 165 L 195 110 L 165 110 L 140 136 Z",
//     label: "Left Front Door",
//     x: 165,
//     y: 140,
//   },
//   left_mirror: {
//     d: "M 132 130 Q 125 125, 132 120 L 140 125 Z",
//     label: "Left Mirror",
//     x: 135,
//     y: 125,
//   },
//   left_rear_door: {
//     d: "M 195 165 L 265 165 L 260 110 L 195 110 Z",
//     label: "Left Rear Door",
//     x: 230,
//     y: 140,
//   },
//   roof: {
//     d: "M 163 95 C 200 90, 240 90, 262 98 L 260 110 L 165 110 Z",
//     label: "Roof Line",
//     x: 210,
//     y: 100,
//   },
//   rear_glass: {
//     d: "M 262 98 L 305 138 L 298 140 L 260 110 Z",
//     label: "Rear Glass (Side Aspect)",
//     x: 280,
//     y: 120,
//   },
//   left_quarter: {
//     d: "M 265 165 L 340 165 C 345 150, 335 140, 305 138 L 295 168 C 295 155, 270 155, 268 165 Z",
//     label: "Left Quarter Panel",
//     x: 310,
//     y: 150,
//   },
//   trunk: {
//     d: "M 305 138 C 315 138, 335 140, 342 145 L 340 152 Z",
//     label: "Trunk (Side Aspect)",
//     x: 325,
//     y: 140,
//   },
//   rear_bumper: {
//     d: "M 342 145 C 355 148, 355 160, 352 170 L 335 168 L 340 152 Z",
//     label: "Rear Bumper",
//     x: 348,
//     y: 158,
//   },
// };

// // Mirroring generator function to create the Right Profile from Left coordinates programmatically
// const getRightSidePaths = (): Record<string, { d: string; label: string; x: number; y: number }> => {
//   const rightPaths: Record<string, { d: string; label: string; x: number; y: number }> = {};
//   const flipX = (x: number) => 400 - x;

//   // Simple string parser helper to mirror SVG horizontal path components
//   const mirrorPathData = (d: string) => {
//     return d.replace(/([MLHVCQTZ])([^MLHVCQTZ]*)/gi, (match, command, args) => {
//       const numArgs = args.trim().split(/[\s,]+/).map(Number);
//       if (numArgs.some(isNaN)) return match;

//       const upperCmd = command.toUpperCase();
//       if (upperCmd === "M" || upperCmd === "L" || upperCmd === "C" || upperCmd === "Q") {
//         for (let i = 0; i < numArgs.length; i += 2) {
//           numArgs[i] = flipX(numArgs[i]);
//         }
//       } else if (command === "H") {
//         numArgs[0] = flipX(numArgs[0]);
//       }
//       return `${command} ${numArgs.join(" ")} `;
//     });
//   };

//   Object.entries(LEFT_SIDE_PATHS).forEach(([id, path]) => {
//     const rightId = id.replace("left_", "right_");
//     rightPaths[rightId] = {
//       d: mirrorPathData(path.d),
//       label: path.label.replace("Left", "Right"),
//       x: flipX(path.x),
//       y: path.y,
//     };
//   });

//   return rightPaths;
// };

// const RIGHT_SIDE_PATHS = getRightSidePaths();

// function getPartColor(partId: string, parts: Record<string, PartInspection>): string {
//   const inspection = parts[partId];
//   if (!inspection) return "#f1f5f9"; // Clean uninspected slate
//   return CONDITION_COLORS[inspection.condition as PartCondition] || "#f1f5f9";
// }

// export function VehicleDiagram({
//   parts,
//   activePartId,
//   onPartClick,
//   view = "top",
// }: VehicleDiagramProps) {
//   const partList = useMemo(() => EXTERIOR_PARTS.map((p) => p.id), []);

//   // Determine correct render configuration depending on structural view parameter
//   const isSideView = view === "side" || view === "left" || view === "right";
//   const activePaths = useMemo(() => {
//     if (view === "right") return RIGHT_SIDE_PATHS;
//     if (isSideView) return LEFT_SIDE_PATHS;
//     return TOP_DOWN_PATHS;
//   }, [view, isSideView]);

//   return (
//     <div className="rounded-xl border bg-slate-50 p-4 shadow-sm">
//       <svg viewBox={isSideView ? "0 0 400 240" : "0 0 400 460"} className="w-full max-w-md mx-auto">
//         <text x="200" y="20" textAnchor="middle" className="fill-slate-400 text-xs font-semibold uppercase tracking-wider">
//           {view === "top" && "Top-Down Overview Map"}
//           {view === "left" && "Left Profile Aspect"}
//           {view === "right" && "Right Profile Aspect"}
//           {view === "side" && "Side Profile Aspect"}
//         </text>

//         {/* Dynamic Structural Render Loops */}
//         {partList.map((partId) => {
//           // Adjust target map identifiers dynamically depending on user viewing space
//           let currentId = partId;
//           if (view === "right" && partId.startsWith("left_")) {
//             currentId = partId.replace("left_", "right_");
//           }

//           const pathData = activePaths[currentId];
//           if (!pathData) return null;

//           const isActive = activePartId === partId;
//           const fill = getPartColor(partId, parts);
//           const hasIssue = parts[partId] && parts[partId].condition !== "good";

//           return (
//             <motion.g
//               key={partId}
//               initial={false}
//               animate={{ scale: isActive ? 1.015 : 1 }}
//               style={{ transformOrigin: `${pathData.x}px ${pathData.y}px` }}
//             >
//               <path
//                 d={pathData.d}
//                 fill={fill}
//                 fillOpacity={hasIssue ? 0.9 : 0.65}
//                 stroke={isActive ? "#2563eb" : "#94a3b8"}
//                 strokeWidth={isActive ? 2.5 : 1.25}
//                 strokeLinejoin="round"
//                 className="cursor-pointer transition-colors duration-150 hover:fill-slate-200"
//                 onClick={() => onPartClick(partId)}
//               />
//               <title>{pathData.label}</title>
//             </motion.g>
//           );
//         })}

//         {/* Procedural Mechanic Elements (Wheels & Undercarriage indicators) */}
//         {!isSideView ? (
//           // Top view wheel positions mapped inside standard wheelbase specs
//           [
//             [120, 100], // Front Left
//             [280, 100], // Front Right
//             [120, 315], // Rear Left
//             [280, 315], // Rear Right
//           ].map(([cx, cy], i) => (
//             <g key={`wheel-${i}`} className="pointer-events-none opacity-40">
//               <rect x={cx - 10} y={cy - 22} width="20" height="44" rx="4" fill="#1e293b" />
//             </g>
//           ))
//         ) : (
//           // Side Profile wheel position allocations
//           [
//             view === "right" ? 116 : 284, // Rear/Front flipped depending on mirrored viewpoint
//             view === "right" ? 284 : 116,
//           ].map((cx, i) => (
//             <g key={`side-wheel-${i}`} className="pointer-events-none">
//               {/* Outer Tire */}
//               <circle cx={cx} cy="165" r="24" fill="#334155" stroke="#1e293b" strokeWidth="2" />
//               {/* Alloy Rim Profile */}
//               <circle cx={cx} cy="165" r="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
//               <circle cx={cx} cy="165" r="5" fill="#64748b" />
//             </g>
//           ))
//         )}
//       </svg>

//       <div className="mt-4 flex flex-wrap gap-3 justify-center border-t pt-3">
//         {Object.entries(CONDITION_COLORS).map(([condition, color]) => (
//           <div key={condition} className="flex items-center gap-1.5 text-xs font-medium">
//             <div
//               className="h-3 w-3 rounded-full border border-black/10 shadow-sm"
//               style={{ backgroundColor: color }}
//             />
//             <span className="capitalize text-slate-600">{condition}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function PartLegend({
//   parts,
//   className,
// }: {
//   parts: Record<string, PartInspection>;
//   className?: string;
// }) {
//   const inspected = Object.entries(parts).filter(
//     ([, v]) => v.condition !== "good"
//   );

//   if (inspected.length === 0) return null;

//   return (
//     <div className={cn("space-y-2", className)}>
//       <p className="text-sm font-semibold text-slate-700">Flagged Exceptions</p>
//       <div className="flex flex-wrap gap-1.5">
//         {inspected.map(([partId, data]) => {
//           const part = EXTERIOR_PARTS.find((p) => p.id === partId);
//           return (
//             <span
//               key={partId}
//               className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all"
//               style={{
//                 backgroundColor:
//                   CONDITION_COLORS[data.condition as PartCondition],
//               }}
//             >
//               {part?.label || partId}: {data.condition}
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// }