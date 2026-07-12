import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MouseFollowerProps {
  theme: 'light' | 'dark';
}

export default function MouseFollower({ theme }: MouseFollowerProps) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring motion configuration
  const springConfig = { damping: 40, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
      }}
      className={`fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] hidden md:block transition-colors duration-350 ${
        theme === 'dark' ? 'text-white' : 'text-neutral-950'
      }`}
    >
      {/* Layer 3: 240px low opacity ambient glow with light blur */}
      <motion.div 
        animate={{ scale: [0.94, 1.06, 0.94], opacity: [0.005, 0.012, 0.005] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute w-[240px] h-[240px] -left-[120px] -top-[120px] rounded-full bg-current blur-[1px]" 
      />
      {/* Layer 2: 160px with 1.5% opacity */}
      <motion.div 
        animate={{ scale: [1.04, 0.96, 1.04], opacity: [0.01, 0.02, 0.01] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
        className="absolute w-[160px] h-[160px] -left-[80px] -top-[80px] rounded-full bg-current blur-[0.5px]" 
      />
      {/* Layer 1: 80px with 2.5% opacity */}
      <motion.div 
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.018, 0.032, 0.018] }}
        transition={{ repeat: Infinity, duration: 3.0, ease: "easeInOut" }}
        className="absolute w-[80px] h-[80px] -left-[40px] -top-[40px] rounded-full bg-current" 
      />
    </motion.div>
  );
}
