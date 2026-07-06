import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <DashboardShell role={profile.role} userName={profile.full_name}>
      {children}
    </DashboardShell>
  );
}
