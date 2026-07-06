export type UserRole = "manager" | "inspector";

export type InspectionStatus = "draft" | "in_progress" | "completed" | "cancelled";

export type PartCondition =
  | "good"
  | "scratch"
  | "dent"
  | "crack"
  | "broken"
  | "repainted"
  | "rust"
  | "misaligned";

export type Severity = "minor" | "medium" | "major";

export interface Profile {
  id: string;
  company_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  is_active: boolean;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  mobile: string;
  email?: string | null;
  emirates_id?: string | null;
}

export interface Vehicle {
  id: string;
  company_id: string;
  customer_id?: string | null;
  vin?: string | null;
  plate_number: string;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  year?: number | null;
  mileage?: number | null;
  engine_size?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  color?: string | null;
  chassis_number?: string | null;
}

export interface PartInspection {
  condition: PartCondition;
  severity?: Severity;
  notes?: string;
  photoUrl?: string;
}

export interface PaintPanelInspection {
  originalPaint?: boolean;
  repainted?: boolean;
  bodyFiller?: boolean;
  paintThickness?: string;
  micronReading?: number;
}

export interface ChecklistItem {
  status: "good" | "issue" | "na";
  notes?: string;
}

export interface TireInspection {
  brand?: string;
  size?: string;
  dot?: string;
  remainingPercent?: number;
  unevenWear?: boolean;
  sidewallDamage?: boolean;
  cracks?: boolean;
  notes?: string;
}

export interface Inspection {
  id: string;
  company_id: string;
  vehicle_id?: string | null;
  customer_id?: string | null;
  inspector_id?: string | null;
  status: InspectionStatus;
  current_step: number;
  customer_data: CustomerFormData;
  vehicle_data: VehicleFormData;
  exterior_data: Record<string, PartInspection>;
  paint_data: Record<string, PaintPanelInspection>;
  chassis_data: Record<string, ChecklistItem>;
  engine_data: Record<string, ChecklistItem>;
  transmission_data: Record<string, ChecklistItem>;
  suspension_data: Record<string, ChecklistItem>;
  brakes_data: Record<string, ChecklistItem>;
  steering_data: Record<string, ChecklistItem>;
  tires_data: Record<string, TireInspection>;
  interior_data: Record<string, ChecklistItem>;
  electronics_data: Record<string, ChecklistItem>;
  road_test_data: Record<string, ChecklistItem>;
  photos_data: Record<string, string[]>;
  started_at?: string | null;
  completed_at?: string | null;
  inspection_time_minutes?: number | null;
  price?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  mobile: string;
  email?: string;
  emiratesId?: string;
}

export interface VehicleFormData {
  vin?: string;
  plateNumber: string;
  make?: string;
  model?: string;
  trim?: string;
  year?: number;
  mileage?: number;
  engineSize?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  chassisNumber?: string;
}

export interface DashboardStats {
  totalToday: number;
  pending: number;
  completed: number;
  avgInspectionTime: number;
  vehiclesThisMonth: number;
  revenue: number;
  recentInspections?: Array<{
    id: string;
    status: string;
    created_at: string;
    customer_data?: { name?: string };
    vehicle_data?: { plateNumber?: string; make?: string; model?: string };
    profiles?: { full_name?: string };
  }>;
}
