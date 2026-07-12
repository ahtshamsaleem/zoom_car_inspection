"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicleSchema, type VehicleFormValues } from "@/lib/validations/schemas";
import { FUEL_TYPES, TRANSMISSION_TYPES } from "@/constants/inspection";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";

export function VehicleStep() {
  const { t } = useTranslation();
  const { vehicle, setVehicle } = useInspectionStore();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle,
  });

  const onFieldChange = (
    field: keyof VehicleFormValues,
    value: string | number | undefined
  ) => {
    form.setValue(field, value as never);
    setVehicle({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("steps.vehicleStep.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.vehicleStep.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="plateNumber">{t("steps.vehicleStep.plateNumber.label")}</Label>
          <Input
            id="plateNumber"
            {...form.register("plateNumber")}
            onChange={(e) => onFieldChange("plateNumber", e.target.value)}
            placeholder={t("steps.vehicleStep.plateNumber.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vin">{t("steps.vehicleStep.vin.label")}</Label>
          <Input
            id="vin"
            {...form.register("vin")}
            onChange={(e) => onFieldChange("vin", e.target.value)}
            placeholder={t("steps.vehicleStep.vin.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chassisNumber">{t("steps.vehicleStep.chassisNumber.label")}</Label>
          <Input
            id="chassisNumber"
            {...form.register("chassisNumber")}
            onChange={(e) => onFieldChange("chassisNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="make">{t("steps.vehicleStep.make.label")}</Label>
          <Input
            id="make"
            {...form.register("make")}
            onChange={(e) => onFieldChange("make", e.target.value)}
            placeholder={t("steps.vehicleStep.make.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">{t("steps.vehicleStep.model.label")}</Label>
          <Input
            id="model"
            {...form.register("model")}
            onChange={(e) => onFieldChange("model", e.target.value)}
            placeholder={t("steps.vehicleStep.model.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trim">{t("steps.vehicleStep.trim.label")}</Label>
          <Input
            id="trim"
            {...form.register("trim")}
            onChange={(e) => onFieldChange("trim", e.target.value)}
            placeholder={t("steps.vehicleStep.trim.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">{t("steps.vehicleStep.year.label")}</Label>
          <Input
            id="year"
            type="number"
            {...form.register("year")}
            onChange={(e) =>
              onFieldChange("year", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder={t("steps.vehicleStep.year.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">{t("steps.vehicleStep.mileage.label")}</Label>
          <Input
            id="mileage"
            type="number"
            {...form.register("mileage")}
            onChange={(e) =>
              onFieldChange("mileage", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder={t("steps.vehicleStep.mileage.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineSize">{t("steps.vehicleStep.engineSize.label")}</Label>
          <Input
            id="engineSize"
            {...form.register("engineSize")}
            onChange={(e) => onFieldChange("engineSize", e.target.value)}
            placeholder={t("steps.vehicleStep.engineSize.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("steps.vehicleStep.fuelType.label")}</Label>
          <Select
            value={vehicle.fuelType || ""}
            onValueChange={(v) => onFieldChange("fuelType", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("steps.vehicleStep.fuelType.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((fuelType) => (
                <SelectItem key={fuelType.key} value={fuelType.label}>
                  {t(`constants.fuelTypes.${fuelType.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("steps.vehicleStep.transmission.label")}</Label>
          <Select
            value={vehicle.transmission || ""}
            onValueChange={(v) => onFieldChange("transmission", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("steps.vehicleStep.transmission.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSION_TYPES.map((transmissionType) => (
                <SelectItem key={transmissionType.key} value={transmissionType.label}>
                  {t(`constants.transmissionTypes.${transmissionType.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">{t("steps.vehicleStep.color.label")}</Label>
          <Input
            id="color"
            {...form.register("color")}
            onChange={(e) => onFieldChange("color", e.target.value)}
            placeholder={t("steps.vehicleStep.color.placeholder")}
          />
        </div>
      </div>
    </div>
  );
}