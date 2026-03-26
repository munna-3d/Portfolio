import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Developer Portfolio",
  description: "A high-end scrollytelling portfolio experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-foreground">

        {/* Global Live Status Indicator */}
        <div className="fixed top-6 right-6 z-[100] pointer-events-none">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-500/90 drop-shadow-sm">System Live</span>
          </div>
        </div>

        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
