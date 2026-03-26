"use client";

import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { getSoftwareByName } from "@/data/software";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useLenis } from "lenis/react";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar";

export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = projects.find((p) => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const lenis = useLenis();

  // Scroll to top on load/navigation
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis, slug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!selectedImage || !project) return;
        
        const allImages = [project.image, ...project.gallery];
        const currentIndex = allImages.indexOf(selectedImage);

        if (e.key === "ArrowRight") {
            const nextIndex = (currentIndex + 1) % allImages.length;
            setSelectedImage(allImages[nextIndex]);
        } else if (e.key === "ArrowLeft") {
            const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            setSelectedImage(allImages[prevIndex]);
        } else if (e.key === "Escape") {
            setSelectedImage(null);
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, project]);

  if (!project) {
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link href="/" className="text-pink-500 hover:text-white transition-colors">Return Home</Link>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${project.image})` }}
          onClick={() => setSelectedImage(project.image)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
        </div>
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pointer-events-none">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white hover:scale-105 transition-all mb-8 w-fit group pointer-events-auto"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-pink-500 hidden md:block" />
                <p className="text-pink-400 font-bold tracking-widest uppercase text-sm md:text-base">{project.category}</p>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter loading-tight">{project.title}</h1>
            
            <div className="flex flex-wrap gap-4 pointer-events-auto">
              {project.tech.map((techName) => {
                const tool = getSoftwareByName(techName);
                return (
                  <div 
                    key={techName} 
                    className="group relative flex items-center gap-3 px-6 py-4 rounded-full overflow-hidden transition-all duration-300"
                  >
                    {/* Glowing Border Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-md animate-spin-slow opacity-40 group-hover:opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-lg opacity-20" />

                    {/* Glass Background & Border */}
                    <div className="absolute inset-[1px] rounded-full bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.3)]" />

                    {/* Glossy Reflection (Top) */}
                    <div className="absolute inset-x-4 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />

                    {/* Inner Content */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {tool.icon}
                      </div>
                      <span className="text-gray-200 font-semibold tracking-wide text-lg">{tool.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-12">
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full" />
                    About Project
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                {project.description}
                </p>
            </div>

            <div>
                 <h3 className="text-xl font-bold mb-4 text-white">Deliverables</h3>
                 <ul className="space-y-3">
                    {["High Poly Mesh", "Game Ready Asset", "4K Textures", "Unity/Unreal Package"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            {item}
                        </li>
                    ))}
                 </ul>
            </div>
          </div>
          
          {/* Main Gallery */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Visual Gallery
            </h2>
            <div className="space-y-12">
              <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                 onClick={() => setSelectedImage(project.image)}
              >
                 <img 
                    src={project.image} 
                    alt="Main Shot"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                  />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.gallery.map((img, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                    >
                    <div className="overflow-hidden">
                        <img 
                            src={img} 
                            alt={`${project.title} shot ${index + 1}`}
                            className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 cursor-default"
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[60]"
                >
                    <X className="w-8 h-8 text-white" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const allImages = [project.image, ...project.gallery];
                            const currentIndex = allImages.indexOf(selectedImage);
                            const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                            setSelectedImage(allImages[prevIndex]);
                        }}
                        className="absolute left-4 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[60] hidden md:block"
                    >
                        <ArrowLeft className="w-8 h-8 text-white" />
                    </button>

                    <motion.img 
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        src={selectedImage} 
                        alt="Full Screen View" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const allImages = [project.image, ...project.gallery];
                            const currentIndex = allImages.indexOf(selectedImage);
                            const nextIndex = (currentIndex + 1) % allImages.length;
                            setSelectedImage(allImages[nextIndex]);
                        }}
                        className="absolute right-4 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[60] hidden md:block"
                    >
                        <ArrowLeft className="w-8 h-8 text-white rotate-180" />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}
