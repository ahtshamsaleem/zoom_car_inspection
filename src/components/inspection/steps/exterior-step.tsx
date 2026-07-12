"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EXTERIOR_PARTS } from "@/constants/inspection";
import { VehicleDiagram, PartLegend } from "@/components/inspection/vehicle-diagram";
import { PartInspectionDialog } from "@/components/inspection/part-inspection-dialog";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";
import type { PartInspection } from "@/types";

export function ExteriorStep() {
  const { t } = useTranslation();
  const { exterior, setExteriorPart, setActivePartId, activePartId } =
    useInspectionStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId);
    setActivePartId(partId);
    setDialogOpen(true);
  };

  const handleSave = (data: PartInspection) => {
    if (selectedPart) {
      setExteriorPart(selectedPart, data);
    }
    setActivePartId(null);
  };

  const selectedPartRaw = EXTERIOR_PARTS.find((p) => p.id === selectedPart);
  const selectedLabel = selectedPart
    ? t(`constants.parts.${selectedPart}`) || selectedPartRaw?.label || ""
    : "";

  const inspectedCount = Object.keys(exterior).length;
  const issueCount = Object.values(exterior).filter(
    (p) => p.condition !== "good"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t("steps.exteriorStep.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("steps.exteriorStep.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {t("steps.exteriorStep.inspectedCount").replace("{count}", String(inspectedCount))}
          </Badge>
          {issueCount > 0 && (
            <Badge variant="destructive">
              {t("steps.exteriorStep.issuesCount").replace("{count}", String(issueCount))}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="top">
        <TabsList>
          <TabsTrigger value="top">{t("steps.exteriorStep.tabs.topView")}</TabsTrigger>
          {/* <TabsTrigger value="side">Side View</TabsTrigger> */}
          <TabsTrigger value="list">{t("steps.exteriorStep.tabs.list")}</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="mt-4">
          <VehicleDiagram
            parts={exterior}
            activePartId={activePartId}
            onPartClick={handlePartClick}
            view="top"
          />
        </TabsContent>

        {/* <TabsContent value="side" className="mt-4">
          <VehicleDiagram
            parts={exterior}
            activePartId={activePartId}
            onPartClick={handlePartClick}
            view="side"
          />
        </TabsContent> */}

        <TabsContent value="list" className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {EXTERIOR_PARTS.map((part) => {
              const data = exterior[part.id];
              const hasIssue = data && data.condition !== "good";
              const partLabel = t(`constants.parts.${part.id}`) || part.label;
              return (
                <Card
                  key={part.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePartClick(part.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium">{partLabel}</span>
                    {data ? (
                      <Badge variant={hasIssue ? "destructive" : "default"}>
                        {t(`constants.conditions.${data.condition}`)}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t("steps.exteriorStep.notInspected")}</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <PartLegend parts={exterior} />

      <PartInspectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partLabel={selectedLabel}
        value={selectedPart ? exterior[selectedPart] : undefined}
        onSave={handleSave}
      />
    </div>
  );
}