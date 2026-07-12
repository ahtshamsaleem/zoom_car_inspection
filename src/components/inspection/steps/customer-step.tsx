"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerSchema, type CustomerFormValues } from "@/lib/validations/schemas";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";

export function CustomerStep() {
  const { t } = useTranslation();
  const { customer, setCustomer } = useInspectionStore();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
  });

  const onFieldChange = (field: keyof CustomerFormValues, value: string) => {
    form.setValue(field, value);
    setCustomer({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("steps.customerStep.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.customerStep.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("steps.customerStep.name.label")}</Label>
          <Input
            id="name"
            {...form.register("name")}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder={t("steps.customerStep.name.placeholder")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">{t("steps.customerStep.mobile.label")}</Label>
          <Input
            id="mobile"
            {...form.register("mobile")}
            onChange={(e) => onFieldChange("mobile", e.target.value)}
            placeholder={t("steps.customerStep.mobile.placeholder")}
          />
          {form.formState.errors.mobile && (
            <p className="text-sm text-destructive">{form.formState.errors.mobile.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("steps.customerStep.email.label")}</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder={t("steps.customerStep.email.placeholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emiratesId">{t("steps.customerStep.emiratesId.label")}</Label>
          <Input
            id="emiratesId"
            {...form.register("emiratesId")}
            onChange={(e) => onFieldChange("emiratesId", e.target.value)}
            placeholder={t("steps.customerStep.emiratesId.placeholder")}
          />
        </div>
      </div>
    </div>
  );
}