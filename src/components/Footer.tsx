"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, Youtube, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                {/* Say Hello Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter hover:text-cyan-500 transition-colors duration-500 cursor-default"
                    >
                        SAY HELLO
                    </motion.h2>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link 
                            href="/contact"
                            className="inline-block px-12 py-5 bg-cyan-500 hover:bg-white text-black font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        >
                            Contact me
                        </Link>
                    </motion.div>
                </div>

                <div className="h-px w-full bg-white/10 mb-16" />

                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
                    {/* Branding Column */}
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter">MUNNA AHMED</span>
                            <span className="text-pink-500 font-bold uppercase tracking-widest text-xs mt-1">3D Artist • Visualizer</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed max-w-[200px]">
                            Creating high-fidelity digital assets and immersive environments for the next generation of games.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-6">
                        <h3 className="font-bold tracking-widest uppercase text-gray-400">Links</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="hover:text-pink-500 transition-colors text-gray-500 font-medium">HOME</Link></li>
                            <li><Link href="/#projects" className="hover:text-pink-500 transition-colors text-gray-500 font-medium">PORTFOLIO</Link></li>
                            <li><Link href="/#expertise" className="hover:text-pink-500 transition-colors text-gray-500 font-medium">EXPERTISE</Link></li>
                            <li><Link href="/#experience" className="hover:text-pink-500 transition-colors text-gray-500 font-medium">EXPERIENCE</Link></li>
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div className="space-y-6">
                        <h3 className="font-bold tracking-widest uppercase text-gray-400">Services</h3>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li className="hover:text-pink-500 transition-colors cursor-default">3D ART</li>
                            <li className="hover:text-pink-500 transition-colors cursor-default">HARD-SURFACE</li>
                            <li className="hover:text-pink-500 transition-colors cursor-default">ANIMATION & CINEMATICS</li>
                            <li className="hover:text-pink-500 transition-colors cursor-default">VEHICLE ART</li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div className="space-y-6">
                        <h3 className="font-bold tracking-widest uppercase text-gray-400">Social</h3>
                        <div className="space-y-4">
                            <a href="https://moon3dx.artstation.com/" target="_blank" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group">
                                <Instagram className="w-5 h-5 group-hover:text-pink-500" />
                                <span className="font-medium">ARTSTATION</span>
                            </a>
                            <a href="https://www.linkedin.com/in/moon3d/" target="_blank" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group">
                                <Linkedin className="w-5 h-5 group-hover:text-blue-500" />
                                <span className="font-medium">LINKEDIN</span>
                            </a>
                            <a href="https://www.fiverr.com/munna4020/3d-model-cars-and-trucks-using-blender-for-3d-modeling-and-rendering?ref_ctx_id=83c3092200974c52809296361b57d6fa&pckg_id=1&source=seller_page" target="_blank" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group">
                                <Facebook className="w-5 h-5 group-hover:text-blue-600" />
                                <span className="font-medium">FIVERR</span>
                            </a>
                            <a href="https://www.youtube.com/@moon3d" target="_blank" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group">
                                <Youtube className="w-5 h-5 group-hover:text-red-500" />
                                <span className="font-medium">YOUTUBE</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs font-bold tracking-widest">
                    <span>© 2024 MUNNA AHMED. ALL RIGHTS RESERVED.</span>
                    <span className="flex items-center gap-2">DESIGNED BY <span className="text-white">MOON3D</span> <ExternalLink className="w-3 h-3" /></span>
                </div>
            </div>
        </footer>
    );
}
