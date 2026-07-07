"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupFormValues } from "@/lib/validations/schemas";
import { toast } from "sonner";
import { z } from "zod";

const signupWithCompanySchema = signupSchema.extend({
  companyName: z.string().optional(),
});

type SignupWithCompanyValues = z.infer<typeof signupWithCompanySchema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupWithCompanyValues>({
    resolver: zodResolver(signupWithCompanySchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "inspector",
      companyName: "",
    },
  });

  const role = form.watch("role");

  const onSubmit = async (data: SignupWithCompanyValues) => {
    

    console.log(data)

    setLoading(true);
    const supabase = createClient();
    console.log("SUPABASE", supabase)
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName, role: data.role },
      },
    });


      console.log("authData", authData)
    if (error) {
      console.log("ERROR", error)
      toast.error(error.message);
      setLoading(false);
      return;
    }

     
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authData: authData }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Company setup failed");
        setLoading(false);
        return;
      }



    toast.success(
      data.role === "manager"
        ? "Account and company created!"
        : "Account created! Ask your manager to approve your account."
    );
    router.push(data.role === "manager" ? "/dashboard" : "/login");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Car className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join Zoom Car Inspection</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...form.register("fullName")} />
            {form.formState.errors.fullName && (
              <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
          </div>
          {/* <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => form.setValue("role", v as "manager" | "inspector")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "manager" && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Zoom Car Inspection"
                {...form.register("companyName")}
              />
              {form.formState.errors.companyName && (
                <p className="text-xs text-red-500">{form.formState.errors.companyName.message}</p>
              )}
            </div>
          )} */}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
