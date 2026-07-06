"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TIRE_POSITIONS } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import type { TireInspection } from "@/types";

export function TiresStep() {
  const { tires, setTire } = useInspectionStore();

  const updateTire = (position: string, field: keyof TireInspection, value: unknown) => {
    setTire(position, { ...tires[position], [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tire Inspection</h2>
        <p className="text-sm text-muted-foreground">
          Inspect each wheel for wear, damage, and specifications
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {TIRE_POSITIONS.map((position) => {
          const data = tires[position] || {};
          return (
            <Card key={position}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{position}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Brand</Label>
                  <Input
                    value={data.brand || ""}
                    onChange={(e) => updateTire(position, "brand", e.target.value)}
                    placeholder="Michelin"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Size</Label>
                  <Input
                    value={data.size || ""}
                    onChange={(e) => updateTire(position, "size", e.target.value)}
                    placeholder="225/45R17"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">DOT</Label>
                  <Input
                    value={data.dot || ""}
                    onChange={(e) => updateTire(position, "dot", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Remaining %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={data.remainingPercent ?? ""}
                    onChange={(e) =>
                      updateTire(
                        position,
                        "remainingPercent",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                {(["unevenWear", "sidewallDamage", "cracks"] as const).map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <Checkbox
                      id={`${position}-${field}`}
                      checked={data[field] || false}
                      onCheckedChange={(v) => updateTire(position, field, !!v)}
                    />
                    <Label htmlFor={`${position}-${field}`} className="font-normal text-sm capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
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
