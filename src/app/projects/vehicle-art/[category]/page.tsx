"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Box, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { vehicleCategories } from "@/data/vehicle-categories";
import { getSoftwareByName } from "@/data/software";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CategoryDetailPage() {
  const params = useParams();
  const categorySlug = params?.category as string;
  const category = vehicleCategories.find((c) => c.slug === categorySlug);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const nextImage = useCallback(() => {
    if (category && selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null && prev < category.gallery.length - 1 ? prev + 1 : 0));
    }
  }, [category, selectedIndex]);

  const prevImage = useCallback(() => {
    if (category && selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : category.gallery.length - 1));
    }
  }, [category, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link href="/projects/vehicle-art" className="text-pink-500 hover:text-white transition-colors underline underline-offset-4">Return to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* 1. Large Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear scale-110"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
        </div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
          <Link 
            href="/projects/vehicle-art"
            className="inline-flex items-center gap-3 text-pink-500 hover:text-white transition-all mb-12 group bg-black/40 px-6 py-3 rounded-full border border-pink-500/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wide uppercase text-sm">Return to Gallery</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
             <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-16 bg-pink-500" />
                <p className="text-pink-500 font-black tracking-[0.5em] uppercase text-xs md:text-sm">High-Fidelity Assets</p>
            </div>
            
            <div className="space-y-0 mb-12">
              <h2 className="text-4xl md:text-6xl font-light tracking-[-0.05em] text-white/60 leading-none">REALISTIC 3D</h2>
              <h1 className="text-7xl md:text-9xl font-black mb-0 tracking-[-0.08em] uppercase leading-[0.85] italic">
                {category.title.split(' ')[0]} <span className="text-pink-500 font-outline text-transparent" style={{ WebkitTextStroke: '1px rgba(236, 72, 153, 0.5)' }}>{category.title.split(' ')[1] || 'Design'}</span>
              </h1>
            </div>

            <div className="max-w-xl">
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium border-l-2 border-white/10 pl-8 ml-2">
                {category.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Masonry-Style Grid Gallery */}
      <section className="py-20 bg-black/40">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-6">
             <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-[1px] w-6 bg-pink-500/50" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-pink-500/80">Exploration & Production</h2>
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase italic">Interactive Gallery</h3>
             </div>
             <div className="flex items-center gap-2.5 text-[9px] text-gray-500 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-md hover:bg-white/10 transition-all cursor-default">
                <div className="w-1 h-1 rounded-full bg-pink-500" />
                Select any visual for technical focus
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {category.gallery.map((img, index) => {
              // Pattern: 0=Full, 1=Half, 2=Half, 3=Full...
              const isFull = index % 3 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 hover:border-pink-500/30 ${
                    isFull ? "md:col-span-2 aspect-[21/10]" : "md:col-span-1 aspect-[16/11]"
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${category.title} production ${index + 1}`}
                    className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" 
                  />
                  
                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-pink-500/10 backdrop-blur-3xl border border-pink-500/40 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.2)]">
                      <ExternalLink className="w-8 h-8 text-pink-500" />
                    </div>
                  </div>

                  <div className="absolute bottom-12 right-12 flex justify-end items-end">
                    <div className="text-white/20 font-mono text-xl tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                      /{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Detailed Information Section */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-16">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">Software Used</h2>
              <div className="flex flex-wrap gap-4">
                {category.software.map((techName) => {
                  const tool = getSoftwareByName(techName);
                  return (
                    <div key={techName} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 transition-colors">
                      <div className="w-5 h-5 flex items-center justify-center">{tool.icon}</div>
                      <span className="text-gray-300 font-medium text-sm">{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">About Project</h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">{category.about}</p>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-16">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">Production Deliverables</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-gray-400 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <div className="pt-12 text-center text-gray-600 border-t border-white/5">
                <Box className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p className="text-xs tracking-widest uppercase">Visual refinement & technical documentation below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal with Immersive Navigation */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden"
          >
            {/* Clickable regions for side-navigation (Outer 30% of screen) */}
            <div 
              className="absolute inset-y-0 left-0 w-[30%] z-[105] cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
               <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              className="absolute inset-y-0 right-0 w-[30%] z-[105] cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
               <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Close Overlay Trigger */}
            <div className="absolute inset-0 z-[101]" onClick={() => setSelectedIndex(null)} />

            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 md:left-12 p-6 bg-black/40 hover:bg-pink-500/20 rounded-full transition-all border border-white/10 hover:border-pink-500/50 z-[110] group backdrop-blur-sm"
            >
              <ChevronLeft className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 md:right-12 p-6 bg-black/40 hover:bg-pink-500/20 rounded-full transition-all border border-white/10 hover:border-pink-500/50 z-[110] group backdrop-blur-sm"
            >
              <ChevronRight className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-8 right-8 p-4 bg-black/40 hover:bg-pink-500/40 rounded-full transition-all z-[115] border border-white/20 group backdrop-blur-md"
            >
              <X className="w-10 h-10 text-white group-hover:rotate-90 transition-transform" />
            </button>

            <motion.div 
               key={selectedIndex}
               className="relative w-[85vw] h-[80vh] md:w-[90vw] md:h-[85vh] flex items-center justify-center z-[102] pointer-events-none"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              <img 
                src={category.gallery[selectedIndex]} 
                alt="Full Screen View" 
                className="w-full h-full object-contain rounded-3xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 pointer-events-auto"
              />
              
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-3 bg-black/80 backdrop-blur-3xl rounded-full border border-white/10 shadow-3xl z-[110]">
                <span className="text-pink-500 font-black text-2xl tracking-tighter">{selectedIndex + 1}</span>
                <span className="text-gray-700 font-thin text-3xl">/</span>
                <span className="text-gray-400 font-bold tracking-widest text-lg">{category.gallery.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
