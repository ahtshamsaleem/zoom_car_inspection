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

export function VehicleStep() {
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
        <h2 className="text-xl font-semibold">Vehicle Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter vehicle details for the inspection report
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="plateNumber">Plate Number *</Label>
          <Input
            id="plateNumber"
            {...form.register("plateNumber")}
            onChange={(e) => onFieldChange("plateNumber", e.target.value)}
            placeholder="A 12345"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            {...form.register("vin")}
            onChange={(e) => onFieldChange("vin", e.target.value)}
            placeholder="17-character VIN"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chassisNumber">Chassis Number</Label>
          <Input
            id="chassisNumber"
            {...form.register("chassisNumber")}
            onChange={(e) => onFieldChange("chassisNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            {...form.register("make")}
            onChange={(e) => onFieldChange("make", e.target.value)}
            placeholder="Toyota"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            {...form.register("model")}
            onChange={(e) => onFieldChange("model", e.target.value)}
            placeholder="Camry"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trim">Trim</Label>
          <Input
            id="trim"
            {...form.register("trim")}
            onChange={(e) => onFieldChange("trim", e.target.value)}
            placeholder="SE"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...form.register("year")}
            onChange={(e) =>
              onFieldChange("year", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="2024"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            {...form.register("mileage")}
            onChange={(e) =>
              onFieldChange("mileage", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="50000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engineSize">Engine Size</Label>
          <Input
            id="engineSize"
            {...form.register("engineSize")}
            onChange={(e) => onFieldChange("engineSize", e.target.value)}
            placeholder="2.5L"
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select
            value={vehicle.fuelType || ""}
            onValueChange={(v) => onFieldChange("fuelType", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select
            value={vehicle.transmission || ""}
            onValueChange={(v) => onFieldChange("transmission", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            {...form.register("color")}
            onChange={(e) => onFieldChange("color", e.target.value)}
            placeholder="White"
          />
        </div>
      </div>
    </div>
  );
}
