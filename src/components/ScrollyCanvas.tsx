"use client";

import { useScroll, useTransform, useMotionValueEvent, motion, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Overlay from "./Overlay";

const FRAME_COUNT = 19;

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth scroll progress for the bar
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = `/sequence/frame_${i.toString().padStart(3, '0')}.webp`;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve();
                    };
                    loadedImages[i] = img; // Preserve order
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = images[Math.round(index)];

        if (!ctx || !img) return;

        // Handle resizing
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Calculate "object-fit: cover"
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (isLoaded) {
            renderFrame(latest);
        }
    });

    useEffect(() => {
        if (isLoaded && images.length > 0) {
            renderFrame(0);
        }
    }, [isLoaded]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) renderFrame(frameIndex.get());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded]);


    return (
        <div ref={containerRef} className="h-[500vh] relative bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                
                {/* Scroll Progress Bar - Left Side */}
                <motion.div
                    className="absolute left-2 top-0 bottom-0 w-1 bg-purple-500 origin-top z-50 shadow-[0_0_10px_rgba(168,85,247,0.5)] rounded-full"
                    style={{ scaleY }}
                />

                {/* Loading State */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-white z-50 bg-[#121212]">
                        <p className="animate-pulse">Loading Assets...</p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="block w-full h-full object-cover"
                />

                <Overlay scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
