import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { smoothScrollToTop } from '../lib/scroll';

interface BackToTopButtonProps {
  theme: 'dark' | 'light';
}

export default function BackToTopButton({ theme }: BackToTopButtonProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setShowBackToTop(y > 400);

          const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, (y / totalHeight) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to set the correct state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          onClick={() => smoothScrollToTop()}
          className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border-transparent flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-lg active:scale-95 group ${
            theme === 'dark' ? 'bg-transparent text-white' : 'bg-transparent text-neutral-950'
          }`}
          title="Back to Top"
        >
          {/* Circular Progress SVG track (underlay is standard border color, fill is black/white) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[1px]" viewBox="0 0 36 36">
            {/* Underlay base circle with standard border styling */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className={theme === 'dark' ? 'stroke-white/[0.1]' : 'stroke-neutral-300'}
              strokeWidth="1.5"
            />
            {/* Dynamic scroll percentage fill (strictly white in dark mode, strictly black in light mode) */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className={theme === 'dark' ? 'stroke-white' : 'stroke-neutral-950'}
              strokeWidth="1.5"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (100.5 * scrollProgress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>

          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
