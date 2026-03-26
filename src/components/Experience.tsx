import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
    {
        title: "Freelance 3D Artist",
        company: "Fiverr",
        type: "Remote",
        date: "Mar 2021 – Present",
        color: "text-green-400",
        description: [
            "Delivered 100+ projects to international clients involving stylized and hyper-realistic vehicles.",
            "Specialized in car design for games, marketing, and product visualization.",
            "Developed strong client relations and maintained a 5-star average rating.",
            "Expert in asset optimization, UV mapping, and PBR workflows."
        ]
    },
    {
        title: "3D Modeler / Vehicle Artist",
        company: "Real Games SRLS",
        type: "Remote",
        date: "Apr 2025 – Present",
        color: "text-orange-400",
        description: [
            "Produce optimized, game-ready 3D assets tailored for immersive environments and simulation.",
            "Collaborate closely with creative leads to ensure assets meet both visual fidelity and performance constraints.",
            "Create detailed vehicles with clean topology, UVs, and texture maps using Blender and Substance 3D Painter."
        ]
    },

    {
        title: "Vehicle Artist",
        company: "Fabwelt Studio",
        type: "Remote",
        date: "Mar 2024 – Mar 2025",
        color: "text-blue-400",
        description: [
            "Created concept and custom car designs for blockchain-based games.",
            "Designed stylized body kits and futuristic car concepts with detailed surfacing and decals.",
            "Worked closely with the gameplay team to ensure proper integration."
        ]
    },
    {
        title: "3D Artist",
        company: "Fabwelt Studio",
        type: "Remote",
        date: "Mar 2023 – Mar 2024",
        color: "text-purple-400",
        description: [
            "Developed modular environments and in-game props.",
            "Focused on optimization and real-time rendering performance using Unity and Unreal Engine.",
            "Applied advanced lighting and baking techniques for immersive game levels."
        ]
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-pink-500/5 to-black/0 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-8 w-1 bg-pink-500 rounded-full" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Professional Experience</h2>
                </div>

                <div className="relative border-l-2 border-white/10 ml-4 md:ml-10 space-y-12 pb-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-12 mb-12 last:mb-0"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#121212] border-2 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />

                            <div className="group relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">{exp.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 font-medium mt-1">
                                                <Briefcase className={`w-4 h-4 ${exp.color}`} />
                                                <span className={`${exp.color} font-bold text-lg tracking-wide`}>{exp.company}</span>
                                                <span className="text-white/30">•</span>
                                                <span className="text-gray-400 text-sm">{exp.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1 rounded-full text-sm w-fit border border-white/5">
                                            <Calendar className="w-4 h-4" />
                                            {exp.date}
                                        </div>
                                    </div>

                                    <ul className="space-y-2">
                                        {exp.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 text-base leading-relaxed">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
