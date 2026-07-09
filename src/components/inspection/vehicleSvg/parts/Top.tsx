import { VehicleSvgProps } from "../types";
import { VehiclePart } from "../VehiclePart";

export const Top = ({ parts, activePartId, onPartClick }: VehicleSvgProps) => {
  return (
    <>
      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_ROOF_PANEL. This
          section's diagram only covers the front of the car (bonnet -> ~B-pillar),
          so this is presumably just the front slice of the roof. If a later
          "middle"/"rear" roof section is meant to combine into one clickable
          "roof" part, you'll want to either rename this to match EXTERIOR_PARTS'
          "roof", or add separate front/mid/rear roof entries to EXTERIOR_PARTS. */}
      <VehiclePart
        id="front_roof_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M244.58,120.88l-1.94-0.03l-31.35-0.86l-0.04,0l-27.43-1.29c-6.86-2.25-20.23-7.81-20.23-7.81 c-1.55,0.46-3.52,1.24-5.61,2.53c0,0,10.63,5.07,25.3,8.17c0,0-3.32,29.31,0.54,55.39c0,0-24.44,6.24-25.63,8.18 c1.3,0.77,2.72,1.44,4.26,2c2.3-0.81,15.82-5.53,22.08-7.39l27.43-1.16l0.04,0l31.35-0.77l1.94-0.03l23.17-0.36l19.42,9.16 c0.39-0.13,0.77-0.26,1.16-0.41c2.52-0.96,4.96-2.36,6.76-4.37c0.01-0.01,0.02-0.02,0.02-0.03c1.97-2.21,3.18-5.16,2.86-9.11 l0.05-51.75c0,0,0.52-4.51-10-8.19l-18.98,8.51L244.58,120.88z M279.22,123.57c1.19-2.62,16.01-6.89,16.01-6.89l0.48-0.08 c2.74,2.34,2.53,4.25,2.53,4.25l-0.05,51.75c0.32,3.95-0.88,6.9-2.86,9.11l0,0.02c0,0-0.02,0.01-0.02,0.01 c-11.65-1.33-16.08-6.57-16.08-6.57V123.57z" />
      </VehiclePart>

      {/* Matches EXTERIOR_PARTS "windshield" (source SVG id was FRONT_WINDSCREEN -
          UK "windscreen" = US "windshield"). */}
      <VehiclePart
        id="windshield"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M183.82,176.99c-3.86-26.08-0.54-55.39-0.54-55.39c-14.68-3.11-25.3-8.17-25.3-8.17c0,0,0,0,0,0 c-0.33,0.2-0.64,0.42-0.96,0.63c-2.83,1.93-5.79,4.83-8.19,9.18c-1.06,1.95-1.92,4.03-2.62,6.15c-1.1,3.39-1.88,7.37-2.21,12.06 c-0.03,0.57-0.07,1.13-0.09,1.7c-0.01,0.21-0.02,0.42-0.03,0.63c0,0,0,0.01,0,0.04c-0.06,0.49-0.76,6.22-0.1,13.44 c0.01,0.07,0.01,0.12,0.01,0.12c0.02,0.2,0.04,0.41,0.06,0.61c0.04,0.35,0.07,0.7,0.11,1.06c1.22,9.68,6.39,18.56,10.16,23.12 c1.22,1.12,2.58,2.13,4.08,3.02C159.39,183.23,183.82,176.99,183.82,176.99z" />
        {/* Decorative detail from source SVG (no id/tooltip of its own, sits inside
            the windscreen bounds) - reads like a rear-view mirror mount viewed from
            above. Purely visual. */}
        <g fill="none" stroke="currentColor" strokeWidth="0.5" pointerEvents="none">
          <ellipse cx="173.08" cy="135.02" rx="4.5" ry="9.64" />
          <path d="M173.73,138.96v-1.29h2.25v1.29c0,0-1.45,5.37-3.7,4.26c0,0-1.21-0.72-1.53-3.29c0,0-1.77-8.44,1.37-11.89 c0,0,2.25-3.46,3.54,2.17l0.32,2.17v0.8l-2.17-0.16l0.08-1.53" />
          <polyline points="173.08,142.49 173.08,139.6 171.72,139.6 171.72,130.84 173.08,130.84 173.08,128.03" />
        </g>
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_OFF_SIDE_PASSENGER_WINDOW. */}
      <VehiclePart
        id="front_off_side_passenger_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M211.29,119.99l31.35,0.86l1.94,0.03l10.34-12.73c-0.09,0-0.19-0.01-0.29-0.01l-48.97-0.05L211.29,119.99z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_DRIVER_WINDOW. */}
      <VehiclePart
        id="front_driver_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M211.25,119.99l0.04,0l-5.62-11.91l-0.05,0c0,0-35.88,1.33-41.54,2.67c-0.16,0.04-0.33,0.09-0.5,0.14 c0,0,13.38,5.56,20.23,7.81L211.25,119.99z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_DRIVER_SIDE_WINDOW. */}
      <VehiclePart
        id="front_driver_side_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M260.75,108.42l-3.32-0.14c0,0-0.87-0.06-2.5-0.13l-10.34,12.73l25.17,0.4l18.98-8.51 c-0.02-0.01-0.04-0.01-0.06-0.02c-0.61-0.18-6.09-1.77-13.61-3.05C271.02,109.14,266.29,108.69,260.75,108.42z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_NEAR_SIDE_PASSENGER_WINDOW. */}
      <VehiclePart
        id="front_near_side_passenger_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M245.3,177.83l-1.94,0.03l-31.35,0.77l-5.56,10.63c4.25,0.05,8.73,0.08,13.36,0.1l15.34-0.01 c6.65-0.04,13.47-0.12,20.29-0.26L245.3,177.83z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_PASSENGER_WINDOW. */}
      <VehiclePart
        id="front_passenger_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M212.01,178.63l-0.04,0l-27.43,1.16c-6.26,1.85-19.78,6.58-22.08,7.39c0.41,0.15,0.83,0.29,1.26,0.42 c5.33,0.68,21.09,1.22,31.88,1.51c3.41,0.06,7.05,0.11,10.86,0.15L212.01,178.63z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_PASSENGER_SIDE_WINDOW. */}
      <VehiclePart
        id="front_passenger_side_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M245.3,177.83l10.13,11.26c7.29-0.15,14.6-0.38,21.72-0.68c0,0,0.87,0,2.26-0.11 c2.17-0.25,3.85-0.51,5.12-0.75c1.09-0.23,2.22-0.53,3.36-0.9l-19.42-9.16L245.3,177.83z" />
      </VehiclePart>

      {/* Matches EXTERIOR_PARTS "hood" (source SVG id was FRONT_BONNET - UK "bonnet"
          = US "hood"). */}
      <VehiclePart
        id="hood"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M156.61,185.56c-2-1.5-3.88-4.01-5.52-6.74c-2.79-3.67-4.59-7.98-5.73-12.3c-0.21-0.56-0.32-0.89-0.32-0.89 c-0.22-0.78-0.42-1.91-0.6-3.29c-0.2-1.12-0.36-2.22-0.48-3.3c-0.04-0.36-0.08-0.71-0.11-1.06c-0.02-0.24-0.05-0.49-0.07-0.73 c-0.13-1.1-1.11-10.26,0.57-20.22c0.11-1.1,0.23-2.19,0.38-3.22c1.61-11.25,11.89-20.89,11.89-20.89l-19.29-2.71l-33.11,1 l-0.45-0.21c-0.03,0.02-0.07,0.04-0.1,0.06c-0.28,0.17-0.55,0.36-0.82,0.54c-0.17,0.11-0.33,0.22-0.5,0.33 c-0.44,0.31-0.87,0.62-1.29,0.95c-0.02,0.01-0.03,0.03-0.05,0.04c-0.86,0.67-1.69,1.4-2.48,2.19c-0.03,0.03-0.06,0.06-0.09,0.09 c-0.78,0.78-1.52,1.61-2.22,2.51c-0.04,0.05-0.08,0.1-0.12,0.15c-0.32,0.41-0.63,0.83-0.92,1.27c-0.03,0.04-0.06,0.08-0.09,0.13 c-0.32,0.47-0.62,0.95-0.91,1.45c-0.04,0.07-0.08,0.14-0.12,0.21c-0.25,0.44-0.5,0.89-0.73,1.36c-0.04,0.09-0.09,0.17-0.13,0.26 c-0.26,0.52-0.5,1.06-0.74,1.61c-0.03,0.08-0.07,0.17-0.1,0.25c-0.2,0.48-0.39,0.98-0.56,1.48c-0.04,0.13-0.09,0.25-0.13,0.38 c-0.2,0.58-0.38,1.18-0.55,1.79c-0.02,0.08-0.04,0.17-0.06,0.25c-0.15,0.54-0.28,1.1-0.4,1.67c-0.03,0.16-0.07,0.32-0.1,0.48 c-0.13,0.65-0.25,1.31-0.35,2c-0.01,0.06-0.02,0.12-0.02,0.19c-0.09,0.63-0.16,1.27-0.23,1.93c-0.02,0.19-0.03,0.37-0.05,0.56 c-0.06,0.73-0.11,1.47-0.14,2.23v21.86c0,0,0,0.02-0.01,0.05c0,0,0,0.01,0,0.01c0,0.03-0.01,0.09-0.02,0.15c0,0.01,0,0.01,0,0.02 c-0.01,0.07-0.01,0.15-0.02,0.24c0,0,0,0.01,0,0.01c-0.01,0.1-0.02,0.21-0.02,0.34c0,0.01,0,0.03,0,0.04 c-0.02,0.26-0.03,0.58-0.04,0.95c0,0.01,0,0.02,0,0.03c0,0.19-0.01,0.39,0,0.6c0,0.01,0,0.01,0,0.02c0,0.43,0.01,0.91,0.04,1.44 c0,0.01,0,0.01,0,0.02c0.14,2.65,0.67,6.39,2.31,10.37c0.99,2.4,2.38,4.89,4.34,7.28c0,0,0.01,0.01,0.01,0.01 c1.18,1.45,2.58,2.86,4.21,4.19c0.59,0.48,1.21,0.96,1.87,1.42c0.02,0.01,0.04,0.03,0.06,0.04c0.55,0.38,1.13,0.76,1.72,1.12 c0.18,0.11,0.37,0.22,0.56,0.33c0.3,0.18,0.62,0.35,0.94,0.53l33.55-1L156.61,185.56z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_REAR_PANEL. Note this
          section's diagram only covers the front of the car, so "rear" here means
          "the rear edge of this front section" (near the A/B-pillar), not the car's
          actual rear panel - don't confuse with a future rear_panel/trunk part. */}
      <VehiclePart
        id="front_rear_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M297.57,111.58l-10.8,0.55c0.67,0.2,1.3,0.41,1.91,0.62c0.04,0.01,0.06,0.02,0.06,0.02l0,0 c10.52,3.67,10,8.19,10,8.19l-0.05,51.75c0.32,3.95-0.88,6.9-2.86,9.11l0,0.02c0,0-0.02,0.01-0.02,0.01 c-1.8,2.01-4.24,3.41-6.76,4.37l9.95,0.54c1.86-1.15,5.21-4.15,6.12-11.21v-50.42C305.11,125.14,307.41,116.12,297.57,111.58z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_REAR_WINDOW. Same
          caveat as front_rear_panel above - this is the rearmost window pane of the
          front section (a quarter light near the B-pillar), not the car's actual
          rear windscreen/rear_glass. */}
      <VehiclePart
        id="front_rear_window"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M295.31,181.74c0.01,0,0.02,0,0.02-0.01l0-0.02c1.97-2.21,3.18-5.16,2.86-9.11l0.05-51.75 c0,0,0.21-1.91-2.53-4.25l-0.48,0.08c0,0-14.82,4.27-16.01,6.89v51.61C279.22,175.17,283.65,180.41,295.31,181.74z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_DRIVER_BODY_PANEL. */}
      <VehiclePart
        id="front_driver_body_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M293.54,110.17c0,0-18.64-6.31-39.54-5.64l-96.02,0.3v8.59c2.09-1.29,4.05-2.06,5.61-2.53 c0.12-0.05,0.3-0.1,0.5-0.14c1.71-0.47,2.8-0.54,2.8-0.54c44.81-3.62,78.19-2.52,87.75-2.08h0c0.1,0,0.2,0,0.3-0.01 c7.06-0.23,14.22,0.58,20.12,1.58c4.81,0.67,8.65,1.51,11.71,2.43l10.8-0.55C296.4,111.04,295.07,110.56,293.54,110.17z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_DRIVER_PANEL. */}
      <VehiclePart
        id="front_driver_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M133.79,104.91c0,0-17.12-1.93-30.02,6.1l0.45,0.21l33.11-1l19.29,2.71c0,0-10.29,9.64-11.89,20.89 c-0.15,1.03-0.27,2.12-0.38,3.22c0.43-2.54,1.03-5.12,1.87-7.65c0.75-2.31,1.63-4.36,2.62-6.15c1.97-3.62,4.64-6.83,8.19-9.18 c0.32-0.21,0.63-0.43,0.96-0.63c0,0,0,0,0,0l0,0v-8.59L133.79,104.91z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_PASSENGER_PANEL. */}
      <VehiclePart
        id="front_passenger_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M154.12,182.16c-1.12-1.03-2.13-2.15-3.03-3.34c1.64,2.73,3.52,5.24,5.52,6.74l-17.36,1.84l-33.55,1 c4.35,2.39,9.84,4.28,16.84,5.31h35.45v-8.35C157.4,185.52,155.91,184.33,154.12,182.16z" />
      </VehiclePart>

      {/* NEW id, not in EXTERIOR_PARTS. Source SVG id was FRONT_PASSENGER_BODY_PANEL. */}
      <VehiclePart
        id="front_passenger_body_panel"
        parts={parts}
        activePartId={activePartId}
        onPartClick={onPartClick}
      >
        <path d="M289.04,186.22c-0.38,0.15-0.77,0.28-1.16,0.41l0.08,0.04c0,0-0.91,0.39-3.43,0.87 c-1.98,0.43-3.79,0.64-5.12,0.75c-4.96,0.57-12.51,1.07-23.75,1.05c-0.1,0-0.2,0-0.3-0.01l-20.22,0.02 c-5.24,0.03-10.38,0.03-15.34,0.01l-13.42,0.01h-0.05c0,0-4.56-0.09-10.75-0.26c-17.18-0.29-28.69-0.71-28.69-0.71 c-1.12-0.21-2.17-0.49-3.18-0.8c-0.76-0.1-1.31-0.2-1.6-0.3c0,0,0.12-0.04,0.34-0.12c-1.54-0.56-2.95-1.23-4.26-2 c0,0.01-0.01,0.01-0.01,0.02c-0.05,0.08-0.11,0.14-0.2,0.16v8.35h99.88c0,0,32.79-1.26,39.86-6.31c0,0,0.52-0.17,1.27-0.64 L289.04,186.22z" />
      </VehiclePart>

      {/* Decorative gap-fill layer. The source SVG has ~30 additional tiny <path
          class="st8"> fragments with no id and no tooltip handler (i.e. not wrapped
          in the maplink <a> elements above) - they look like seam/anti-aliasing
          filler slivers left over from the original vector export, mostly at the
          joins between panels. They aren't clickable in the source either, so
          they're rendered here as one static, non-interactive layer rather than
          guessed onto a specific panel above (their placement can't be reliably
          attributed from path data alone). A zero-area duplicate-point polygon
          from the source ("157.98,113.43" x3) was dropped since it renders nothing.
          If you need pixel-perfect highlight coloring across these seams, you'll
          want to move individual fragments into the matching VehiclePart above
          after visually checking the rendered diagram. */}
      {/* <g fill="none" stroke="currentColor" strokeWidth="0.5" pointerEvents="none">
        <path d="M205.67,108.09l48.97,0.05c-9.55-0.45-42.94-1.55-87.75,2.08c0,0-1.1,0.07-2.8,0.54 c5.66-1.33,41.54-2.67,41.54-2.67L205.67,108.09z" />
        <path d="M288.67,112.75c-0.6-0.21-1.23-0.42-1.91-0.62c-3.06-0.92-6.9-1.76-11.71-2.43 C282.59,110.98,288.06,112.57,288.67,112.75z" />
        <path d="M235.14,189.35l-15.34,0.01C224.76,189.38,229.9,189.38,235.14,189.35z" />
        <path d="M284.52,187.53c-1.27,0.24-2.94,0.5-5.12,0.75C280.74,188.18,282.55,187.96,284.52,187.53z" />
        <path d="M143.77,157.26c0.02,0.24,0.05,0.49,0.07,0.73c-0.02-0.2-0.04-0.41-0.06-0.61 C143.78,157.37,143.78,157.33,143.77,157.26z" />
        <path d="M146.21,129.39c0.7-2.12,1.56-4.19,2.62-6.15C147.84,125.03,146.95,127.07,146.21,129.39z" />
        <path d="M144.44,162.34c0.24,1.38,0.55,2.78,0.92,4.19c1.14,4.32,2.94,8.62,5.73,12.3c0.9,1.19,1.91,2.3,3.03,3.34 c-3.78-4.56-8.94-13.44-10.16-23.12C144.08,160.12,144.24,161.22,144.44,162.34z" />
        <path d="M166.9,188.4c0,0,11.51,0.42,28.69,0.71c-10.79-0.3-26.55-0.83-31.88-1.51 C164.73,187.91,165.78,188.19,166.9,188.4z" />
        <path d="M91.99,173.48c-1.64-3.98-2.18-7.71-2.31-10.37C89.81,165.77,90.35,169.51,91.99,173.48z" />
        <path d="M158.18,185.19c0-0.01,0.01-0.01,0.01-0.02c-1.5-0.89-2.86-1.89-4.08-3.02 C156.17,184.65,157.82,185.85,158.18,185.19z" />
        <path d="M235.14,189.35l20.22-0.02c0.1,0,0.2,0,0.3,0.01l-0.23-0.25C248.61,189.23,241.79,189.31,235.14,189.35z" />
        <path d="M206.39,189.37l13.42-0.01c-4.63-0.02-9.1-0.05-13.36-0.1L206.39,189.37z" />
        <path d="M195.59,189.11c6.19,0.17,10.75,0.26,10.75,0.26h0.05l0.06-0.11C202.64,189.22,199,189.17,195.59,189.11z" />
        <path d="M162.11,187.3c0.29,0.1,0.84,0.2,1.6,0.3c-0.43-0.13-0.85-0.27-1.26-0.42 C162.23,187.25,162.11,187.3,162.11,187.3z" />
        <path d="M287.96,186.66l-0.08-0.04c-1.14,0.38-2.27,0.67-3.36,0.9C287.05,187.05,287.96,186.66,287.96,186.66z" />
        <path d="M255.43,189.08l0.23,0.25c11.24,0.02,18.79-0.48,23.75-1.05c-1.39,0.11-2.26,0.11-2.26,0.11 C270.03,188.71,262.72,188.93,255.43,189.08z" />
        <path d="M143.87,143.78c0.01-0.21,0.02-0.42,0.03-0.63c-0.01,0.22-0.03,0.44-0.04,0.67 C143.87,143.8,143.87,143.78,143.87,143.78z" />
        <path d="M146.21,129.39c-0.83,2.52-1.44,5.11-1.87,7.65c-0.14,1.43-0.25,2.92-0.34,4.41 C144.32,136.76,145.11,132.78,146.21,129.39z" />
        <path d="M157.02,114.06c-3.56,2.36-6.22,5.56-8.19,9.18C151.22,118.89,154.19,115.99,157.02,114.06z" />
        <path d="M254.94,108.13c-0.1,0-0.2,0-0.3,0.01h0c0.1,0,0.19,0.01,0.29,0.01L254.94,108.13z" />
        <path d="M163.59,110.9L163.59,110.9c0.17-0.05,0.34-0.1,0.5-0.14C163.89,110.8,163.71,110.85,163.59,110.9z" />
        <path d="M257.43,108.28l3.32,0.14c5.54,0.27,10.27,0.72,14.31,1.28c-5.9-1-13.06-1.8-20.12-1.58l-0.02,0.02 C256.56,108.23,257.43,108.28,257.43,108.28z" />
        <path d="M98.53,115.12c0.79-0.79,1.62-1.52,2.48-2.19C100.15,113.61,99.32,114.33,98.53,115.12z" />
        <path d="M96.34,180.77c1.18,1.45,2.58,2.86,4.21,4.19C98.92,183.63,97.52,182.22,96.34,180.77z" />
        <path d="M145.04,165.64c0,0,0.11,0.33,0.32,0.89c-0.37-1.4-0.67-2.8-0.92-4.19 C144.61,163.73,144.82,164.86,145.04,165.64z" />
        <path d="M288.73,112.77c0,0-0.02-0.01-0.06-0.02C288.69,112.76,288.71,112.76,288.73,112.77L288.73,112.77z" />
        <path d="M295.82,181.84l0-0.02c-0.01,0.01-0.02,0.02-0.02,0.03C295.81,181.84,295.82,181.84,295.82,181.84z" />
        <path d="M143.87,143.82c0.01-0.22,0.03-0.44,0.04-0.67c0.03-0.57,0.06-1.14,0.09-1.7c0.09-1.5,0.2-2.98,0.34-4.41 c-1.68,9.97-0.7,19.12-0.57,20.22C143.11,150.04,143.81,144.31,143.87,143.82z" />
        <path d="M96.33,180.76c-1.95-2.39-3.35-4.88-4.34-7.28C92.98,175.88,94.38,178.37,96.33,180.76z" />
        <path d="M105.67,188.4l0.03,0c-0.32-0.17-0.63-0.35-0.94-0.53C105.07,188.05,105.36,188.23,105.67,188.4z" />
        <path d="M103.77,111c-0.03,0.02-0.06,0.04-0.1,0.06C103.7,111.04,103.74,111.02,103.77,111L103.77,111z" />
        <path d="M102.42,186.38c-0.66-0.46-1.28-0.94-1.87-1.42C101.14,185.44,101.76,185.92,102.42,186.38z" />
      </g> */}
    </>
  );
};