"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Youtube, ExternalLink } from "lucide-react";

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
                            <a 
                                href="https://moon3dx.artstation.com/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Visit Munna Ahmed on ArtStation"
                                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                            >
                                <svg className="w-5 h-5 fill-current group-hover:text-[#13AFF0] transition-colors" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.332h13.754l-2.766-4.837H0zm23.555-3.045l-7.399-12.78A2.43 2.43 0 0 0 14.05 0.5H9.95a2.43 2.43 0 0 0-2.106 1.218L.742 14.188l3.19 5.567 3.738-6.522 5.09-8.887h3.454l4.24 7.4-3.899 6.814h5.666a2.422 2.422 0 0 0 2.105-1.22 2.42 2.42 0 0 0 .229-2.161zM11.606 14.36l-2.316 4.04h4.632l-2.316-4.04z" />
                                </svg>
                                <span className="font-medium">ARTSTATION</span>
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/moon3d/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Connect with Munna Ahmed on LinkedIn"
                                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                            >
                                <Linkedin className="w-5 h-5 group-hover:text-blue-500" aria-hidden="true" />
                                <span className="font-medium">LINKEDIN</span>
                            </a>
                            <a 
                                href="https://www.fiverr.com/munna4020/3d-model-cars-and-trucks-using-blender-for-3d-modeling-and-rendering?ref_ctx_id=83c3092200974c52809296361b57d6fa&pckg_id=1&source=seller_page" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Order 3D modeling services on Fiverr"
                                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                            >
                                <svg className="w-5 h-5 fill-current group-hover:text-[#1dbf73] transition-colors" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M23.002 12c0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11 11 4.925 11 11zm-7.663-3.238h-1.503c-.767 0-1.127.387-1.127 1.058v.928h2.63v2.097h-2.63v5.155H8.056v-5.155H6.513v-2.097h1.543v-1.29c0-1.78 1.135-2.895 3.013-2.895h2.273v2.199z" />
                                </svg>
                                <span className="font-medium">FIVERR</span>
                            </a>
                            <a 
                                href="https://www.youtube.com/@moon3d" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Watch 3D tutorials and showcases on YouTube"
                                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
                            >
                                <Youtube className="w-5 h-5 group-hover:text-red-500" aria-hidden="true" />
                                <span className="font-medium">YOUTUBE</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs font-bold tracking-widest">
                    <span>© {new Date().getFullYear()} MUNNA AHMED. ALL RIGHTS RESERVED.</span>
                    <span className="flex items-center gap-2">DESIGNED BY <span className="text-white">MOON3D</span> <ExternalLink className="w-3 h-3" /></span>
                </div>
            </div>
        </footer>
    );
}
