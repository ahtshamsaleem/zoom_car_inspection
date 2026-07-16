"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { INSPECTION_STEPS, CHASSIS_ITEMS, ENGINE_ITEMS, TRANSMISSION_ITEMS, SUSPENSION_ITEMS, BRAKES_ITEMS, STEERING_ITEMS, INTERIOR_ITEMS, ELECTRONICS_ITEMS, ROAD_TEST_ITEMS } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";
import { customerSchema, vehicleSchema } from "@/lib/validations/schemas";
import type { StepHandle } from "@/types";
import { CustomerStep } from "@/components/inspection/steps/customer-step";
import { VehicleStep } from "@/components/inspection/steps/vehicle-step";
import { ExteriorStep } from "@/components/inspection/steps/exterior-step";
import { PaintStep } from "@/components/inspection/steps/paint-step";
import { ChecklistStep } from "@/components/inspection/steps/checklist-step";
import { TiresStep } from "@/components/inspection/steps/tires-step";
import { PhotosStep } from "@/components/inspection/steps/photos-step";

interface InspectionWizardProps {
  inspectionId?: string;
  /** Checklist template governing which sections apply to this inspection. */
  templateId?: string;
   pricingId?: string; 
}

// Wizard step ids that map to a template-configurable checklist section.
// Any step id NOT listed here (customer, vehicle, exterior, paint, tires, photos) always shows.
const STEP_ID_TO_SECTION_KEY: Record<number, string> = {
  5: "chassis",
  6: "engine",
  7: "transmission",
  8: "suspension",
  9: "brakes",
  10: "steering",
  12: "interior",
  13: "electronics",
  14: "roadTest",
};

export function InspectionWizard({ inspectionId, templateId, pricingId }: InspectionWizardProps) {
  const router = useRouter();
  const store = useInspectionStore();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const currentStep = store.currentStep;

  const customerStepRef = useRef<StepHandle>(null);
  const vehicleStepRef = useRef<StepHandle>(null);

  // Load the linked template (if any) and keep only its enabled sections.
  useEffect(() => {
    if (!templateId) {
      store.setTemplateSections(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load template");
        const keys: string[] = (data.template_data?.sections ?? []).map(
          (s: { key: string }) => s.key
        );
        if (!cancelled) store.setTemplateSections(keys);
      } catch {
        if (!cancelled) {
          toast.error(
            t("inspection_wizard.toasts.templateLoadFailed") ||
              "Couldn't load the inspection template — showing all sections."
          );
          store.setTemplateSections(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const visibleSteps = INSPECTION_STEPS.filter((step) => {
    const sectionKey = STEP_ID_TO_SECTION_KEY[step.id];
    if (!sectionKey) return true;
    if (!store.templateSections) return true;
    return store.templateSections.includes(sectionKey);
  });

  const totalSteps = visibleSteps.length;
  const currentIndex = visibleSteps.findIndex((step) => step.id === currentStep);
  const progress = totalSteps > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0;
  const prevStep = currentIndex > 0 ? visibleSteps[currentIndex - 1] : null;
  const nextStep =
    currentIndex >= 0 && currentIndex < totalSteps - 1 ? visibleSteps[currentIndex + 1] : null;

  // If the current step falls outside the (possibly just-filtered) list, snap to the first visible one.
  useEffect(() => {
    if (totalSteps > 0 && currentIndex === -1) {
      store.setCurrentStep(visibleSteps[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.templateSections]);

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
        annotations_data: store.annotations,
          template_id: templateId ?? null,   // add this line
           pricing_id: pricingId ?? null, 

        photos_data: store.photos,
        started_at: store.startedAt,
        ...(status === "completed" && { completed_at: new Date().toISOString() }),
      };

      try {
        const id = store.inspectionId || inspectionId;
        const res = id
          ? await fetch(`/api/inspections/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/inspections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("inspection_wizard.toasts.saveFailed"));

        if (!store.inspectionId && data.id) store.setInspectionId(data.id);

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
    [store, inspectionId, router, t, templateId, pricingId]
  );

  // Steps 1 (customer) and 2 (vehicle) must pass their schema before leaving.
  const canLeaveCurrentStep = useCallback(async () => {
    if (currentStep === 1) {
      const valid = await customerStepRef.current?.validate();
      if (!valid) {
        toast.error(
          t("inspection_wizard.toasts.customerRequired") ||
            "Please complete the required customer details before continuing."
        );
        return false;
      }
    }
    if (currentStep === 2) {
      const valid = await vehicleStepRef.current?.validate();
      if (!valid) {
        toast.error(
          t("inspection_wizard.toasts.vehicleRequired") ||
            "Please complete the required vehicle details before continuing."
        );
        return false;
      }
    }
    return true;
  }, [currentStep, t]);

  const handleStepClick = useCallback(
    async (targetId: number) => {
      if (saving) return;
      if (targetId <= currentStep) {
        store.setCurrentStep(targetId);
        return;
      }
      if (!(await canLeaveCurrentStep())) return;
      // Jumping straight from step 1 past step 2 (via the pill nav) still needs
      // valid vehicle data even though the vehicle form isn't mounted right now.
      if (currentStep < 2 && targetId > 2 && !vehicleSchema.safeParse(store.vehicle).success) {
        toast.error(
          t("inspection_wizard.toasts.vehicleRequired") ||
            "Please complete the required vehicle details before continuing."
        );
        store.setCurrentStep(2);
        return;
      }
      store.setCurrentStep(targetId);
    },
    [saving, currentStep, canLeaveCurrentStep, store, t]
  );

  const goNext = useCallback(async () => {
    if (!nextStep || saving) return;
    if (!(await canLeaveCurrentStep())) return;
    saveInspection("in_progress");
    store.setCurrentStep(nextStep.id);
  }, [nextStep, saving, canLeaveCurrentStep, saveInspection, store]);

  const handleComplete = useCallback(async () => {
    if (saving) return;
    const customerOk = customerSchema.safeParse(store.customer).success;
    const vehicleOk = vehicleSchema.safeParse(store.vehicle).success;
    if (!customerOk || !vehicleOk) {
      toast.error(
        t("inspection_wizard.toasts.requiredStepsIncomplete") ||
          "Please complete the required customer and vehicle details before finishing."
      );
      store.setCurrentStep(!customerOk ? 1 : 2);
      return;
    }
    saveInspection("completed");
  }, [saving, store, saveInspection, t]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CustomerStep ref={customerStepRef} />;
      case 2:
        return <VehicleStep  />;
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

  const activeStep = INSPECTION_STEPS.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("inspection_wizard.stepOf")
                .replace("{current}", String(currentIndex + 1))
                .replace("{total}", String(totalSteps))}
            </p>
            <h1 className="text-lg font-semibold">{activeStep ? getStepLabel(activeStep) : null}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => saveInspection("draft")} disabled={saving}>
            <Save className="h-4 w-4 me-1" />
            {t("inspection_wizard.saveDraft")}
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          {visibleSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
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
          onClick={() => prevStep && store.setCurrentStep(prevStep.id)}
          disabled={!prevStep}
        >
          <ChevronLeft className="h-4 w-4 me-1 rtl:rotate-180" />
          {t("inspection_wizard.previous")}
        </Button>

        {nextStep ? (
          <Button onClick={goNext} disabled={saving}>
            {t("inspection_wizard.next")}
            <ChevronRight className="h-4 w-4 ms-1 rtl:rotate-180" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={saving} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 me-1" />
            {t("inspection_wizard.completeInspection")}
          </Button>
        )}
      </div>
    </div>
  );
}