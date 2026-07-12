"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

import dynamic from "next/dynamic"; 

const ThemeToggle = dynamic(() => import("@/components/theme/theme-toggle"), { 
    ssr: false,
    loading: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <span className="size-4" /> 
        </Button>
    )
});

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
  { href: "/inspections", label: "All Inspections", icon: ClipboardList },
];

interface AppSidebarProps {
  role: UserRole;
  userName: string;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-sm tracking-tight text-foreground leading-none mb-1">
                Zoom Car
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
                Inspection
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
            {role === "manager" ? "Management" : "Inspector"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {nav.map((item) => {
                const [basePath, queryParams] = item.href.split("?");
                let isActive = false;

                if (queryParams) {
                  // 1. If this is a query-param link (like ?today=true), match exact path + query
                  isActive = pathname === basePath && searchParams.toString().includes(queryParams);
                } else {
                  if (pathname === item.href) {
                    // 2. Exact match. Ensure a query route isn't currently stealing the focus.
                    const isQueryRouteActive = nav.some((n) => {
                      const [nBase, nQuery] = n.href.split("?");
                      return nQuery && pathname === nBase && searchParams.toString().includes(nQuery);
                    });
                    isActive = !isQueryRouteActive;
                  } else if (pathname.startsWith(item.href + "/")) {
                    // 3. Parent match. Only highlight if the child isn't explicitly in the nav list.
                    // E.g., Highlights for /inspections/123, but skips for /inspections/new
                    const isExactMatchElsewhere = nav.some((n) => n.href === pathname);
                    isActive = !isExactMatchElsewhere;
                  }
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                       
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-muted/20">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50">
          <Avatar className="h-9 w-9 border border-blue-100 dark:border-blue-900 shadow-sm">
            <AvatarFallback className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize font-medium">{role}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
            title="Log out"
          >
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
      <main className="flex-1 overflow-auto bg-background/50">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden shadow-sm">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Car className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Zoom Car Inspection
            </span>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}