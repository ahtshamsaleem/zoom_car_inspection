"use client";

import { useEffect } from "react";
import { InspectionWizard } from "@/components/inspection/inspection-wizard";
import { useInspectionStore } from "@/stores/inspection-store";

export default function NewInspectionPage() {
  const { reset, startInspection } = useInspectionStore();

  useEffect(() => {
    reset();
    startInspection();
  }, [reset, startInspection]);

  return (
    <div>
      <InspectionWizard />
    </div>
  );
}
