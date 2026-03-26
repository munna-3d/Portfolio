"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ duration: 0.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
