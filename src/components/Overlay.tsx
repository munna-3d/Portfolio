"use client";

import { MotionValue, useTransform, motion } from "framer-motion";

interface OverlayProps {
    scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
    const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5], [0, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5], [50, 0, -50]);

    const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8], [0, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8], [50, 0, -50]);

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute text-center"
            >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-white">
                    MUNNA AHMED
                </h1>
                <p className="text-xl md:text-2xl text-pink-500 font-medium tracking-widest uppercase">
                    Senior 3D Artist
                </p>
                <p className="text-sm md:text-base text-gray-500 mt-2">
                    Hard-Surface Modeling • Automotive Design • PBR Texturing
                </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute left-10 md:left-20 max-w-[600px]"
            >
                <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white/90">
                    Mastering <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Hard-Surface</span> & Automotive Visualization.
                </h2>
                <p className="text-gray-400 mt-6 text-lg md:text-xl">
                    5+ years of expertise in delivering production-ready assets for games and real-time engines.
                </p>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="absolute right-10 md:right-20 text-right max-w-[600px]"
            >
                <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white/90">
                    Precision in <br /> modeling & <br /> <span className="text-pink-500">PBR Texturing</span>.
                </h2>
                <p className="text-gray-400 mt-6 text-lg md:text-xl ml-auto">
                    Built for Unreal Engine, Unity, and high-end visualization.
                </p>
            </motion.div>

        </div>
    );
}
