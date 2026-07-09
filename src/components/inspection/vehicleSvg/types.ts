

export interface VehicleSvgProps {
  parts: Record<string, any>;
  activePartId?: string | null;
  onPartClick: (id: string) => void;
}