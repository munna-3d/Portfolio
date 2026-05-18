"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowLeft, Box, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { getSoftwareByName } from "@/data/software";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    zIndex: 0,
  })
};

const ProjectPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const project = projects.find((p) => p.slug === slug);
  const lenis = useLenis();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  
  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();
  };

  const nextImage = useCallback(() => {
    if (project && selectedIndex !== null) {
      setDirection(1);
      const totalImages = project.gallery.length + 1;
      setSelectedIndex((prev) => (prev !== null && prev < totalImages - 1 ? prev + 1 : 0));
    }
  }, [project, selectedIndex]);

  const prevImage = useCallback(() => {
    if (project && selectedIndex !== null) {
      setDirection(-1);
      const totalImages = project.gallery.length + 1;
      setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : totalImages - 1));
    }
  }, [project, selectedIndex]);

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
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis, slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-pink-500 hover:text-white transition-colors underline underline-offset-4">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      
      {/* 1. Large Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${project.image})` }}
        >
          <div className="absolute inset-0 bg-black/60 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
        </motion.div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full pt-20">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-pink-500 hover:text-white transition-opacity transition-transform mb-12 group bg-black/40 px-6 py-3 rounded-full border border-pink-500/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wide uppercase text-sm">Back to Home</span>
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
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-0 tracking-[-0.08em] uppercase leading-[0.85] italic">
                {project.title.split(' ')[0]} <span className="text-pink-500 font-outline text-transparent" style={{ WebkitTextStroke: '1px rgba(236, 72, 153, 0.5)' }}>{project.title.split(' ').slice(1).join(' ') || 'Asset'}</span>
              </h1>
            </div>

            <div className="max-w-xl">
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium border-l-2 border-white/10 pl-8 ml-2">
                {project.description}
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
             <div className="flex items-center gap-2.5 text-[9px] text-gray-500 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-white/10 transition-colors cursor-default">
                <div className="w-1 h-1 rounded-full bg-pink-500" />
                Select any visual for technical focus
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[project.image, ...project.gallery].map((img, index) => {
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
                  className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 shadow-2xl transition-transform transition-shadow transition-colors duration-500 hover:border-pink-500/30 will-change-[transform,opacity] transform-gpu ${
                    isFull ? "md:col-span-2 aspect-[21/10]" : "md:col-span-1 aspect-[16/11]"
                  }`}
                  style={{ transform: 'translateZ(0)' }}
                >
                  <img 
                    src={img} 
                    alt={`${project.title} production ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out will-change-transform" 
                  />
                  
                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-pink-500/10 border border-pink-500/40 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-transform transition-opacity duration-700 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.2)]">
                      <ExternalLink className="w-8 h-8 text-pink-500" />
                    </div>
                  </div>

                  <div className="absolute bottom-12 right-12 flex justify-end items-end">
                    <div className="text-white/20 font-mono text-xl tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
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
      <section className="max-w-[1800px] mx-auto px-6 lg:px-12 pb-32">
        <div className="space-y-32">
          {/* Main Content Section */}
          <motion.div 
            variants={fadeInUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="max-w-5xl"
          >
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-pink-500 mb-8 flex items-center gap-4">
              <span className="h-px w-8 bg-pink-500" />
              About Project
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg md:text-2xl font-light tracking-tight max-w-4xl">
              {project.about}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-16 border-t border-white/5">
            <div className="lg:col-span-5 space-y-16">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">Software Used</h2>
                <div className="flex flex-wrap gap-4">
                  {project.tech.map((techName) => {
                    const tool = getSoftwareByName(techName);
                    return (
                      <div key={techName} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 transition-colors duration-300">
                        <div className="w-5 h-5 flex items-center justify-center">{tool.icon}</div>
                        <span className="text-gray-300 font-medium text-sm">{tool.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">Production Deliverables</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(project as any).deliverables?.map((item: string) => (
                    <li key={item} className="flex items-center gap-4 text-gray-400 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Image Modal with Immersive Navigation */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 overflow-hidden touch-none"
            style={{ transform: 'translateZ(0)' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Navigation Regions */}
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
              className="absolute left-6 md:left-12 p-6 bg-black/40 hover:bg-pink-500/20 rounded-full transition-opacity transition-transform border border-white/10 hover:border-pink-500/50 z-[110] group hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 md:right-12 p-6 bg-black/40 hover:bg-pink-500/20 rounded-full transition-opacity transition-transform border border-white/10 hover:border-pink-500/50 z-[110] group hidden md:flex items-center justify-center"
            >
              <ChevronRight className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-8 right-8 p-4 bg-black/40 hover:bg-pink-500/40 rounded-full transition-transform transition-opacity z-[115] border border-white/20 group"
            >
              <X className="w-10 h-10 text-white group-hover:rotate-90 transition-transform" />
            </button>

            <div className="relative w-[85vw] h-[80vh] md:w-[90vw] md:h-[85vh] flex items-center justify-center z-[102] pointer-events-auto">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div 
                   key={selectedIndex}
                   custom={direction}
                   variants={slideVariants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   transition={{
                     x: { type: "spring", stiffness: 300, damping: 30 },
                     opacity: { duration: 0.4 },
                     scale: { duration: 0.4 }
                   }}
                   className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing transform-gpu"
                   style={{ transform: 'translateZ(0)' }}
                   drag="x"
                   dragConstraints={{ left: 0, right: 0 }}
                   dragElastic={0.7}
                   onDragEnd={(e, { offset, velocity }) => {
                     const swipe = offset.x;
                     const threshold = 100;
                     if (swipe < -threshold) {
                       nextImage();
                     } else if (swipe > threshold) {
                       prevImage();
                     }
                   }}
                >
                  <img 
                    src={[project.image, ...project.gallery][selectedIndex]} 
                    alt="Full Screen View" 
                    className="w-full h-full object-contain rounded-3xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 pointer-events-auto"
                  />
                  
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-3 bg-black/80 rounded-full border border-white/10 shadow-3xl z-[110]">
                    <span className="text-pink-500 font-black text-2xl tracking-tighter">{selectedIndex + 1}</span>
                    <span className="text-gray-700 font-thin text-3xl">/</span>
                    <span className="text-gray-400 font-bold tracking-widest text-lg">{project.gallery.length + 1}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default React.memo(ProjectPage);
