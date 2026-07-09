import type { PartCondition } from "@/types";

export const INSPECTION_STEPS = [
  { id: 1, key: "customer", label: "Customer Info" },
  { id: 2, key: "vehicle", label: "Vehicle Info" },
  { id: 3, key: "exterior", label: "Exterior" },
  { id: 4, key: "paint", label: "Paint" },
  { id: 5, key: "chassis", label: "Chassis" },
  { id: 6, key: "engine", label: "Engine" },
  { id: 7, key: "transmission", label: "Transmission" },
  { id: 8, key: "suspension", label: "Suspension" },
  { id: 9, key: "brakes", label: "Brakes" },
  { id: 10, key: "steering", label: "Steering" },
  { id: 11, key: "tires", label: "Tires" },
  { id: 12, key: "interior", label: "Interior" },
  { id: 13, key: "electronics", label: "Electronics" },
  { id: 14, key: "roadTest", label: "Road Test" },
  { id: 15, key: "photos", label: "Photos" },
] as const;



export const EXTERIOR_PARTS = [
  { id: "hood", label: "Hood" },
  { id: "windshield", label: "Windshield" },
  { id: "roof", label: "Roof" },
  { id: "rear_glass", label: "Rear Glass" },
  { id: "trunk", label: "Trunk" },
  { id: "rear_panel", label: "Rear Panel" },
  { id: "front_bumper", label: "Front Bumper" },
  { id: "front_grille", label: "Front Grille" },
  { id: "left_fender", label: "Left Fender" },
  { id: "right_fender", label: "Right Fender" },
  { id: "left_front_door", label: "Left Front Door" },
  { id: "right_front_door", label: "Right Front Door" },
  { id: "left_rear_door", label: "Left Rear Door" },
  { id: "right_rear_door", label: "Right Rear Door" },
  { id: "left_quarter", label: "Left Quarter Panel" },
  { id: "right_quarter", label: "Right Quarter Panel" },
  { id: "rear_bumper", label: "Rear Bumper" },
  { id: "left_mirror", label: "Left Mirror" },
  { id: "right_mirror", label: "Right Mirror" },
// --- WINDOWS (SPLIT INTO 4) ---
  { id: "left_front_window", label: "Left Front Window" },
  { id: "left_rear_window", label: "Left Rear Window" },
  { id: "right_front_window", label: "Right Front Window" },
  { id: "right_rear_window", label: "Right Rear Window" },

  // --- NEWLY ADDED PARTS ---
  { id: "left_rocker_panel", label: "Left Rocker Panel" },
  { id: "right_rocker_panel", label: "Right Rocker Panel" },
  { id: "left_front_wheel", label: "Left Front Wheel" },
  { id: "right_front_wheel", label: "Right Front Wheel" },
  { id: "left_rear_wheel", label: "Left Rear Wheel" },
  { id: "right_rear_wheel", label: "Right Rear Wheel" },
  { id: "left_front_tire", label: "Left Front Tire" },
  { id: "right_front_tire", label: "Right Front Tire" },
  { id: "left_rear_tire", label: "Left Rear Tire" },
  { id: "right_rear_tire", label: "Right Rear Tire" },
  { id: "left_headlight", label: "Left Headlight" },
  { id: "right_headlight", label: "Right Headlight" },
  { id: "body_trim", label: "Body Trim" },
  { id: "spare_wheel", label: "Spare Wheel" },
  { id: "spare_tire", label: "Spare Tire" }









] as const;




// export const EXTERIOR_PARTS = [
//   { id: "hood", label: "Hood" },
//   { id: "front_bumper", label: "Front Bumper" },
//   { id: "front_grille", label: "Front Grille" },
//   { id: "left_fender", label: "Left Fender" },
//   { id: "right_fender", label: "Right Fender" },
//   { id: "left_front_door", label: "Left Front Door" },
//   { id: "right_front_door", label: "Right Front Door" },
//   { id: "left_rear_door", label: "Left Rear Door" },
//   { id: "right_rear_door", label: "Right Rear Door" },
//   { id: "left_quarter", label: "Left Quarter Panel" },
//   { id: "right_quarter", label: "Right Quarter Panel" },
//   { id: "roof", label: "Roof" },
//   { id: "trunk", label: "Trunk" },
//   { id: "rear_bumper", label: "Rear Bumper" },
//   { id: "left_mirror", label: "Left Mirror" },
//   { id: "right_mirror", label: "Right Mirror" },
//   { id: "windshield", label: "Windshield" },
//   { id: "rear_glass", label: "Rear Glass" },
//   { id: "side_windows", label: "Side Windows" },
// ] as const;

export const PART_CONDITIONS: { value: PartCondition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "scratch", label: "Scratch" },
  { value: "dent", label: "Dent" },
  { value: "crack", label: "Crack" },
  { value: "broken", label: "Broken" },
  { value: "repainted", label: "Repainted" },
  { value: "rust", label: "Rust" },
  { value: "misaligned", label: "Misaligned" },
];

export const SEVERITY_OPTIONS = [
  { value: "minor", label: "Minor" },
  { value: "medium", label: "Medium" },
  { value: "major", label: "Major" },
] as const;

export const CONDITION_COLORS: Record<PartCondition, string> = {
  good: "#22c55e",
  scratch: "#eab308",
  dent: "#f97316",
  crack: "#ef4444",
  broken: "#dc2626",
  repainted: "#a855f7",
  rust: "#92400e",
  misaligned: "#ec4899",
};

export const CHASSIS_ITEMS = [
  "Front Chassis Leg",
  "Rear Chassis Leg",
  "Cross Member",
  "Apron",
  "Radiator Support",
  "Pillars",
  "Roof Structure",
  "Subframe",
  "Floor Pan",
  "Accident Damage",
  "Repair Evidence",
];

export const ENGINE_ITEMS = [
  "Oil Leak",
  "Coolant Leak",
  "Engine Mount",
  "Belts",
  "Battery",
  "Alternator",
  "Starter",
  "Radiator",
  "Cooling Fan",
  "Turbo",
  "Engine Noise",
  "Smoke",
  "Oil Level",
  "Coolant Level",
];

export const TRANSMISSION_ITEMS = [
  "Fluid Leak",
  "Gear Shift",
  "Transmission Mount",
  "CVT",
  "Automatic",
  "Manual",
  "Transfer Case",
  "Differential",
];

export const SUSPENSION_ITEMS = [
  "Front Left",
  "Front Right",
  "Rear Left",
  "Rear Right",
  "Shock Absorbers",
  "Control Arms",
  "Bushings",
  "Ball Joints",
  "Tie Rod Ends",
  "Wheel Bearings",
  "Sway Bar Links",
];

export const BRAKES_ITEMS = [
  "Brake Pads",
  "Brake Discs",
  "Brake Calipers",
  "Brake Lines",
  "Brake Fluid",
  "Parking Brake",
  "ABS",
];

export const STEERING_ITEMS = [
  "Power Steering Pump",
  "Rack & Pinion",
  "Steering Column",
  "Tie Rod",
  "Steering Fluid",
];

export const TIRE_POSITIONS = [
  "Front Left",
  "Front Right",
  "Rear Left",
  "Rear Right",
  "Spare",
];

export const INTERIOR_ITEMS = [
  "Seats",
  "Dashboard",
  "Steering Wheel",
  "Airbags",
  "Seat Belts",
  "AC",
  "Radio",
  "Bluetooth",
  "Navigation",
  "Power Windows",
  "Sunroof",
  "Interior Lights",
  "Horn",
  "Camera",
  "Parking Sensors",
];

export const ELECTRONICS_ITEMS = [
  "OBD Scan",
  "Engine Codes",
  "ABS Codes",
  "Transmission Codes",
  "Airbag Codes",
  "Battery Voltage",
  "Charging Voltage",
];

export const ROAD_TEST_ITEMS = [
  "Engine Performance",
  "Acceleration",
  "Braking",
  "Transmission",
  "Steering",
  "Suspension Noise",
  "Wind Noise",
  "Vibration",
  "Cruise Control",
  "Lane Assist",
  "Adaptive Cruise",
];

export const PHOTO_CATEGORIES = [
  { key: "front", label: "Front" },
  { key: "rear", label: "Rear" },
  { key: "left_side", label: "Left Side" },
  { key: "right_side", label: "Right Side" },
  { key: "interior", label: "Interior" },
  { key: "odometer", label: "Odometer" },
  { key: "vin_plate", label: "VIN Plate" },
  { key: "engine_bay", label: "Engine Bay" },
  { key: "underbody", label: "Underbody" },
  { key: "damage", label: "Damage Photos" },
] as const;

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
export const TRANSMISSION_TYPES = ["Automatic", "Manual", "CVT", "DCT"];
