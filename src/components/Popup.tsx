"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import Link from "next/link";

interface PopupProps {
    activePopup: string | null;
    onClose: () => void;
    content: {
        title: string;
        description: string;
        images: string[];
        tech: string;
    } | null;
}

export default function Popup({ activePopup, onClose, content }: PopupProps) {
    if (!activePopup || !content) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/90 backdrop-blur-md overflow-y-auto p-4 md:p-10 perspective-1000">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-5xl rounded-3xl border overflow-hidden shadow-2xl my-10 bg-[#1a1a1a] border-white/10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 rounded-full transition-colors bg-black/50 text-white hover:bg-white hover:text-black"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header Content */}
                <div className="p-8 md:p-12 border-b relative z-10 border-white/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                {content.title}
                            </h2>
                            <p className="text-lg max-w-2xl transform-gpu text-gray-400">
                                {content.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Gallery */}
                <div className="p-8 md:p-12 space-y-12 relative z-10">
                    {content.images.map((src, index) => (
                        <div key={index} className="space-y-4">
                            <div className="rounded-2xl overflow-hidden border border-white/10">
                                <img src={src} alt={`${content.title} Showcase ${index + 1}`} className="w-full h-auto object-cover" />
                            </div>
                            <div className="flex justify-between items-center text-gray-500 text-sm">
                                <span>Asset Preview {index + 1}</span>
                                <span>{content.tech}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="p-8 md:p-12 border-t text-center relative z-10 bg-[#121212] border-white/10">
                    <p className="mb-6 text-xl text-white">
                        Ready to build something complex?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 font-bold rounded-full transition-all hover:scale-105 bg-pink-500 text-white hover:bg-pink-600"
                    >
                        CONTACT ME
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
