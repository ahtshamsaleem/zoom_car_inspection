// // VehicleSvgRaw.tsx
// import { useEffect, useRef } from "react";
// import vehicleSvgRaw from "@/assets/vehicle-clean.svg"; // Vite syntax
// import { SOURCE_ID_TO_PART_ID } from "./idMapping";

// type Props = {
//   activePartId?: string | null;
//   defectivePartIds?: string[];
//   onPartClick?: (partId: string) => void;
// };

// const COLORS = { defective: "#ef4444", active: "#60a5fa" };

// export const VehicleSvgRaw = ({ activePartId, defectivePartIds = [], onPartClick }: Props) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const resolvePartId = (target: EventTarget | null): string | null => {
//     if (!(target instanceof Element)) return null;
//     const el = target.closest("[id]");
//     return el ? SOURCE_ID_TO_PART_ID[el.id] ?? null : null;
//   };

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const handleClick = (e: MouseEvent) => {
//       const partId = resolvePartId(e.target);
//       if (partId) onPartClick?.(partId);
//     };
//     container.addEventListener("click", handleClick);
//     return () => container.removeEventListener("click", handleClick);
//   }, [onPartClick]);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     Object.entries(SOURCE_ID_TO_PART_ID).forEach(([sourceId, partId]) => {
//       const g = container.querySelector(`#${CSS.escape(sourceId)}`);
//       if (!g) return;
//       const color = defectivePartIds.includes(partId)
//         ? COLORS.defective
//         : partId === activePartId
//         ? COLORS.active
//         : null;

//       g.querySelectorAll("path").forEach((path) => {
//         if (color) (path as SVGElement).style.setProperty("fill", color, "important");
//         else (path as SVGElement).style.removeProperty("fill");
//       });
//     });
//   }, [activePartId, defectivePartIds]);

//   return (
//     <div
//       ref={containerRef}
//       className="w-full h-full [&_path]:cursor-pointer [&_path]:transition-colors"
//       dangerouslySetInnerHTML={{ __html: vehicleSvgRaw }}
//     />
//   );
// };