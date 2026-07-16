"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { InspectionWizard } from "@/components/inspection/inspection-wizard";
import { useInspectionStore } from "@/stores/inspection-store";

export default function NewInspectionPage() {
  const searchParams = useSearchParams();
  const { reset, startInspection } = useInspectionStore();

  const pricingId = searchParams.get("pricingId") ?? undefined;
  const templateId = searchParams.get("templateId") ?? undefined;

  useEffect(() => {
    reset();
    startInspection();
  }, [reset, startInspection]);

  return (
    <div>
      <InspectionWizard templateId={templateId} pricingId={pricingId} />
    </div>
  );
}