"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("Zoom Car Inspection");
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName }),
    });

    if (res.ok) {
      toast.success("Company setup complete!");
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Setup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Car className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Set Up Your Company</CardTitle>
          <CardDescription>
            Complete your Zoom Car Inspection workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSetup}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
