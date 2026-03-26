"use client";

import React from "react";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Productions from "@/components/Productions";
import Experience from "@/components/Experience";
import Popup from "@/components/Popup";
import {
  Box,
  Layers,
  Cpu,
  Car,
  Gamepad2,
  Monitor,
  Zap,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Pentagon
} from "lucide-react";

import { softwareTools } from "@/data/software";

const expertise = [
  { name: "Hard-Surface Modeling", icon: <Box className="w-5 h-5" /> },
  { name: "Automotive Design", icon: <Car className="w-5 h-5" /> },
  { name: "Game Asset Creation", icon: <Gamepad2 className="w-5 h-5" /> },
  { name: "PBR Texturing", icon: <Layers className="w-5 h-5" /> },
  { name: "UV Optimization", icon: <Cpu className="w-5 h-5" /> },
  { name: "Real-Time Rendering", icon: <Monitor className="w-5 h-5" /> },
];

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Home() {
  const [activePopup, setActivePopup] = React.useState<string | null>(null);

  // ... (keep images and getPopupContent same) ...
  // Hardcoded images for Hard-Surface Modeling popup showcase
  const hardSurfaceImages = [
    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
  ];

  // Images for Automotive Design popup
  const automotiveImages = [
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1200",
  ];

  // Images for Hard Surface Asset popup
   const hardSurfaceAssetImages = [
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1200", // Using placeholder for now
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1200",
  ];

  // Images for Environment Design popup
   const environmentImages = [
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200", // Using placeholder
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
  ];

  const getPopupContent = (popupName: string) => {
    switch (popupName) {
      case "Hard-Surface Modeling":
        return {
          title: "Hard-Surface Modeling",
          description: "A collection of high-precision mechanical, automotive, and industrial designs. Focusing on clean topology, optimized UVs, and realistic PBR texturing.",
          images: hardSurfaceImages,
          tech: "Blender • Substance 3D"
        };
      case "Automotive Visualization":
        return {
          title: "Automotive Visualization",
          description: "High-fidelity automotive visualizations featuring studio lighting, realistic materials, and dynamic environments. Showcasing vehicle design and rendering expertise.",
          images: automotiveImages,
          tech: "3D Rendering • Lighting • Composition"
        };
      case "Hard Surface Asset":
        return {
          title: "Hard Surface Asset",
          description: "Game-ready weapon asset created with a focus on functional realism and optimized geometry. Featuring PBR materials for modern engine integration.",
          images: hardSurfaceAssetImages,
          tech: "Maya • ZBrush • Substance Painter"
        };
      case "Environment Design":
        return {
          title: "Environment Design",
          description: "Immersive futuristic environment design. Utilizing modular workflows, trim sheets, and advanced lighting to create atmospheric game levels.",
          images: environmentImages,
          tech: "Unreal Engine • Blender • Photoshop"
        };
      default: // Fallback
        return {
          title: popupName,
          description: "Project details showcasing 3D artistry and technical skills.",
          images: hardSurfaceImages,
          tech: "3D Design"
        };
    }
  };

  const activeContent = activePopup ? getPopupContent(activePopup) : null;

  return (
    <main className="bg-[#121212] min-h-screen relative">
      <ScrollyCanvas />

      {/* Expertise & Skills Section */}
      <section id="expertise" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Expertise */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-10">
              <div className="h-8 w-1 bg-pink-500 rounded-full" />
              <h2 className="text-3xl font-bold text-white tracking-tight">Core Expertise</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expertise.map((item) => (
                <motion.div
                  key={item.name}
                  variants={fadeInUp}
                  className="group relative flex items-center gap-4 p-4 rounded-xl overflow-hidden transition-all duration-300"
                >
                  {/* Glowing Border Background - Always Visible & Rotating - Cyan/Blue Tone */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 blur-md animate-spin-slow opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 blur-lg opacity-40" />

                  {/* Glass Background & Border */}
                  <div className="absolute inset-[1px] rounded-xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 group-hover:bg-[#1a1a1a]/80 group-hover:border-white/20" />

                  {/* Glossy Reflection (Top) */}
                  <div className="absolute inset-x-4 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* Inner Content */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg group-hover:scale-110 transition-transform group-hover:text-white group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      {item.icon}
                    </div>
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors text-shadow-sm">{item.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Software Tools */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-10">
              <div className="h-8 w-1 bg-pink-500 rounded-full" />
              <h2 className="text-3xl font-bold text-white tracking-tight">Software Arsenal</h2>
            </motion.div>
            <div className="flex flex-wrap gap-4">
              {softwareTools.map((tool) => (
                <motion.div
                  key={tool.name}
                  variants={fadeInUp}
                  className="group relative flex items-center gap-3 px-6 py-4 rounded-full overflow-hidden transition-all duration-150 hover:-translate-y-1"
                >
                  {/* Glowing Border Background */}
                  {/* Glowing Border Background - Always Visible & Rotating */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-md animate-spin-slow opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-lg opacity-40" />

                  {/* Glass Background & Border (Overlaying the glow) */}
                  <div className="absolute inset-[1px] rounded-full bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 group-hover:bg-[#1a1a1a]/80 group-hover:border-white/20" />

                  {/* Glossy Reflection (Top) */}
                  <div className="absolute inset-x-4 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Inner Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {tool.icon}
                    </div>
                    <span className="text-gray-200 font-semibold tracking-wide group-hover:text-white transition-colors duration-150 text-shadow-sm">{tool.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Experience />

      <Projects onPopup={(name: string) => setActivePopup(name)} />

      <Productions />

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-gradient-to-b from-[#121212] to-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
              Let&apos;s Create <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Something Amazing</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl mb-16 max-w-2xl mx-auto">
              Currently available for select freelance opportunities and high-impact 3D production roles.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.a href="mailto:moon3d.xx@gmail.com" variants={fadeInUp} className="flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
              <div className="p-4 bg-pink-500/10 text-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8" />
              </div>
              <span className="text-white font-medium">moon3d.xx@gmail.com</span>
            </motion.a>
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl group">
              <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <span className="text-white font-medium">+91 9957277403</span>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl group">
              <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <span className="text-white font-medium">Assam, India</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="w-full py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-white tracking-tighter mb-1">MUNNA AHMED</h3>
            <p className="text-pink-500/70 text-sm font-medium tracking-widest uppercase">Certified 3D Artist</p>
          </div>

          <div className="flex gap-12">
            {[
              { name: "ArtStation", url: "https://moon3dx.artstation.com/" },
              { name: "LinkedIn", url: "https://www.linkedin.com/in/moon3d/" },
              { name: "Fiverr", url: "https://www.fiverr.com/s/zWKmWr3" },
              { name: "Contact", url: "/contact" }
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-all hover:scale-105"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-gray-700 text-sm">© 2024 Munna Ahmed. All rights reserved. Built with precision for the next generation of games.</p>
          </div>
        </div>
      </footer>

      {/* Fullscreen Scrollable Popup */}
      <Popup
        activePopup={activePopup}
        content={activeContent}
        onClose={() => setActivePopup(null)}
      />
    </main>
  );
}
