"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 bottom-0 w-1 bg-purple-500 origin-top z-50 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
      style={{ scaleY }}
    />
  );
}
