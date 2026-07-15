"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { SECTION_DEFINITIONS } from "@/lib/inspection-template-sections";

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

// { [sectionKey]: { enabled, items: { [itemId]: { included, type } } } }
type SectionState = Record<
  string,
  { enabled: boolean; items: Record<string, { included: boolean; type: string }> }
>;

function buildInitialState(template?: TemplateItem | null): SectionState {
  const state: SectionState = {};
  for (const def of SECTION_DEFINITIONS) {
    const existing = template?.template_data?.sections?.find((s) => s.key === def.key);
    const items: Record<string, { included: boolean; type: string }> = {};
    for (const opt of def.options) {
      const existingItem = existing?.items.find((i) => i.id === opt.id);
      items[opt.id] = {
        included: !!existingItem,
        type: existingItem?.type ?? "condition_rating",
      };
    }
    state[def.key] = { enabled: !!existing, items };
  }
  return state;
}

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateItem | null;
  onSaved: (item: TemplateItem) => void;
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
  const [sectionState, setSectionState] = useState<SectionState>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(template?.name ?? "");
      setDescription(template?.description ?? "");
      setIsDefault(template?.is_default ?? false);
      setSectionState(buildInitialState(template));
      setExpanded({});
      setFilters({});
    }
  }, [open, template]);

  function toggleSectionEnabled(key: string, enabled: boolean) {
    setSectionState((prev) => ({ ...prev, [key]: { ...prev[key], enabled } }));
    if (enabled) setExpanded((prev) => ({ ...prev, [key]: true }));
  }

  function toggleItem(sectionKey: string, itemId: string, included: boolean) {
    setSectionState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: {
          ...prev[sectionKey].items,
          [itemId]: { ...prev[sectionKey].items[itemId], included },
        },
      },
    }));
  }

  function setItemType(sectionKey: string, itemId: string, type: string) {
    setSectionState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: {
          ...prev[sectionKey].items,
          [itemId]: { ...prev[sectionKey].items[itemId], type },
        },
      },
    }));
  }

  function selectAll(sectionKey: string, ids: string[]) {
    setSectionState((prev) => {
      const items = { ...prev[sectionKey].items };
      ids.forEach((id) => (items[id] = { ...items[id], included: true }));
      return { ...prev, [sectionKey]: { ...prev[sectionKey], items } };
    });
  }

  function clearAll(sectionKey: string, ids: string[]) {
    setSectionState((prev) => {
      const items = { ...prev[sectionKey].items };
      ids.forEach((id) => (items[id] = { ...items[id], included: false }));
      return { ...prev, [sectionKey]: { ...prev[sectionKey], items } };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }

    const sections: TemplateSection[] = SECTION_DEFINITIONS.filter(
      (def) => sectionState[def.key]?.enabled
    )
      .map((def) => ({
        key: def.key,
        label: def.label,
        items: def.options
          .filter((opt) => sectionState[def.key].items[opt.id]?.included)
          .map((opt) => ({
            id: opt.id,
            label: opt.label,
            // type: sectionState[def.key].items[opt.id].type,
            type: "",
          })),
      }))
      .filter((s) => s.items.length > 0);

    if (sections.length === 0) {
      toast.error("Select at least one section with at least one item");
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
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>
              Choose which sections and inspection points to include.
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

          <div className="space-y-2">
            <Label>Sections</Label>
            {SECTION_DEFINITIONS.map((def) => {
              const state = sectionState[def.key];
              if (!state) return null;

              const includedCount = def.options.filter(
                (opt) => state.items[opt.id]?.included
              ).length;
              const isOpen = expanded[def.key];
              const filter = filters[def.key]?.toLowerCase() ?? "";
              const visibleOptions = filter
                ? def.options.filter((opt) => opt.label.toLowerCase().includes(filter))
                : def.options;

              return (
                <div key={def.key} className="rounded-lg border">
                  <div className="flex items-center justify-between p-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [def.key]: !prev[def.key] }))
                      }
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      {def.label}
                      {state.enabled && (
                        <span className="text-xs text-muted-foreground">
                          ({includedCount}/{def.options.length})
                        </span>
                      )}
                    </button>
                    <Switch
                      checked={state.enabled}
                      onCheckedChange={(checked) => toggleSectionEnabled(def.key, checked)}
                    />
                  </div>

                  {state.enabled && isOpen && (
                    <div className="border-t p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={`Filter ${def.label.toLowerCase()}...`}
                          value={filters[def.key] ?? ""}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, [def.key]: e.target.value }))
                          }
                          className="h-8 text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={() => selectAll(def.key, def.options.map((o) => o.id))}
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={() => clearAll(def.key, def.options.map((o) => o.id))}
                        >
                          Clear
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                        {visibleOptions.map((opt) => {
                          const itemState = state.items[opt.id];
                          return (
                            <div key={opt.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={itemState.included}
                                onCheckedChange={(checked) =>
                                  toggleItem(def.key, opt.id, checked === true)
                                }
                              />
                              <span className="text-sm flex-1 truncate">{opt.label}</span>
                              {/* {itemState.included && (
                                <Select
                                  value={itemState.type}
                                  onValueChange={(val) =>
                                    setItemType(def.key, opt.id, val as string)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-28 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ITEM_TYPES.map((t) => (
                                      <SelectItem key={t} value={t} className="text-xs">
                                        {t}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )} */}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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