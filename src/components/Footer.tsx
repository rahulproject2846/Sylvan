import React from 'react';
import { Leaf, Star, Target, Flame, Crown } from 'lucide-react';
import Typewriter from './Typewriter';
import { smoothScrollTo, smoothScrollToTop } from '../lib/scroll';

interface FooterProps {
  theme: 'dark' | 'light';
  handleOpenJoinModal: (plan?: any) => void;
  currentPage: 'landing' | 'behance' | 'dashboard';
  setCurrentPage: (page: 'landing' | 'behance' | 'dashboard') => void;
  onOpenPolicy?: (policy: 'terms' | 'privacy' | 'cookie') => void;
  brandName?: string;
  brandIcon?: string;
  playHapticClick?: (type?: 'click' | 'success' | 'toggle') => void;
}

export default function Footer({
  theme,
  handleOpenJoinModal,
  currentPage,
  setCurrentPage,
  onOpenPolicy,
  brandName = 'Sylvan',
  brandIcon = 'tree',
  playHapticClick
}: FooterProps) {

  const SelectedBrandIcon = (() => {
    switch (brandIcon) {
      case 'star': return Star;
      case 'target': return Target;
      case 'flame': return Flame;
      case 'crown': return Crown;
      default: return Leaf;
    }
  })();

  const handleBehanceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick?.('click');
    setCurrentPage('behance');
    smoothScrollToTop();
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick?.('click');
    setCurrentPage('dashboard');
    smoothScrollToTop();
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick?.('click');
    setCurrentPage('landing');
    smoothScrollToTop();
  };

  const scrollToSection = (id: string) => {
    setCurrentPage('landing');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        smoothScrollTo(element);
      }
    }, 100);
  };

  const bgStyle = theme === 'dark' 
    ? 'bg-[#070708] text-white border-white/[0.08]' 
    : 'bg-white text-neutral-900 border-neutral-200';

  const linkStyle = theme === 'dark'
    ? 'text-neutral-400 hover:text-white transition-colors duration-200 text-left text-sm font-medium py-1'
    : 'text-neutral-600 hover:text-neutral-950 transition-colors duration-200 text-left text-sm font-medium py-1';

  const subLinkStyle = theme === 'dark'
    ? 'text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200'
    : 'text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-200';

  return (
    <footer className={`py-20 px-6 sm:px-12 md:px-16 transition-colors duration-500 relative z-10 select-none ${bgStyle}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Footer Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Brand Heading */}
          <div className="text-left">
            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Experience {brandName}
            </h3>
          </div>

          {/* Structured Link Columns */}
          <div className="grid grid-cols-2 gap-x-12 sm:gap-x-20 md:gap-x-24 text-left">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { playHapticClick?.('click'); scrollToSection('features'); }} 
                className={linkStyle}
              >
                Features
              </button>
              <button 
                onClick={() => { playHapticClick?.('click'); scrollToSection('pricing'); }} 
                className={linkStyle}
              >
                Pricing
              </button>
              <button 
                onClick={handleDashboardClick} 
                className={linkStyle}
              >
                Dashboard
              </button>
              <button 
                onClick={handleBehanceClick} 
                className={linkStyle}
              >
                Style Guide
              </button>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { playHapticClick?.('click'); onOpenPolicy?.('terms'); }} 
                className={linkStyle}
              >
                Terms of Use
              </button>
              <button 
                onClick={() => { playHapticClick?.('click'); onOpenPolicy?.('privacy'); }} 
                className={linkStyle}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => { playHapticClick?.('click'); onOpenPolicy?.('cookie'); }} 
                className={linkStyle}
              >
                Cookie Policy
              </button>
              <button 
                onClick={() => { playHapticClick?.('click'); scrollToSection('faq'); }} 
                className={linkStyle}
              >
                FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Center Giant Typography Wordmark */}
        <div className="w-full text-center py-6 select-none overflow-hidden">
          <span className={`block font-bold tracking-tighter leading-none text-[13vw] sm:text-[14vw] md:text-[16vw] transition-colors duration-500 ${
            theme === 'dark' ? 'text-white font-sans' : 'text-neutral-950 font-sans'
          }`} style={{ letterSpacing: '-0.06em' }}>
            <Typewriter 
              words={[brandName]} 
              showCursor={false} 
              typingSpeed={600} 
              deletingSpeed={300} 
              pauseDuration={1000} 
            />
          </span>
        </div>

        {/* Bottom Horizontal Divider Row */}
        <div className={`border-t pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center gap-6 ${
          theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
        }`}>
          {/* Bottom Left Logo Label */}
          <button 
            onClick={handleLogoClick} 
            className="flex items-center gap-2 group focus:outline-none"
          >
            <SelectedBrandIcon className={`w-4 h-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-700'
            }`} strokeWidth={2.5} />
            <span className={`font-sans font-semibold text-sm tracking-tight transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-700'
            }`}>
              {brandName}
            </span>
          </button>

          {/* Bottom Right Capitalized Spaced Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <button 
              onClick={() => { playHapticClick?.('click'); scrollToSection('features'); }} 
              className={subLinkStyle}
            >
              ABOUT {brandName.toUpperCase()}
            </button>
            <button 
              onClick={() => { playHapticClick?.('click'); scrollToSection('features'); }} 
              className={subLinkStyle}
            >
              Products
            </button>
            <button 
              onClick={() => { playHapticClick?.('click'); onOpenPolicy?.('privacy'); }} 
              className={subLinkStyle}
            >
              Privacy
            </button>
            <button 
              onClick={() => { playHapticClick?.('click'); onOpenPolicy?.('terms'); }} 
              className={subLinkStyle}
            >
              Terms
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
