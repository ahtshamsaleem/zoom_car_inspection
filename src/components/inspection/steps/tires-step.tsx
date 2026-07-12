"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TIRE_POSITIONS } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";
import type { TireInspection } from "@/types";

export function TiresStep() {
  const { t } = useTranslation();
  const { tires, setTire } = useInspectionStore();

  const updateTire = (position: string, field: keyof TireInspection, value: unknown) => {
    setTire(position, { ...tires[position], [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("steps.tiresStep.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.tiresStep.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {TIRE_POSITIONS.map((position) => {
          const data = tires[position.label] || {};
          const positionLabel =
            t(`constants.tirePositions.${position.key}`) || position.label;
          return (
            <Card key={position.key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{positionLabel}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("steps.tiresStep.brand.label")}</Label>
                  <Input
                    value={data.brand || ""}
                    onChange={(e) => updateTire(position.label, "brand", e.target.value)}
                    placeholder={t("steps.tiresStep.brand.placeholder")}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("steps.tiresStep.size.label")}</Label>
                  <Input
                    value={data.size || ""}
                    onChange={(e) => updateTire(position.label, "size", e.target.value)}
                    placeholder={t("steps.tiresStep.size.placeholder")}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("steps.tiresStep.dot.label")}</Label>
                  <Input
                    value={data.dot || ""}
                    onChange={(e) => updateTire(position.label, "dot", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("steps.tiresStep.remainingPercent.label")}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={data.remainingPercent ?? ""}
                    onChange={(e) =>
                      updateTire(
                        position.label,
                        "remainingPercent",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                {(["unevenWear", "sidewallDamage", "cracks"] as const).map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <Checkbox
                      id={`${position.key}-${field}`}
                      checked={data[field] || false}
                      onCheckedChange={(v) => updateTire(position.label, field, !!v)}
                    />
                    <Label htmlFor={`${position.key}-${field}`} className="font-normal text-sm">
                      {t(`steps.tiresStep.fields.${field}`)}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}