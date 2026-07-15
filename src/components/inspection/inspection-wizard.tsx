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
import { useTranslation } from "@/hooks/use-translation";
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
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const currentStep = store.currentStep;
  const totalSteps = INSPECTION_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const getStepLabel = (step: (typeof INSPECTION_STEPS)[number]) =>
    t(`constants.inspectionSteps.${step.key}`) || step.label;

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
        
        annotations_data: store.annotations, // add this
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
        if (!res.ok) throw new Error(data.error || t("inspection_wizard.toasts.saveFailed"));

        if (!store.inspectionId && data.id) {
          store.setInspectionId(data.id);
        }

        toast.success(
          status === "completed"
            ? t("inspection_wizard.toasts.completed")
            : t("inspection_wizard.toasts.progressSaved")
        );

        if (status === "completed") {
          store.reset();
          router.push(`/inspections/${data.id}/report`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("inspection_wizard.toasts.saveFailed"));
      } finally {
        setSaving(false);
      }
    },
    [store, inspectionId, router, t]
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
            title={t("inspection_wizard.sections.chassis.title")}
            description={t("inspection_wizard.sections.chassis.description")}
            items={CHASSIS_ITEMS}
            section="chassis"
          />
        );
      case 6:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.engine.title")}
            description={t("inspection_wizard.sections.engine.description")}
            items={ENGINE_ITEMS}
            section="engine"
          />
        );
      case 7:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.transmission.title")}
            description={t("inspection_wizard.sections.transmission.description")}
            items={TRANSMISSION_ITEMS}
            section="transmission"
          />
        );
      case 8:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.suspension.title")}
            description={t("inspection_wizard.sections.suspension.description")}
            items={SUSPENSION_ITEMS}
            section="suspension"
          />
        );
      case 9:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.brakes.title")}
            description={t("inspection_wizard.sections.brakes.description")}
            items={BRAKES_ITEMS}
            section="brakes"
          />
        );
      case 10:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.steering.title")}
            description={t("inspection_wizard.sections.steering.description")}
            items={STEERING_ITEMS}
            section="steering"
          />
        );
      case 11:
        return <TiresStep />;
      case 12:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.interior.title")}
            description={t("inspection_wizard.sections.interior.description")}
            items={INTERIOR_ITEMS}
            section="interior"
          />
        );
      case 13:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.electronics.title")}
            description={t("inspection_wizard.sections.electronics.description")}
            items={ELECTRONICS_ITEMS}
            section="electronics"
          />
        );
      case 14:
        return (
          <ChecklistStep
            title={t("inspection_wizard.sections.roadTest.title")}
            description={t("inspection_wizard.sections.roadTest.description")}
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
              {t("inspection_wizard.stepOf")
                .replace("{current}", String(currentStep))
                .replace("{total}", String(totalSteps))}
            </p>
            <h1 className="text-lg font-semibold">
              {getStepLabel(INSPECTION_STEPS[currentStep - 1])}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveInspection("draft")}
            disabled={saving}
          >
            <Save className="h-4 w-4 me-1" />
            {t("inspection_wizard.saveDraft")}
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
              {getStepLabel(step)}
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
          <ChevronLeft className="h-4 w-4 me-1 rtl:rotate-180" />
          {t("inspection_wizard.previous")}
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={() => {
              saveInspection("in_progress");
              store.setCurrentStep(currentStep + 1);
            }}
          >
            {t("inspection_wizard.next")}
            <ChevronRight className="h-4 w-4 ms-1 rtl:rotate-180" />
          </Button>
        ) : (
          <Button
            onClick={() => saveInspection("completed")}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 me-1" />
            {t("inspection_wizard.completeInspection")}
          </Button>
        )}
      </div>
    </div>
  );
}