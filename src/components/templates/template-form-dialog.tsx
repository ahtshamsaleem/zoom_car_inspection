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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type TemplateItem = {
  id: string;
  name: string;
  description: string | null;
  template_data: { sections: TemplateSection[] };
  is_default: boolean;
};

type TemplateSection = {
  key: string;
  label: string;
  items: { id: string; label: string; type: string }[];
};

const ITEM_TYPES = [
  "condition_rating",
  "pass_fail",
  "boolean_with_photo",
  "boolean_with_note",
  "measurement_mm",
  "measurement_percent",
  "measurement_number",
];

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateItem | null;
  onSaved: (item: TemplateItem) => void;
}

function emptySection(): TemplateSection {
  return { key: "", label: "", items: [] };
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: TemplateFormDialogProps) {
  const isEdit = !!template;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(template?.name ?? "");
      setDescription(template?.description ?? "");
      setIsDefault(template?.is_default ?? false);
      setSections(template?.template_data?.sections ?? [emptySection()]);
    }
  }, [open, template]);

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSection(index: number, patch: Partial<TemplateSection>) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  }

  function addItem(sectionIndex: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              items: [
                ...s.items,
                { id: "", label: "", type: "condition_rating" },
              ],
            }
          : s
      )
    );
  }

  function updateItem(
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<TemplateSection["items"][number]>
  ) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              items: s.items.map((it, j) =>
                j === itemIndex ? { ...it, ...patch } : it
              ),
            }
          : s
      )
    );
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, items: s.items.filter((_, j) => j !== itemIndex) }
          : s
      )
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/templates/${template!.id}` : "/api/templates";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          template_data: { sections },
          is_default: isDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(isEdit ? "Template updated" : "Template created");
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
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>
              Define the checklist sections and items inspectors will fill out.
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this template covers"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is_default">Default template</Label>
              <p className="text-xs text-muted-foreground">
                Auto-selected when starting a new inspection
              </p>
            </div>
            <Switch id="is_default" checked={isDefault} onCheckedChange={setIsDefault} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sections</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Section
              </Button>
            </div>

            {sections.map((section, sIdx) => (
              <div key={sIdx} className="rounded-lg border p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Key (e.g. exterior)"
                    value={section.key}
                    onChange={(e) => updateSection(sIdx, { key: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Label (e.g. Exterior)"
                    value={section.label}
                    onChange={(e) => updateSection(sIdx, { label: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeSection(sIdx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2 pl-2">
                  {section.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2">
                      <Input
                        placeholder="item_id"
                        value={item.id}
                        onChange={(e) =>
                          updateItem(sIdx, iIdx, { id: e.target.value })
                        }
                        className="w-28"
                      />
                      <Input
                        placeholder="Label"
                        value={item.label}
                        onChange={(e) =>
                          updateItem(sIdx, iIdx, { label: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Select
                        value={item.type}
                        onValueChange={(val) =>
                          updateItem(sIdx, iIdx, { type: val as string })
                        }
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(sIdx, iIdx)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addItem(sIdx)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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