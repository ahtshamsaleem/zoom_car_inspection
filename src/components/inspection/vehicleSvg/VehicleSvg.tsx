import { Front } from "./parts/Front";
import { Left } from "./parts/Left";
import { Rear } from "./parts/Rear";
import { Right } from "./parts/Right";
import { Top } from "./parts/Top";
 
import { VehicleSvgProps } from "./types";
 



export const VehicleSvg = ({
  parts,
  activePartId,
  onPartClick,
}: VehicleSvgProps) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 400 300"
      
      className="w-full h-full "
      
    >
 
 <Top onPartClick={onPartClick} activePartId={activePartId} parts={parts} />

 <Right onPartClick={onPartClick} activePartId={activePartId} parts={parts} />
 <Left onPartClick={onPartClick} activePartId={activePartId} parts={parts} />


 <Rear onPartClick={onPartClick} activePartId={activePartId} parts={parts} />
 <Front onPartClick={onPartClick} activePartId={activePartId} parts={parts} />






    </svg>
  );
};