import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ChecklistItem,
  CustomerFormData,
  PartInspection,
  PaintPanelInspection,
  TireInspection,
  VehicleFormData,
  Stroke
} from "@/types";

 
interface InspectionState {
  inspectionId: string | null;
  currentStep: number;
  customer: CustomerFormData;
  vehicle: VehicleFormData;
  exterior: Record<string, PartInspection>;
  paint: Record<string, PaintPanelInspection>;
  chassis: Record<string, ChecklistItem>;
  engine: Record<string, ChecklistItem>;
  transmission: Record<string, ChecklistItem>;
  suspension: Record<string, ChecklistItem>;
  brakes: Record<string, ChecklistItem>;
  steering: Record<string, ChecklistItem>;
  tires: Record<string, TireInspection>;
  interior: Record<string, ChecklistItem>;
  electronics: Record<string, ChecklistItem>;
  roadTest: Record<string, ChecklistItem>;
  photos: Record<string, string[]>;
  startedAt: string | null;
  activePartId: string | null;
  annotations: Stroke[];
  templateSections: string[] | null;

  setInspectionId: (id: string | null) => void;
  setCurrentStep: (step: number) => void;
  setCustomer: (data: Partial<CustomerFormData>) => void;
  setVehicle: (data: Partial<VehicleFormData>) => void;
  setExteriorPart: (partId: string, data: PartInspection) => void;
  setPaintPanel: (panelId: string, data: PaintPanelInspection) => void;
  setChecklistItem: (
    section:
      | "chassis"
      | "engine"
      | "transmission"
      | "suspension"
      | "brakes"
      | "steering"
      | "interior"
      | "electronics"
      | "roadTest",
    key: string,
    data: ChecklistItem
  ) => void;
  setTire: (position: string, data: TireInspection) => void;
  addPhoto: (category: string, url: string) => void;
  removePhoto: (category: string, url: string) => void;
  setActivePartId: (partId: string | null) => void;
  startInspection: () => void;
  reset: () => void;
  loadFromInspection: (data: Record<string, unknown>) => void;
  setAnnotations: (strokes: Stroke[]) => void;
   setTemplateSections: (sections: string[] | null) => void;
}

const initialCustomer: CustomerFormData = {
  name: "",
  mobile: "",
  email: "",
  emiratesId: "",
};

const initialVehicle: VehicleFormData = {
  vin: "",
  plateNumber: "",
  make: "",
  model: "",
  trim: "",
  year: undefined,
  mileage: undefined,
  engineSize: "",
  fuelType: "",
  transmission: "",
  color: "",
  chassisNumber: "",
};

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set) => ({
      inspectionId: null,
      currentStep: 1,
      customer: initialCustomer,
      vehicle: initialVehicle,
      exterior: {},
      paint: {},
      chassis: {},
      engine: {},
      transmission: {},
      suspension: {},
      brakes: {},
      steering: {},
      tires: {},
      interior: {},
      electronics: {},
      roadTest: {},
      photos: {},
      startedAt: null,
      activePartId: null,
      annotations: [],
       templateSections: null,

      setInspectionId: (id) => set({ inspectionId: id }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setCustomer: (data) =>
        set((s) => ({ customer: { ...s.customer, ...data } })),
      setVehicle: (data) =>
        set((s) => ({ vehicle: { ...s.vehicle, ...data } })),
      setExteriorPart: (partId, data) =>
        set((s) => ({
          exterior: { ...s.exterior, [partId]: data },
        })),
      setPaintPanel: (panelId, data) =>
        set((s) => ({
          paint: { ...s.paint, [panelId]: data },
        })),
      setChecklistItem: (section, key, data) =>
        set((s) => ({
          [section]: { ...s[section], [key]: data },
        })),
      setTire: (position, data) =>
        set((s) => ({
          tires: { ...s.tires, [position]: data },
        })),
      addPhoto: (category, url) =>
        set((s) => ({
          photos: {
            ...s.photos,
            [category]: [...(s.photos[category] || []), url],
          },
        })),
      removePhoto: (category, url) =>
        set((s) => ({
          photos: {
            ...s.photos,
            [category]: (s.photos[category] || []).filter((u) => u !== url),
          },
        })),
      setActivePartId: (partId) => set({ activePartId: partId }),
      startInspection: () =>
        set({ startedAt: new Date().toISOString(), currentStep: 1 }),
       setAnnotations: (strokes) => set({ annotations: strokes }),
       setTemplateSections: (sections) => set({ templateSections: sections }),
      reset: () =>
        set({
          inspectionId: null,
          currentStep: 1,
          customer: initialCustomer,
          vehicle: initialVehicle,
          exterior: {},
          paint: {},
          chassis: {},
          engine: {},
          transmission: {},
          suspension: {},
          brakes: {},
          steering: {},
          tires: {},
          interior: {},
          electronics: {},
          roadTest: {},
          photos: {},
          startedAt: null,
          activePartId: null,
          annotations: [],
           templateSections: null,
        }),
      loadFromInspection: (data) =>
        set({
          inspectionId: (data.id as string) || null,
          currentStep: (data.current_step as number) || 1,
          customer: (data.customer_data as CustomerFormData) || initialCustomer,
          vehicle: (data.vehicle_data as VehicleFormData) || initialVehicle,
          exterior: (data.exterior_data as Record<string, PartInspection>) || {},
          paint: (data.paint_data as Record<string, PaintPanelInspection>) || {},
          chassis: (data.chassis_data as Record<string, ChecklistItem>) || {},
          engine: (data.engine_data as Record<string, ChecklistItem>) || {},
          transmission:
            (data.transmission_data as Record<string, ChecklistItem>) || {},
          suspension:
            (data.suspension_data as Record<string, ChecklistItem>) || {},
          brakes: (data.brakes_data as Record<string, ChecklistItem>) || {},
          steering: (data.steering_data as Record<string, ChecklistItem>) || {},
          tires: (data.tires_data as Record<string, TireInspection>) || {},
          interior: (data.interior_data as Record<string, ChecklistItem>) || {},
          electronics:
            (data.electronics_data as Record<string, ChecklistItem>) || {},
          roadTest: (data.road_test_data as Record<string, ChecklistItem>) || {},
          photos: (data.photos_data as Record<string, string[]>) || {},
          startedAt: (data.started_at as string) || null,
          annotations: (data.annotations_data as Stroke[]) || [],
        }),
    }),
    { name: "zoom-inspection-draft" }
  )
);
