import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useRef } from "react";

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
}

export function AnimateOnScroll({ children, type }: AnimatedOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useScrollAnimation(ref);

  let animationClass;

  if (type === ANIMATION_TYPE.FADE) {
    animationClass = isInView ? "fade-visible" : "fade-hidden";
  } else if (type === ANIMATION_TYPE.SLIDE_LEFT) {
    animationClass = isInView ? "slide-left-visible" : "slide-left-hidden";
  }

  return (
    <div ref={ref} className={animationClass}>
      {children}
    </div>
  );
}
