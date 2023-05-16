import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useEffect, useRef, useState } from "react";

import "./animateOnScroll.css";

export const ANIMATION_TYPE = {
  FADE: "fade",
  SLIDE_LEFT: "slide-left",
} as const;

export const BEHAVIOR = {
  ONCE: "once",
  ALWAYS: "always",
} as const;

interface AnimatedOnScrollProps {
  children: React.ReactNode;
  type: (typeof ANIMATION_TYPE)[keyof typeof ANIMATION_TYPE];
  behavior?: (typeof BEHAVIOR)[keyof typeof BEHAVIOR];
  className?: string;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  type,
  className,
  threshold = 0.9,
}: AnimatedOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef<boolean>(true);
  const isInView = useScrollAnimation(ref, threshold);

  let animationClass;

  if (type === ANIMATION_TYPE.FADE) {
    animationClass = isInView ? "fade-visible" : "fade-hidden";
  } else if (type === ANIMATION_TYPE.SLIDE_LEFT) {
    animationClass = isInView
      ? "slide-right-visible fade-visible"
      : "slide-right-hidden";
  }

  useEffect(() => {
    if (isFirstRender.current && isInView) {
      isFirstRender.current = false;
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      className={`${isFirstRender.current ? animationClass : ""} ${className}`}
    >
      {children}
    </div>
  );
}
