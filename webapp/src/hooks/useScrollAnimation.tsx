import { useState, useEffect } from "react";

export const useScrollAnimation = (
  ref: React.RefObject<HTMLElement>,
  threshold: number
) => {
  const [isInView, setIsInView] = useState(false);

  const handleScroll = (entries) => {
    const [entry] = entries;
    setIsInView(entry.isIntersecting);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: threshold,
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
