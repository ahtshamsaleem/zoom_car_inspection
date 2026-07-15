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
  TemplateFormDialog,
  type TemplateItem,
} from "@/components/templates/template-form-dialog";

type PricingLite = { id: string; name: string; template_id: string | null };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [pricing, setPricing] = useState<PricingLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);



  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load templates");
      setTemplates(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load templates");
    }
  }

  async function fetchPricing() {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (res.ok) setPricing(data);
    } catch {
      // non-critical — link badges just won't show
    }
  }


    useEffect(() => {
    Promise.all([fetchTemplates(), fetchPricing()]).finally(() => setLoading(false));
  }, []);

  function linkedPricing(templateId: string) {
    return pricing.filter((p) => p.template_id === templateId);
  }

  function handleAddClick() {
    setEditingTemplate(null);
    setDialogOpen(true);
  }

  function handleEditClick(template: TemplateItem) {
    setEditingTemplate(template);
    setDialogOpen(true);
  }

  function handleSaved(saved: TemplateItem) {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      const next = exists
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [saved, ...prev];
      // if this one became default, un-default the others locally
      return saved.is_default
        ? next.map((t) => (t.id === saved.id ? t : { ...t, is_default: false }))
        : next;
    });
  }

  async function handleDelete(id: string) {
    const linked = linkedPricing(id);
    if (linked.length > 0) {
      const proceed = confirm(
        `This template is used by ${linked.length} pricing tier(s) (${linked
          .map((p) => p.name)
          .join(", ")}). Deleting it will unlink them. Continue?`
      );
      if (!proceed) return;
    } else if (!confirm("Delete this template? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Template deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(template: TemplateItem) {
    try {
      const res = await fetch(`/api/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      handleSaved(data);
      toast.success("Default template updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inspection Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable inspection checklists
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading templates...
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          No templates yet. Create your first checklist.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const linked = linkedPricing(template.id);
            return (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {template.is_default && <Badge>Default</Badge>}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" />}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(template)}>
                            Edit
                          </DropdownMenuItem>
                          {!template.is_default && (
                            <DropdownMenuItem onClick={() => handleSetDefault(template)}>
                              Set as Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(template.id)}
                            disabled={deletingId === template.id}
                          >
                            {deletingId === template.id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  {linked.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {linked.map((p) => (
                        <Badge key={p.id} variant="secondary" className="text-xs">
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(template)}
                  >
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TemplateFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
        onSaved={handleSaved}
      />
    </div>
  );
}