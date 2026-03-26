"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const productions = [
    {
        title: "Real Offroad 4x4 Mud Trucks",
        type: "Mobile Game",
        year: "2025",
        role: "3D artist, 3d vehicle artist",
        company: "Real Games SRLS",
        image: "https://cdnb.artstation.com/p/productions/covers/000/210/699/thumb/icon.png?1748287448", // Offroad placeholder
    },
    {
        title: "Old School Rally",
        type: "Video Game",
        year: "2025",
        role: "3D artist, 3d vehicle artist",
        company: "Individual Freelance",
        image: "https://cdnb.artstation.com/p/productions/covers/000/222/667/thumb/capsule_616x353.png?1767038905", // Rally placeholder
    },
    {
        title: "Land Trains",
        type: "Video Game",
        year: "2026",
        role: "3D artist",
        company: "Bas Hamer studio",
        image: "https://cdna.artstation.com/p/productions/covers/000/210/698/thumb/8VF6Ck.png?1748286953", // Train placeholder
    },
    {
        title: "R-Games Racing",
        type: "Mobile Game",
        year: "2024",
        role: "3D artist, 3d vehicle artist",
        company: "Fabwelt Studios",
        image: "https://cdnb.artstation.com/p/productions/covers/000/210/735/thumb/logo.png?1748336991", // Racing placeholder
    },
    {
        title: "H2O: High-Speed Boat Racing",
        type: "Mobile Game",
        year: "2024",
        role: "3D artist",
        company: "Fabwelt Studios",
        image: "https://cdnb.artstation.com/p/productions/covers/000/210/737/thumb/Option_2_%282%29.png?1748337237", // Boat placeholder
    },
];

export default function Productions() {
    const [expanded, setExpanded] = useState(false);
    const visibleProductions = expanded ? productions : productions.slice(0, 3);

    return (
        <section className="relative w-full py-32 bg-[#0a0a0a] text-white">
            <div className="max-w-5xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-20 tracking-tight"
                >
                    Productions
                </motion.h2>

                <div className="space-y-16">
                    <AnimatePresence>
                        {visibleProductions.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start"
                            >
                                {/* Thumbnail */}
                                <div className="w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Details Table-like layout */}
                                <div className="flex-grow w-full grid grid-cols-[100px_1fr] gap-y-4 gap-x-8 text-sm md:text-base border-t border-white/5 pt-4 md:border-none md:pt-0">
                                    <div className="text-gray-500 font-medium self-center">Title</div>
                                    <div className="text-white font-bold text-lg md:text-xl self-center">{item.title}</div>

                                    <div className="col-span-2 h-px bg-white/5 md:hidden my-2" />

                                    <div className="text-gray-500 font-medium">Type</div>
                                    <div className="text-gray-300">{item.type}</div>

                                    <div className="text-gray-500 font-medium">Year</div>
                                    <div className="text-gray-300">{item.year}</div>

                                    <div className="text-gray-500 font-medium">Role</div>
                                    <div className="text-pink-400 font-medium">{item.role}</div>

                                    <div className="text-gray-500 font-medium">Company</div>
                                    <div className="text-gray-300">{item.company}</div>
                                </div>
                            </motion.div>
                        ))}

                    </AnimatePresence>
                </div>

                {productions.length > 3 && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="group flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium uppercase tracking-widest">
                                {expanded ? "Show Less" : "Show More"}
                            </span>
                            <div className={`p-3 rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 transition-all duration-300 ${expanded ? "rotate-180" : ""}`}>
                                <ChevronDown className="w-6 h-6" />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
