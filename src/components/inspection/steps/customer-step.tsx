"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerSchema, type CustomerFormValues } from "@/lib/validations/schemas";
import { useInspectionStore } from "@/stores/inspection-store";

export function CustomerStep() {
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
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter the customer details for this inspection
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Full name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            {...form.register("mobile")}
            onChange={(e) => onFieldChange("mobile", e.target.value)}
            placeholder="+971 50 123 4567"
          />
          {form.formState.errors.mobile && (
            <p className="text-sm text-destructive">{form.formState.errors.mobile.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emiratesId">Emirates ID (optional)</Label>
          <Input
            id="emiratesId"
            {...form.register("emiratesId")}
            onChange={(e) => onFieldChange("emiratesId", e.target.value)}
            placeholder="784-XXXX-XXXXXXX-X"
          />
        </div>
      </div>
    </div>
  );
}
