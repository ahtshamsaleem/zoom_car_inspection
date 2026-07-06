"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { INSPECTION_STEPS, CHASSIS_ITEMS, ENGINE_ITEMS, TRANSMISSION_ITEMS, SUSPENSION_ITEMS, BRAKES_ITEMS, STEERING_ITEMS, INTERIOR_ITEMS, ELECTRONICS_ITEMS, ROAD_TEST_ITEMS } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import { CustomerStep } from "@/components/inspection/steps/customer-step";
import { VehicleStep } from "@/components/inspection/steps/vehicle-step";
import { ExteriorStep } from "@/components/inspection/steps/exterior-step";
import { PaintStep } from "@/components/inspection/steps/paint-step";
import { ChecklistStep } from "@/components/inspection/steps/checklist-step";
import { TiresStep } from "@/components/inspection/steps/tires-step";
import { PhotosStep } from "@/components/inspection/steps/photos-step";

interface InspectionWizardProps {
  inspectionId?: string;
}

export function InspectionWizard({ inspectionId }: InspectionWizardProps) {
  const router = useRouter();
  const store = useInspectionStore();
  const [saving, setSaving] = useState(false);
  const currentStep = store.currentStep;
  const totalSteps = INSPECTION_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const saveInspection = useCallback(
    async (status: "draft" | "in_progress" | "completed" = "in_progress") => {
      setSaving(true);
      const payload = {
        status,
        current_step: store.currentStep,
        customer_data: store.customer,
        vehicle_data: store.vehicle,
        exterior_data: store.exterior,
        paint_data: store.paint,
        chassis_data: store.chassis,
        engine_data: store.engine,
        transmission_data: store.transmission,
        suspension_data: store.suspension,
        brakes_data: store.brakes,
        steering_data: store.steering,
        tires_data: store.tires,
        interior_data: store.interior,
        electronics_data: store.electronics,
        road_test_data: store.roadTest,
        photos_data: store.photos,
        started_at: store.startedAt,
        ...(status === "completed" && {
          completed_at: new Date().toISOString(),
        }),
      };

      try {
        const id = store.inspectionId || inspectionId;
        let res;

        if (id) {
          res = await fetch(`/api/inspections/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch("/api/inspections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");

        if (!store.inspectionId && data.id) {
          store.setInspectionId(data.id);
        }

        toast.success(
          status === "completed" ? "Inspection completed!" : "Progress saved"
        );

        if (status === "completed") {
          store.reset();
          router.push(`/inspections/${data.id}/report`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [store, inspectionId, router]
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CustomerStep />;
      case 2:
        return <VehicleStep />;
      case 3:
        return <ExteriorStep />;
      case 4:
        return <PaintStep />;
      case 5:
        return (
          <ChecklistStep
            title="Chassis Inspection"
            description="Inspect structural components and accident evidence"
            items={CHASSIS_ITEMS}
            section="chassis"
          />
        );
      case 6:
        return (
          <ChecklistStep
            title="Engine Inspection"
            description="Check engine components, fluids, and performance indicators"
            items={ENGINE_ITEMS}
            section="engine"
          />
        );
      case 7:
        return (
          <ChecklistStep
            title="Transmission Inspection"
            description="Inspect transmission system and related components"
            items={TRANSMISSION_ITEMS}
            section="transmission"
          />
        );
      case 8:
        return (
          <ChecklistStep
            title="Suspension Inspection"
            description="Check suspension components at all corners"
            items={SUSPENSION_ITEMS}
            section="suspension"
          />
        );
      case 9:
        return (
          <ChecklistStep
            title="Brakes Inspection"
            description="Inspect brake system components"
            items={BRAKES_ITEMS}
            section="brakes"
          />
        );
      case 10:
        return (
          <ChecklistStep
            title="Steering Inspection"
            description="Check steering system components"
            items={STEERING_ITEMS}
            section="steering"
          />
        );
      case 11:
        return <TiresStep />;
      case 12:
        return (
          <ChecklistStep
            title="Interior Inspection"
            description="Inspect interior features and components"
            items={INTERIOR_ITEMS}
            section="interior"
          />
        );
      case 13:
        return (
          <ChecklistStep
            title="Electronics Inspection"
            description="Run diagnostics and check electronic systems"
            items={ELECTRONICS_ITEMS}
            section="electronics"
          />
        );
      case 14:
        return (
          <ChecklistStep
            title="Road Test"
            description="Record findings from the road test"
            items={ROAD_TEST_ITEMS}
            section="roadTest"
          />
        );
      case 15:
        return <PhotosStep />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
            <h1 className="text-lg font-semibold">
              {INSPECTION_STEPS[currentStep - 1]?.label}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveInspection("draft")}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          {INSPECTION_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => store.setCurrentStep(step.id)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                step.id === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.id < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => store.setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={() => {
              saveInspection("in_progress");
              store.setCurrentStep(currentStep + 1);
            }}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => saveInspection("completed")}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete Inspection
          </Button>
        )}
      </div>
    </div>
  );
}
