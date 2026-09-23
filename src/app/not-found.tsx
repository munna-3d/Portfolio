"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-32 relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/15 to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-pink-400">
              Error 404 // Coordinate Missing
            </span>
          </div>

          {/* Huge typography */}
          <div className="space-y-3">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 select-none">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Digital Coordinates Not Found
            </h2>
          </div>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            The 3D asset, category, or render coordinate you requested does not exist,
            has been archived, or was relocated during scene optimization.
          </p>

          {/* CTA Grid */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/projects/vehicle-art"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Vehicle Gallery</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <Mail className="w-4 h-4 text-pink-400" />
              <span>Contact Munna</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
