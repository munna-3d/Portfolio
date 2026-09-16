"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects as fallbackProjects } from "@/data/projects";
import { fetchProjectBySlug, formatImageUrl } from "@/lib/api";
import { Project } from "@/types";
import { getSoftwareByName } from "@/data/software";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ImageZoomModal from "@/components/ui/ImageZoomModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ProjectPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const initialProject = useMemo(() => fallbackProjects.find((p) => p.slug === slug) || null, [slug]);
  const [project, setProject] = useState<Project | null>(initialProject);
  const [loading, setLoading] = useState(true);
  const lenis = useLenis();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      fetchProjectBySlug(slug).then((fetched) => {
        if (isMounted) {
          if (fetched) setProject(fetched);
          setLoading(false);
        }
      }).catch(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Deduplicate gallery images so hero image is not duplicated & format URLs
  const galleryImages = useMemo(() => {
    if (!project) return [];
    const set = new Set<string>();
    if (project.image) set.add(formatImageUrl(project.image));
    (project.gallery || []).forEach((img) => set.add(formatImageUrl(img)));
    return Array.from(set);
  }, [project]);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis, slug]);

  if (!project && !loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-pink-500 hover:text-white transition-colors underline underline-offset-4">Return Home</Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
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
          style={{ backgroundImage: `url(${formatImageUrl(project.image)})` }}
        >
          <div className="absolute inset-0 bg-black/60 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/80" />
        </motion.div>

        <div className="relative z-10 max-w-[1800px] w-full mx-auto px-6 lg:px-12 flex flex-col justify-end min-h-screen pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Link 
                href="/#projects"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-gray-300 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Showcase</span>
              </Link>
              <span className="text-pink-500 text-xs font-black uppercase tracking-widest px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
                {project.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic max-w-5xl leading-none">
              {project.title}
            </h1>

            <p className="text-gray-300 text-lg md:text-2xl font-light tracking-wide max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Bento Interactive Grid Gallery */}
      <section className="max-w-[1800px] mx-auto px-6 lg:px-12 py-32">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
             <div>
                <span className="text-pink-500 font-mono text-xs tracking-widest uppercase mb-2 block">High-Resolution Production</span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase italic">Interactive Gallery</h3>
             </div>
             <div className="flex items-center gap-2.5 text-[9px] text-gray-500 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-white/10 transition-colors cursor-default">
                <div className="w-1 h-1 rounded-full bg-pink-500" />
                Select any visual for technical focus
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {galleryImages.map((img, index) => {
              // Pattern: 0=Full, 1=Half, 2=Half, 3=Full...
              const isFull = index % 3 === 0;

              return (
                <motion.div
                  key={img}
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
                  {(project.tech || []).map((techName) => {
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
                  {(project.deliverables || []).map((item) => (
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

      {/* Full Screen Image Modal with Mobile Zoom In Feature */}
      <ImageZoomModal
        images={galleryImages}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        title={project.title}
      />

      <Footer />
    </main>
  );
};

export default React.memo(ProjectPage);
