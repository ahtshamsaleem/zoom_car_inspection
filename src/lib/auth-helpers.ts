import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Profile, UserRole } from "@/types";

export async function getAuthProfile(
  supabase: SupabaseClient
): Promise<{ user: { id: string }; profile: Profile } | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { user, profile: profile as Profile };
}

export function requireAuth(
  auth: { user: { id: string }; profile: Profile } | null
) {
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function requireManager(auth: { profile: Profile } | null) {
  const unauthorized = requireAuth(auth);
  if (unauthorized) return unauthorized;

  if (auth!.profile.role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function requireCompany(auth: { profile: Profile } | null) {
  const unauthorized = requireAuth(auth);
  if (unauthorized) return unauthorized;

  if (!auth!.profile.company_id) {
    return NextResponse.json(
      { error: "Company setup required", code: "NO_COMPANY" },
      { status: 403 }
    );
  }
  return null;
}

export const MANAGER_ONLY_ROUTES = [
  "/employees",
  "/analytics",
  "/templates",
  "/pricing",
  "/settings",
  "/customers",
];

export function isManagerRoute(pathname: string) {
  return MANAGER_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
