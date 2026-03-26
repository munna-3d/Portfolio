"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { vehicleCategories } from "@/data/vehicle-categories";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const cardSlideIn = {
  hidden: { opacity: 0, x: -20, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function VehicleArtGallery() {
  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      {/* Header / Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto">

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-8 w-1 bg-pink-500 rounded-full" />
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">Vehicle Art</h1>
            </div>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              Explore my collection of high-fidelity 3D vehicles, from photorealistic cars to futuristic sci-fi transports.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-[1800px] mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
          initial="hidden"
          animate="visible"
        >
          {vehicleCategories.map((category, i) => (
            <motion.div
              key={category.slug}
              custom={i}
              variants={cardSlideIn}
              className="group relative flex flex-col"
            >
              <Link href={`/projects/vehicle-art/${category.slug}`} className="block">
                <div className="relative aspect-[15/16] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-2xl transition-all duration-500 group-hover:border-pink-500/50 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  {/* Dark Gradient Overlay - Always Visible for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 z-10" />
                  
                  {/* Glowing Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-100"
                  />
                                   
                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-20 p-8 transform transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">{category.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>

                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
