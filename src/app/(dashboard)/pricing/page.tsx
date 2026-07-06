"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const pricingPlans = [
  {
    id: "1",
    name: "Standard Inspection",
    price: 350,
    description: "Full 15-step comprehensive inspection",
    active: true,
  },
  {
    id: "2",
    name: "Quick Inspection",
    price: 200,
    description: "Exterior and basic mechanical check",
    active: true,
  },
  {
    id: "3",
    name: "Premium Inspection",
    price: 500,
    description: "Full inspection with OBD scan and road test",
    active: true,
  },
  {
    id: "4",
    name: "Pre-Purchase Package",
    price: 450,
    description: "Standard inspection with detailed PDF report",
    active: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing</h1>
          <p className="text-muted-foreground">
            Manage inspection service pricing
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" />
          Add Price
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pricingPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <Badge variant={plan.active ? "default" : "secondary"}>
                  {plan.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">
                AED {plan.price}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
