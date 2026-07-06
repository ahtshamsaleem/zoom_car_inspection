"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PART_CONDITIONS, SEVERITY_OPTIONS } from "@/constants/inspection";
import { PhotoUpload } from "@/components/inspection/photo-upload";
import type { PartCondition, PartInspection, Severity } from "@/types";

const schema = z.object({
  condition: z.string(),
  severity: z.string().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

interface PartInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partLabel: string;
  value?: PartInspection;
  onSave: (data: PartInspection) => void;
}

export function PartInspectionDialog({
  open,
  onOpenChange,
  partLabel,
  value,
  onSave,
}: PartInspectionDialogProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      condition: value?.condition || "good",
      severity: value?.severity || "minor",
      notes: value?.notes || "",
      photoUrl: value?.photoUrl || "",
    },
  });

  const condition = form.watch("condition");
  const photoUrl = form.watch("photoUrl");
  const showSeverity = condition !== "good";

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      condition: data.condition as PartCondition,
      severity: showSeverity ? (data.severity as Severity) : undefined,
      notes: data.notes,
      photoUrl: data.photoUrl,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label>Condition</Label>
            <RadioGroup
              value={condition}
              onValueChange={(v) => form.setValue("condition", v)}
              className="grid grid-cols-2 gap-2"
            >
              {PART_CONDITIONS.map((c) => (
                <div key={c.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={c.value} id={c.value} />
                  <Label htmlFor={c.value} className="font-normal cursor-pointer">
                    {c.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {showSeverity && (
            <div className="space-y-3">
              <Label>Severity</Label>
              <RadioGroup
                value={form.watch("severity")}
                onValueChange={(v) => form.setValue("severity", v)}
                className="flex gap-4"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <div key={s.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={s.value} id={`sev-${s.value}`} />
                    <Label htmlFor={`sev-${s.value}`} className="font-normal cursor-pointer">
                      {s.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} placeholder="Additional notes..." />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <PhotoUpload
              value={photoUrl ? [photoUrl] : []}
              onChange={(urls) => form.setValue("photoUrl", urls[0] || "")}
              multiple={false}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
