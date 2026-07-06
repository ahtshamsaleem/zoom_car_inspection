"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EXTERIOR_PARTS } from "@/constants/inspection";
import { VehicleDiagram, PartLegend } from "@/components/inspection/vehicle-diagram";
import { PartInspectionDialog } from "@/components/inspection/part-inspection-dialog";
import { useInspectionStore } from "@/stores/inspection-store";
import type { PartInspection } from "@/types";

export function ExteriorStep() {
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

  const selectedLabel =
    EXTERIOR_PARTS.find((p) => p.id === selectedPart)?.label || "";

  const inspectedCount = Object.keys(exterior).length;
  const issueCount = Object.values(exterior).filter(
    (p) => p.condition !== "good"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Exterior Inspection</h2>
          <p className="text-sm text-muted-foreground">
            Click on vehicle panels to inspect condition
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{inspectedCount} inspected</Badge>
          {issueCount > 0 && (
            <Badge variant="destructive">{issueCount} issues</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="top">
        <TabsList>
          <TabsTrigger value="top">Top-Down View</TabsTrigger>
          <TabsTrigger value="side">Side View</TabsTrigger>
          <TabsTrigger value="list">Panel List</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="mt-4">
          <VehicleDiagram
            parts={exterior}
            activePartId={activePartId}
            onPartClick={handlePartClick}
            view="top"
          />
        </TabsContent>

        <TabsContent value="side" className="mt-4">
          <VehicleDiagram
            parts={exterior}
            activePartId={activePartId}
            onPartClick={handlePartClick}
            view="side"
          />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {EXTERIOR_PARTS.map((part) => {
              const data = exterior[part.id];
              const hasIssue = data && data.condition !== "good";
              return (
                <Card
                  key={part.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePartClick(part.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium">{part.label}</span>
                    {data ? (
                      <Badge variant={hasIssue ? "destructive" : "default"}>
                        {data.condition}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not inspected</Badge>
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
