import { VehicleSvgProps } from "../types";
import { VehiclePart } from "../VehiclePart";

export const Front = ({ parts, activePartId, onPartClick }: VehicleSvgProps) => {
  return (
    <>
      {/* Matches TOP_DOWN_PATHS key "front_bumper" */}
      <VehiclePart
        id="front_bumper"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M56.14,189.5v-80h1v-2.67h-1.9c-15.67,1.83-14.17,10.67-14.17,10.67l-0.04,65 c1.87,10.33,15.52,10.81,16.77,10.83v-3.83H56.14z" />
      </VehiclePart>

      {/* NEW id, not in TOP_DOWN_PATHS. Source SVG id was FRONT_NUMBER_PLATE. */}
      <VehiclePart
        id="front_number_plate"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M51.08,162.38h-4.9c-0.42,0-0.76-0.34-0.76-0.76v-23.38c0-0.42,0.34-0.76,0.76-0.76h4.9 c0.42,0,0.76,0.34,0.76,0.76v23.38C51.84,162.03,51.5,162.38,51.08,162.38z" />
      </VehiclePart>

      {/* NEW id, not in TOP_DOWN_PATHS. Source SVG id was FRONT_NEAR_SIDE_HEADLAMP.
          "Near side" is UK convention for the kerb-side of the car (usually the left
          in a left-hand-drive market). Rename to front_left_headlamp if you want it
          consistent with the left_/right_ naming already used elsewhere. */}
      <VehiclePart
        id="front_near_side_headlamp"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M56.28,189.5h1.67v3.83c0.06,0,0.1,0,0.1,0c2.41,0.92,7.02,1.42,7.73,1.49v-1.49h0.83l0.04-22.84H56.28V189.5 z" />
        {/* Decorative headlamp reflection detail from source SVG (class="st4", no id
            of its own). Purely visual, not part of the clickable hit area. */}
        <g fill="none" stroke="currentColor" strokeWidth="0.5" pointerEvents="none">
          <path d="M64.83,183.54c0,2-1.62,3.62-3.62,3.62c-2,0-3.62-1.62-3.62-3.62s1.62-3.62,3.62-3.62 C63.21,179.93,64.83,181.54,64.83,183.54z" />
          <path d="M58.19,191.67c0.11-0.48-0.02-0.56,0.13-1.13c0.37-1.37,1.38-2.39,2.89-2.39c2,0,3.62,1.62,3.62,3.62 c0,0.61-0.17,1.18-0.44,1.69c-1.45-0.11-3.53-0.43-6.18-1.13C58.18,192.14,58.14,191.86,58.19,191.67z" />
          <circle cx="61.21" cy="175.31" r="3.62" />
        </g>
      </VehiclePart>

      {/* Matches TOP_DOWN_PATHS key "front_grille" (source SVG id was FRONT_GRILL). */}
      <VehiclePart
        id="front_grille"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <polygon points="56.28,129.64 56.28,170.49 66.65,170.49 66.73,129.64" />
        {/* Decorative grille bars from source SVG (class="st4"). Purely visual. */}
        <g fill="none" stroke="currentColor" strokeWidth="0.5" pointerEvents="none">
          <line x1="58.43" y1="130.14" x2="58.43" y2="170.01" />
          <line x1="60.46" y1="130.14" x2="60.46" y2="170.01" />
          <line x1="62.5" y1="130.14" x2="62.5" y2="170.01" />
          <line x1="64.07" y1="130.14" x2="64.07" y2="170.01" />
        </g>
      </VehiclePart>

      {/* NEW id, not in TOP_DOWN_PATHS. Source SVG id was FRONT_OFF_SIDE_HEADLAMP.
          "Off side" is UK convention for the side nearest the road's centre (usually
          the right in a left-hand-drive market). Rename to front_right_headlamp if
          you want it consistent with the left_/right_ naming used elsewhere. */}
      <VehiclePart
        id="front_off_side_headlamp"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M66.78,106.83h-1v-1.33c-0.65,0.03-4.61,0.24-8.4,1.33h-0.1v2.67h-1v20.13h10.46L66.78,106.83z" />
        <g fill="none" stroke="currentColor" strokeWidth="0.5" pointerEvents="none">
          <path d="M64.83,116.59c0-2-1.62-3.62-3.62-3.62c-2,0-3.62,1.62-3.62,3.62s1.62,3.62,3.62,3.62 C63.21,120.2,64.83,118.58,64.83,116.59z" />
          <path d="M58.19,108.46c0.11,0.48-0.02,0.56,0.13,1.13c0.37,1.37,1.38,2.39,2.89,2.39c2,0,3.62-1.62,3.62-3.62 c0-0.61-0.17-1.18-0.44-1.69c-1.45,0.11-3.53,0.43-6.18,1.13C58.18,107.99,58.14,108.27,58.19,108.46z" />
          <path d="M64.83,124.82c0-2-1.62-3.62-3.62-3.62c-2,0-3.62,1.62-3.62,3.62s1.62,3.62,3.62,3.62 C63.21,128.43,64.83,126.82,64.83,124.82z" />
        </g>
      </VehiclePart>

      {/* NEW id, not in TOP_DOWN_PATHS. Source SVG id was FRONT_PANEL. Geometrically
          this sits alongside the near-side headlamp/grille, so it's most likely the
          near-side front wing/fender strip. Rename (e.g. to front_left_fender) if it
          should map onto an existing part instead. */}
      <VehiclePart
        id="front_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M74.85,187.33v-74.17c-1.31-6.79-5.26-7.79-7.4-7.81c-0.8,0-1.33,0.14-1.33,0.14s-0.04,0-0.1,0v1.33h1 l-0.17,86.5h-0.83v1.49c0.06,0.01,0.1,0.01,0.1,0.01h1.9C73.35,193.5,74.85,187.33,74.85,187.33z" />
      </VehiclePart>

      {/* TODO: wheel-arch placeholder. The original file had this exact block repeated
          14 times, all with the same id "front_right_wheel_arch" and no path data -
          those duplicates have been removed. Give the near-side and off-side wheel
          arches distinct ids (e.g. front_left_wheel_arch / front_right_wheel_arch)
          and drop in the real path data once you have it. */}
      {/* <VehiclePart
        id="front_right_wheel_arch"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      ></VehiclePart> */}
    </>
  );
};