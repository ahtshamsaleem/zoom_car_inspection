
import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zoom Car Inspection",
  description: "Professional car inspection management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable}    ${inter.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col">
    <ThemeProvider>
        <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
        </TooltipProvider>
    </ThemeProvider>
</body>
    </html>
  );
}
