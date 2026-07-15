"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PricingFormDialog,
  type PricingItem,
} from "@/components/pricing/pricing-form-dialog";

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);



  async function fetchPricing() {
    setLoading(true);
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load pricing");
      setPlans(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => {
    fetchPricing();
  }, []);

  function handleAddClick() {
    setEditingPlan(null);
    setDialogOpen(true);
  }

  function handleEditClick(plan: PricingItem) {
    setEditingPlan(plan);
    setDialogOpen(true);
  }

  function handleSaved(saved: PricingItem) {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this pricing tier? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/pricing/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pricing deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(plan: PricingItem) {
    try {
      const res = await fetch(`/api/pricing/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !plan.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setPlans((prev) => prev.map((p) => (p.id === plan.id ? data : p)));
      toast.success(data.is_active ? "Marked active" : "Marked inactive");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing</h1>
          <p className="text-muted-foreground">
            Manage inspection service pricing
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-1" />
          Add Price
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading pricing...
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No pricing tiers yet. Add your first one to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(plan)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(plan)}>
                          {plan.is_active ? "Mark Inactive" : "Mark Active"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(plan.id)}
                          disabled={deletingId === plan.id}
                        >
                          {deletingId === plan.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">AED {plan.base_price}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(plan)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PricingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pricing={editingPlan}
        onSaved={handleSaved}
      />
    </div>
  );
}