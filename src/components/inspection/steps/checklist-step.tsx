"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useInspectionStore } from "@/stores/inspection-store";
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

interface ChecklistStepProps {
  title: string;
  description: string;
  items: string[];
  section: ChecklistSection;
}


const STATUS_OPTIONS: Record<ChecklistItem["status"], string> = {
  good: "Good",
  issue: "Issue",
  na: "N/A",
};




export function ChecklistStep({
  title,
  description,
  items,
  section,
}: ChecklistStepProps) {
  const store = useInspectionStore();
  const data = store[section] as Record<string, ChecklistItem>;

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
          <Badge variant="destructive">{issueCount} issues</Badge>
        )}
      </div>

      <div className="grid gap-3">
        {items.map((item) => {
          const itemData = data[item] || { status: "good" as const };
          return (
            <Card key={item}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="min-w-[160px] text-sm font-medium">{item}</span>
                <Select
                  value={itemData.status}
                  items={STATUS_OPTIONS}
                  onValueChange={(v) =>
                    updateItem(item, "status", v as ChecklistItem["status"])
                  }
                >
                  <SelectTrigger className="w-[140px]">
                   <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good"  >Good</SelectItem>
                    <SelectItem value="issue" label="Issue">Issue</SelectItem>
                    <SelectItem value="na" label="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
                {itemData.status === "issue" && (
                  <Textarea
                    placeholder="Describe the issue..."
                    value={itemData.notes || ""}
                    onChange={(e) => updateItem(item, "notes", e.target.value)}
                    className="flex-1 min-h-[60px]"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
