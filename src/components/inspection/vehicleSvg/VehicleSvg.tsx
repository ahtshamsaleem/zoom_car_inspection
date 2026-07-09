import { VehiclePart } from "./VehiclePart";
import { VEHICLE_PART_MARKUP, VEHICLE_STATIC_MARKUP } from "./vehiclePartMarkup";
import { EXTERIOR_PARTS } from "@/constants/inspection";
import { VehicleSvgProps } from "./types";

// pull this from the root <svg viewBox="..."> of your actual vehicle-clean.svg
const VIEW_BOX = "0 0 2000 2000";

export const VehicleSvg = ({ parts, activePartId, onPartClick }: VehicleSvgProps) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      className="w-full h-full"
    >
      {/* non-interactive shapes with no exterior-part mapping yet */}
      <g pointerEvents="none" fill="#E2E8F0" dangerouslySetInnerHTML={{ __html: VEHICLE_STATIC_MARKUP }} />

      {EXTERIOR_PARTS.map(({ id }) => {
        const markup = VEHICLE_PART_MARKUP[id];
        if (!markup) return null;
        return (
          <VehiclePart key={id} id={id} parts={parts} activePartId={activePartId} onPartClick={onPartClick}>
            <g dangerouslySetInnerHTML={{ __html: markup }} />
          </VehiclePart>
        );
      })}
    </svg>
  );
};




























// import { Front } from "./parts/Front";
// import { Left } from "./parts/Left";
// import { Rear } from "./parts/Rear";
// import { Right } from "./parts/Right";
// import { Top } from "./parts/Top";
 
// import { VehicleSvgProps } from "./types";
 



// export const VehicleSvg = ({
//   parts,
//   activePartId,
//   onPartClick,
// }: VehicleSvgProps) => {
//   return (
//     <svg
//       version="1.1"
//       id="Layer_1"
//       xmlns="http://www.w3.org/2000/svg"
//        viewBox="0 0 400 300"
      
//       className="w-full h-full "
      
//     >
 
//  <Top onPartClick={onPartClick} activePartId={activePartId} parts={parts} />

//  <Right onPartClick={onPartClick} activePartId={activePartId} parts={parts} />
//  <Left onPartClick={onPartClick} activePartId={activePartId} parts={parts} />


//  <Rear onPartClick={onPartClick} activePartId={activePartId} parts={parts} />
//  <Front onPartClick={onPartClick} activePartId={activePartId} parts={parts} />






//     </svg>
//   );
// };