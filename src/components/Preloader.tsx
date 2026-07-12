import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf } from 'lucide-react';
import Typewriter from './Typewriter';

interface PreloaderProps {
  theme: 'dark' | 'light';
  onComplete: () => void;
}

export default function Preloader({ theme, onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Elegant faster duration for premium snappy load feel
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 450); // Allow exit transition to play
    }, 1100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#070708]' : 'bg-[#fbfaf7]';
  const leafColor = isDark ? '#ffffff' : '#070708';

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${bgColor}`}
        >
          {/* Main Logo Container */}
          <div className="relative w-40 h-40 flex items-center justify-center select-none">
            
            {/* Ambient Premium Glow */}
            <motion.div 
              className={`absolute w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 ${
                isDark ? 'bg-white' : 'bg-neutral-950'
              }`}
              animate={{
                scale: [0.85, 1.25, 0.85],
                opacity: [0.15, 0.35, 0.15]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Breathing Vector Leaf Logo */}
            <motion.div
              animate={{
                scale: [0.94, 1.06, 0.94],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 flex items-center justify-center"
            >
              <Leaf 
                className="w-16 h-16 sm:w-20 sm:h-20" 
                strokeWidth={1.8} 
                color={leafColor} 
              />
            </motion.div>
          </div>

          {/* Sylvan Text with Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <span className={`font-sans font-extrabold text-2xl sm:text-3xl tracking-[0.25em] transition-colors duration-300 h-10 ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}>
              <Typewriter 
                words={["SYLVAN"]} 
                typingSpeed={110} 
                showCursor={false} 
                oneWay={true} 
                loop={false}
                cursorClassName={isDark ? "text-emerald-500 bg-emerald-500" : "text-emerald-600 bg-emerald-600"}
              />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
