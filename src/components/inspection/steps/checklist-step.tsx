"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInspectionStore } from "@/stores/inspection-store";
import { useTranslation } from "@/hooks/use-translation";
import type { ChecklistItem } from "@/types";

type ChecklistSection =
  | "chassis"
  | "engine"
  | "transmission"
  | "suspension"
  | "brakes"
  | "steering"
  | "interior"
  | "electronics"
  | "roadTest";

interface ChecklistItemOption {
  key: string;
  label: string;
}

interface ChecklistStepProps {
  title: string;
  description: string;
  items: readonly ChecklistItemOption[];
  section: ChecklistSection;
  /** "select" = Good/Issue/N-A dropdown (default, unchanged). "yesno" = compact Yes/No radio; Yes reveals an issue note. */
  mode?: "select" | "yesno";
}

const SECTION_NAMESPACE: Record<ChecklistSection, string> = {
  chassis: "chassisItems",
  engine: "engineItems",
  transmission: "transmissionItems",
  suspension: "suspensionItems",
  brakes: "brakesItems",
  steering: "steeringItems",
  interior: "interiorItems",
  electronics: "electronicsItems",
  roadTest: "roadTestItems",
};

export function ChecklistStep({
  title,
  description,
  items,
  section,
  mode = "select",
}: ChecklistStepProps) {
  const { t } = useTranslation();
  const store = useInspectionStore();
  const data = store[section] as Record<string, ChecklistItem>;

  const STATUS_OPTIONS: Record<ChecklistItem["status"], string> = {
    good: t("constants.checklistStatus.good"),
    issue: t("constants.checklistStatus.issue"),
    na: t("constants.checklistStatus.na"),
  };

  const updateItem = (key: string, field: keyof ChecklistItem, value: string) => {
    store.setChecklistItem(section, key, {
      ...data[key],
      [field]: value,
    });
  };

  const issueCount = Object.values(data).filter((i) => i?.status === "issue").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {issueCount > 0 && (
          <Badge variant="destructive">
            {t("steps.checklistStep.issuesCount").replace("{count}", String(issueCount))}
          </Badge>
        )}
      </div>

      {mode === "yesno" ? (
        <div className="divide-y rounded-lg border">
          {items.map((item) => {
            const itemData = data[item.label] || ({ status: "good" } as ChecklistItem);
            const itemLabel =
              t(`constants.${SECTION_NAMESPACE[section]}.${item.key}`) || item.label;
            const isYes = itemData.status === "issue";
            const radioName = `${section}-${item.key}`;

            return (
              <div key={item.key} className="p-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm leading-tight">{itemLabel}</span>
                  <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-muted p-0.5 text-xs">
                    <label
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-1 font-medium transition-colors",
                        !isYes
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name={radioName}
                        className="sr-only"
                        checked={!isYes}
                        onChange={() => updateItem(item.label, "status", "good")}
                      />
                      {t("steps.checklistStep.no") || "No"}
                    </label>
                    <label
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-1 font-medium transition-colors",
                        isYes
                          ? "bg-destructive text-destructive-foreground shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name={radioName}
                        className="sr-only"
                        checked={isYes}
                        onChange={() => updateItem(item.label, "status", "issue")}
                      />
                      {t("steps.checklistStep.yes") || "Yes"}
                    </label>
                  </div>
                </div>
                {isYes && (
                  <Textarea
                    placeholder={t("steps.checklistStep.issueDescriptionPlaceholder")}
                    value={itemData.notes || ""}
                    onChange={(e) => updateItem(item.label, "notes", e.target.value)}
                    className="mt-2 min-h-[50px] text-sm"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const itemData = data[item.label] || { status: "good" as const };
            const itemLabel =
              t(`constants.${SECTION_NAMESPACE[section]}.${item.key}`) || item.label;
            return (
              <Card key={item.key}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <span className="min-w-[160px] text-sm font-medium">{itemLabel}</span>
                  <Select
                    value={itemData.status}
                    items={STATUS_OPTIONS}
                    onValueChange={(v) =>
                      updateItem(item.label, "status", v as ChecklistItem["status"])
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t("steps.checklistStep.selectStatusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">{t("constants.checklistStatus.good")}</SelectItem>
                      <SelectItem value="issue">{t("constants.checklistStatus.issue")}</SelectItem>
                      <SelectItem value="na">{t("constants.checklistStatus.na")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {itemData.status === "issue" && (
                    <Textarea
                      placeholder={t("steps.checklistStep.issueDescriptionPlaceholder")}
                      value={itemData.notes || ""}
                      onChange={(e) => updateItem(item.label, "notes", e.target.value)}
                      className="flex-1 min-h-[60px]"
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}