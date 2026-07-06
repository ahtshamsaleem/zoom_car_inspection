import Link from "next/link";
import { Car, ClipboardCheck, BarChart3, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
            <Car className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">Zoom Car Inspection</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "text-white hover:text-white hover:bg-white/10")}
          >
            Sign In
          </Link>
          <Link href="/signup" className={cn(buttonVariants(), "bg-blue-500 hover:bg-blue-600")}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Professional Car Inspection
          <br />
          <span className="text-blue-400">Management Platform</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Streamline vehicle inspections with interactive diagrams, comprehensive
          checklists, photo documentation, and detailed PDF reports.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "bg-blue-500 hover:bg-blue-600")}>
            Start Free Trial
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/20 text-white hover:bg-white/10")}
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            {
              icon: ClipboardCheck,
              title: "Complete Inspection Workflow",
              desc: "15-step inspection covering exterior, engine, chassis, tires, electronics, and road test.",
            },
            {
              icon: Car,
              title: "Interactive Vehicle Diagram",
              desc: "Clickable top-down and side views with color-coded defect tracking on every body panel.",
            },
            {
              icon: BarChart3,
              title: "Analytics & Reports",
              desc: "Dashboard analytics, PDF export, print reports, and full vehicle inspection history.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <feature.icon className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 border-t border-white/10 flex items-center justify-center gap-2 text-slate-400 text-sm">
        <Shield className="h-4 w-4" />
        <span>Zoom Car Inspection &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
