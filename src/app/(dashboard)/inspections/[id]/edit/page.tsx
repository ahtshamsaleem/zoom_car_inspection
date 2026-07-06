"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InspectionWizard } from "@/components/inspection/inspection-wizard";
import { useInspectionStore } from "@/stores/inspection-store";

export default function EditInspectionPage() {
  const params = useParams();
  const id = params.id as string;
  const { loadFromInspection } = useInspectionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then((r) => r.json())
      .then((data) => {
        loadFromInspection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, loadFromInspection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading inspection...
      </div>
    );
  }

  return <InspectionWizard inspectionId={id} />;
}
