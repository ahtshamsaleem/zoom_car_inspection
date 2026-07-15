import {
  EXTERIOR_PARTS,
  CHASSIS_ITEMS,
  ENGINE_ITEMS,
  TRANSMISSION_ITEMS,
  SUSPENSION_ITEMS,
  BRAKES_ITEMS,
  STEERING_ITEMS,
  TIRE_POSITIONS,
  INTERIOR_ITEMS,
  ELECTRONICS_ITEMS,
  ROAD_TEST_ITEMS,
} from "@/constants/inspection"; // ⚠️ adjust this to wherever your constants file actually lives

export type SectionOption = { id: string; label: string };

export type SectionDefinition = {
  key: string; // must exactly match the "<key>_data" column on inspections
  label: string;
  options: SectionOption[];
};

// EXTERIOR_PARTS uses `id`, the rest use `key` — normalize both into `id`
function normalize(
  items: readonly ({ id: string; label: string } | { key: string; label: string })[]
): SectionOption[] {
  return items.map((item) => ({
    id: "id" in item ? item.id : item.key,
    label: item.label,
  }));
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  { key: "exterior", label: "Exterior", options: normalize(EXTERIOR_PARTS) },
  { key: "paint", label: "Paint", options: normalize(EXTERIOR_PARTS) }, // paint condition is marked per panel too
  { key: "chassis", label: "Chassis", options: normalize(CHASSIS_ITEMS) },
  { key: "engine", label: "Engine", options: normalize(ENGINE_ITEMS) },
  { key: "transmission", label: "Transmission", options: normalize(TRANSMISSION_ITEMS) },
  { key: "suspension", label: "Suspension", options: normalize(SUSPENSION_ITEMS) },
  { key: "brakes", label: "Brakes", options: normalize(BRAKES_ITEMS) },
  { key: "steering", label: "Steering", options: normalize(STEERING_ITEMS) },
  { key: "tires", label: "Tires", options: normalize(TIRE_POSITIONS) },
  { key: "interior", label: "Interior", options: normalize(INTERIOR_ITEMS) },
  { key: "electronics", label: "Electronics", options: normalize(ELECTRONICS_ITEMS) },
  { key: "road_test", label: "Road Test", options: normalize(ROAD_TEST_ITEMS) },
];