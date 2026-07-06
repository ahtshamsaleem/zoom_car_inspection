"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  Car,
  LogOut,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

const managerNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inspections", label: "All Inspections", icon: ClipboardList },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/customers", label: "Customers", icon: UserCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

const inspectorNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inspections/new", label: "New Inspection", icon: Plus },
  { href: "/inspections?today=true", label: "Today's Inspections", icon: ClipboardList },
];

interface AppSidebarProps {
  role: UserRole;
  userName: string;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === "manager" ? managerNav : inspectorNav;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">Zoom Car</p>
            <p className="text-xs text-muted-foreground">Inspection</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "manager" ? "Management" : "Inspector"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardShell({
  children,
  role,
  userName,
}: {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} userName={userName} />
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center gap-2 border-b px-4 lg:hidden">
          <SidebarTrigger />
          <span className="font-semibold text-sm">Zoom Car Inspection</span>
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
