"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EXTERIOR_PARTS } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";
import type { PaintPanelInspection } from "@/types";

export function PaintStep() {
  const { t } = useTranslation();
  const { paint, setPaintPanel } = useInspectionStore();

  const updatePanel = (panelId: string, field: keyof PaintPanelInspection, value: unknown) => {
    setPaintPanel(panelId, {
      ...paint[panelId],
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("steps.paintStep.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.paintStep.subtitle")}
        </p>
      </div>

      <div className="grid gap-4">
        {EXTERIOR_PARTS.map((panel) => {
          const data = paint[panel.id] || {};
          const hasRepaint = data.repainted || data.bodyFiller;
          const panelLabel = t(`constants.parts.${panel.id}`) || panel.label;

          return (
            <Card key={panel.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{panelLabel}</CardTitle>
                  {hasRepaint && (
                    <Badge variant="destructive">{t("steps.paintStep.repaintDetected")}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${panel.id}-original`}
                    checked={data.originalPaint || false}
                    onCheckedChange={(v) =>
                      updatePanel(panel.id, "originalPaint", !!v)
                    }
                  />
                  <Label htmlFor={`${panel.id}-original`} className="font-normal">
                    {t("steps.paintStep.originalPaint")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${panel.id}-repainted`}
                    checked={data.repainted || false}
                    onCheckedChange={(v) => updatePanel(panel.id, "repainted", !!v)}
                  />
                  <Label htmlFor={`${panel.id}-repainted`} className="font-normal">
                    {t("steps.paintStep.repainted")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${panel.id}-filler`}
                    checked={data.bodyFiller || false}
                    onCheckedChange={(v) => updatePanel(panel.id, "bodyFiller", !!v)}
                  />
                  <Label htmlFor={`${panel.id}-filler`} className="font-normal">
                    {t("steps.paintStep.bodyFiller")}
                  </Label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("steps.paintStep.micronReading")}</Label>
                  <Input
                    type="number"
                    placeholder="μm"
                    value={data.micronReading ?? ""}
                    onChange={(e) =>
                      updatePanel(
                        panel.id,
                        "micronReading",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}