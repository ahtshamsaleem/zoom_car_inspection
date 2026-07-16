"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PricingOption {
  id: string;
  name: string;
  base_price: number;
  description: string | null;
  is_active: boolean;
  is_default: boolean;
  template_id: string | null;
}

interface NewInspectionMenuProps {
  className?: string;
}

export function NewInspectionMenu({ className }: NewInspectionMenuProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [options, setOptions] = useState<PricingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  function loadOptions() {
    if (fetched) return; // cache after first open, don't refetch every click
    setLoading(true);
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data: PricingOption[]) =>
        setOptions(Array.isArray(data) ? data.filter((p) => p.is_active) : [])
      )
      .catch(() => setOptions([]))
      .finally(() => {
        setLoading(false);
        setFetched(true);
      });
  }

  function handleSelect(option: PricingOption) {
    const params = new URLSearchParams();
    params.set("pricingId", option.id);
    if (option.template_id) params.set("templateId", option.template_id);
    router.push(`/inspections/new?${params.toString()}`);
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && loadOptions()}>
      <DropdownMenuTrigger
        render={
          <Button className={cn("bg-blue-600 hover:bg-blue-700", className)}>
            <Plus className="h-4 w-4 me-1" />
            {t("inspections.newInspection")}
            <ChevronDown className="h-4 w-4 ms-1" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t("inspections.new.choosePackage") || "Choose a template"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {loading ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              {t("common.loading")}
            </div>
          ) : fetched && options.length === 0 ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              {t("inspections.new.noPricing") || "No active templates found."}
            </div>
          ) : (
            options.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleSelect(option)}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">{option.name}</span>
                  {option.is_default && (
                    <span className="text-xs text-muted-foreground">
                      {t("common.default") || "Default"}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  AED {option.base_price}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}