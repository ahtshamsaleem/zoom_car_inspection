// Suggested path: src/hooks/use-inspection-report.ts

"use client";

import { useEffect, useState } from "react";
import type { CompanySettings, InspectionData } from "@/types";

export function useInspectionReport(id: string) {
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [company, setCompany] = useState<CompanySettings>({});

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then((r) => r.json())
      .then(setInspection)
      .catch(() => setInspection(null));

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setCompany(data || {}))
      .catch(() => setCompany({}));
  }, [id]);

  return { inspection, company };
}