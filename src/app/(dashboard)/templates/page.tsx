"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const defaultTemplates = [
  {
    id: "1",
    name: "Standard Inspection",
    description: "Full 15-step vehicle inspection covering all systems",
    isDefault: true,
  },
  {
    id: "2",
    name: "Quick Pre-Purchase",
    description: "Exterior, engine, and road test focused inspection",
    isDefault: false,
  },
  {
    id: "3",
    name: "Insurance Assessment",
    description: "Damage-focused inspection for insurance claims",
    isDefault: false,
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inspection Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable inspection checklists
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {defaultTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                {template.isDefault && <Badge>Default</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              <Button variant="outline" size="sm">
                Edit Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
