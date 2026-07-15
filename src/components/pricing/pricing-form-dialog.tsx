"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export type PricingItem = {
  id: string;
  name: string;
  base_price: number;
  description: string | null;
  is_active: boolean;
  template_id: string | null;
  is_default: boolean; // add this
};

interface PricingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricing?: PricingItem | null;
  onSaved: (item: PricingItem) => void;
}

export function PricingFormDialog({
  open,
  onOpenChange,
  pricing,
  onSaved,
}: PricingFormDialogProps) {
  const isEdit = !!pricing;

  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // inside PricingFormDialog, add state + fetch:
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Reset the form whenever the dialog opens (add mode or a different plan for edit)
  useEffect(() => {
    if (open) {
      setName(pricing?.name ?? "");
      setBasePrice(pricing?.base_price?.toString() ?? "");
      setDescription(pricing?.description ?? "");
      setIsActive(pricing?.is_active ?? true);
      setIsDefault(pricing?.is_default ?? false);
      setTemplateId(pricing?.template_id ?? null);
    }
  }, [open, pricing]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !basePrice) {
      toast.error("Name and price are required");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/pricing/${pricing!.id}` : "/api/pricing";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          base_price: parseFloat(basePrice),
          description: description.trim() || null,
          is_active: isActive,
          is_default: isDefault,
          template_id: templateId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(isEdit ? "Pricing updated" : "Pricing created");
      onSaved(data);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Pricing" : "Add Pricing"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this inspection package."
                : "Create a new inspection pricing tier."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Standard Inspection"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_price">Price (AED)</Label>
            <Input
              id="base_price"
              type="number"
              min="0"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="249"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's included in this package"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is_default">Default pricing</Label>
              <p className="text-xs text-muted-foreground">
                Auto-selected when starting a new inspection
              </p>
            </div>
            <Switch id="is_default" checked={isDefault} onCheckedChange={setIsDefault} />
          </div>

          <div className="space-y-2">
            <Label>Linked Template</Label>
            <Select
              value={templateId ?? undefined}
              onValueChange={(val) => setTemplateId(val as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="No template linked" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Auto-loads this checklist when this price tier is selected
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is_active">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive pricing wont be selectable for new inspections
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}