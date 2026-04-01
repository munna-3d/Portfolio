"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data/projects";

interface ProjectsProps {
    onPopup: (name: string) => void;
}

export default function Projects({ onPopup }: ProjectsProps) {
    return (
        <section id="projects" className="relative w-full py-32 bg-[#121212] text-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-16 tracking-tight"
                >
                    Portfolio
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <Link href={`/projects/${project.slug}`} key={project.slug}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10 cursor-pointer"
                            >
                                {/* Special Border Animation based on slug */}
                                {project.slug === "vehicle-art" && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-150 z-0" />
                                    </>
                                )}

                                {project.slug === "hard-surface-asset" && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-slate-400 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-slate-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-150 z-0" />
                                    </>
                                )}

                                {project.slug === "environment-design" && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-purple-600 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-purple-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-150 z-0" />
                                    </>
                                )}

                                {/* Main Content Container */}
                                <div className="absolute inset-[2px] rounded-2xl z-10 overflow-hidden bg-[#121212]">
                                    <div className="absolute inset-0 z-0">
                                        <div
                                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${project.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
                                        <p className="text-sm font-medium text-pink-400 mb-2 transform transition-transform duration-150 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                            {project.category}
                                        </p>
                                        <h3 className="text-2xl font-bold">{project.title}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
