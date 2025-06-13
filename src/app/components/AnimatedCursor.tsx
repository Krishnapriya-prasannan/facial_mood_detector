"use client";

import React, { useEffect, useRef } from "react";

const AnimatedCursor: React.FC = () => {
  const cursorOuter = useRef<HTMLDivElement>(null);
  const cursorInner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorInner.current) {
        cursorInner.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (cursorOuter.current) {
        // delayed trailing effect
        setTimeout(() => {
          if (cursorOuter.current)
            cursorOuter.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }, 50);
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorOuter}
        className="cursor-outer fixed pointer-events-none rounded-full border-2 border-purple-500 opacity-50 w-14 h-14 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out mix-blend-screen z-[9999]"
      />
      <div
        ref={cursorInner}
        className="cursor-inner fixed pointer-events-none rounded-full bg-purple-600 w-5 h-5 -translate-x-1/2 -translate-y-1/2 shadow-lg z-[10000]"
      />
    </>
  );
};

export default AnimatedCursor;
