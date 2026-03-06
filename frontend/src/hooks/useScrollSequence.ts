import { useState, useEffect, useRef } from 'react';

interface ScrollSequenceOptions {
  frameCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollSequence({ frameCount, containerRef }: ScrollSequenceOptions) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the container
      const scrollStart = rect.top - windowHeight;
      const scrollRange = rect.height + windowHeight;

      const progress = Math.max(0, Math.min(1, -scrollStart / scrollRange));

      const frame = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount)
      );

      setCurrentFrame(frame);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, containerRef]);

  return currentFrame;
}
