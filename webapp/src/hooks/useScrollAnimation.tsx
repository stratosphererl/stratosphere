import { useState, useEffect } from "react";

export const useScrollAnimation = (ref: React.RefObject<HTMLElement>) => {
  const [isInView, setIsInView] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(false);

  const handleScroll = (entries) => {
    if (isFirstRender) return;
    const [entry] = entries;
    setIsInView(entry.isIntersecting);
    setIsFirstRender(true);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.99,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleScroll, options);
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return isInView;
};
