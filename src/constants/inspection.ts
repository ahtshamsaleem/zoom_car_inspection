import type { PartCondition } from "@/types";


export const DEFAULT_ACCENT = "#2563eb";



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
  { id: "left_front_window", label: "Left Front Window" },
  { id: "left_rear_window", label: "Left Rear Window" },
  { id: "right_front_window", label: "Right Front Window" },
  { id: "right_rear_window", label: "Right Rear Window" },
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
  { id: "left_taillight", label: "Left Taillight" },
  { id: "right_taillight", label: "Right Taillight" },
  { id: "body_trim", label: "Body Trim" },
  { id: "spare_wheel", label: "Spare Wheel" },
  { id: "spare_tire", label: "Spare Tire" },
  { id: "left_side_roof_rails", label: "Left Side Roof Rails" },
  { id: "right_side_roof_rails", label: "Right Side Roof Rails" },
  { id: "left_side_front_pillar", label: "Left Side Front Pillar" },
  { id: "right_side_front_pillar", label: "Right Side Front Pillar" },
] as const;

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
  good: "#ffffff",
  scratch: "#eab308",
  dent: "#f97316",
  crack: "#ef4444",
  broken: "#dc2626",
  repainted: "#a855f7",
  rust: "#92400e",
  misaligned: "#ec4899",
};

// --- Converted from plain string[] to { key, label }[] for i18n lookup ---

export const CHASSIS_ITEMS = [
  { key: "frontChassisLeg", label: "Front Chassis Leg" },
  { key: "rearChassisLeg", label: "Rear Chassis Leg" },
  { key: "crossMember", label: "Cross Member" },
  { key: "apron", label: "Apron" },
  { key: "radiatorSupport", label: "Radiator Support" },
  { key: "pillars", label: "Pillars" },
  { key: "roofStructure", label: "Roof Structure" },
  { key: "subframe", label: "Subframe" },
  { key: "floorPan", label: "Floor Pan" },
  { key: "accidentDamage", label: "Accident Damage" },
  { key: "repairEvidence", label: "Repair Evidence" },
] as const;

export const ENGINE_ITEMS = [
  { key: "oilLeak", label: "Oil Leak" },
  { key: "coolantLeak", label: "Coolant Leak" },
  { key: "engineMount", label: "Engine Mount" },
  { key: "belts", label: "Belts" },
  { key: "battery", label: "Battery" },
  { key: "alternator", label: "Alternator" },
  { key: "starter", label: "Starter" },
  { key: "radiator", label: "Radiator" },
  { key: "coolingFan", label: "Cooling Fan" },
  { key: "turbo", label: "Turbo" },
  { key: "engineNoise", label: "Engine Noise" },
  { key: "smoke", label: "Smoke" },
  { key: "oilLevel", label: "Oil Level" },
  { key: "coolantLevel", label: "Coolant Level" },
] as const;

export const TRANSMISSION_ITEMS = [
  { key: "fluidLeak", label: "Fluid Leak" },
  { key: "gearShift", label: "Gear Shift" },
  { key: "transmissionMount", label: "Transmission Mount" },
  { key: "cvt", label: "CVT" },
  { key: "automatic", label: "Automatic" },
  { key: "manual", label: "Manual" },
  { key: "transferCase", label: "Transfer Case" },
  { key: "differential", label: "Differential" },
] as const;

export const SUSPENSION_ITEMS = [
  { key: "frontLeft", label: "Front Left" },
  { key: "frontRight", label: "Front Right" },
  { key: "rearLeft", label: "Rear Left" },
  { key: "rearRight", label: "Rear Right" },
  { key: "shockAbsorbers", label: "Shock Absorbers" },
  { key: "controlArms", label: "Control Arms" },
  { key: "bushings", label: "Bushings" },
  { key: "ballJoints", label: "Ball Joints" },
  { key: "tieRodEnds", label: "Tie Rod Ends" },
  { key: "wheelBearings", label: "Wheel Bearings" },
  { key: "swayBarLinks", label: "Sway Bar Links" },
] as const;

export const BRAKES_ITEMS = [
  { key: "brakePads", label: "Brake Pads" },
  { key: "brakeDiscs", label: "Brake Discs" },
  { key: "brakeCalipers", label: "Brake Calipers" },
  { key: "brakeLines", label: "Brake Lines" },
  { key: "brakeFluid", label: "Brake Fluid" },
  { key: "parkingBrake", label: "Parking Brake" },
  { key: "abs", label: "ABS" },
] as const;

export const STEERING_ITEMS = [
  { key: "powerSteeringPump", label: "Power Steering Pump" },
  { key: "rackAndPinion", label: "Rack & Pinion" },
  { key: "steeringColumn", label: "Steering Column" },
  { key: "tieRod", label: "Tie Rod" },
  { key: "steeringFluid", label: "Steering Fluid" },
] as const;

export const TIRE_POSITIONS = [
  { key: "frontLeft", label: "Front Left" },
  { key: "frontRight", label: "Front Right" },
  { key: "rearLeft", label: "Rear Left" },
  { key: "rearRight", label: "Rear Right" },
  { key: "spare", label: "Spare" },
] as const;

export const INTERIOR_ITEMS = [
  { key: "seats", label: "Seats" },
  { key: "dashboard", label: "Dashboard" },
  { key: "steeringWheel", label: "Steering Wheel" },
  { key: "airbags", label: "Airbags" },
  { key: "seatBelts", label: "Seat Belts" },
  { key: "ac", label: "AC" },
  { key: "radio", label: "Radio" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "navigation", label: "Navigation" },
  { key: "powerWindows", label: "Power Windows" },
  { key: "sunroof", label: "Sunroof" },
  { key: "interiorLights", label: "Interior Lights" },
  { key: "horn", label: "Horn" },
  { key: "camera", label: "Camera" },
  { key: "parkingSensors", label: "Parking Sensors" },
] as const;

export const ELECTRONICS_ITEMS = [
  { key: "obdScan", label: "OBD Scan" },
  { key: "engineCodes", label: "Engine Codes" },
  { key: "absCodes", label: "ABS Codes" },
  { key: "transmissionCodes", label: "Transmission Codes" },
  { key: "airbagCodes", label: "Airbag Codes" },
  { key: "batteryVoltage", label: "Battery Voltage" },
  { key: "chargingVoltage", label: "Charging Voltage" },
] as const;

export const ROAD_TEST_ITEMS = [
  { key: "enginePerformance", label: "Engine Performance" },
  { key: "acceleration", label: "Acceleration" },
  { key: "braking", label: "Braking" },
  { key: "transmission", label: "Transmission" },
  { key: "steering", label: "Steering" },
  { key: "suspensionNoise", label: "Suspension Noise" },
  { key: "windNoise", label: "Wind Noise" },
  { key: "vibration", label: "Vibration" },
  { key: "cruiseControl", label: "Cruise Control" },
  { key: "laneAssist", label: "Lane Assist" },
  { key: "adaptiveCruise", label: "Adaptive Cruise" },
] as const;

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

export const FUEL_TYPES = [
  { key: "petrol", label: "Petrol" },
  { key: "diesel", label: "Diesel" },
  { key: "hybrid", label: "Hybrid" },
  { key: "electric", label: "Electric" },
  { key: "lpg", label: "LPG" },
] as const;

export const TRANSMISSION_TYPES = [
  { key: "automatic", label: "Automatic" },
  { key: "manual", label: "Manual" },
  { key: "cvt", label: "CVT" },
  { key: "dct", label: "DCT" },
] as const;