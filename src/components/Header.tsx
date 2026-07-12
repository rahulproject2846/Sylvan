import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sun, Moon, Menu, X, Star, Target, Flame, Crown } from 'lucide-react';
import { smoothScrollTo, smoothScrollToTop } from '../lib/scroll';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isScrolled: boolean;
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleOpenJoinModal: (plan?: any) => void;
  currentPage: 'landing' | 'behance' | 'dashboard';
  setCurrentPage: (page: 'landing' | 'behance' | 'dashboard') => void;
  brandName?: string;
  brandIcon?: string;
  brandAccent?: string;
  playHapticClick?: (type?: 'click' | 'success' | 'toggle') => void;
}

export default function Header({
  theme,
  toggleTheme,
  isScrolled,
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleOpenJoinModal,
  currentPage,
  setCurrentPage,
  brandName = 'Sylvan',
  brandIcon = 'tree',
  brandAccent = 'dynamic',
  playHapticClick,
}: HeaderProps) {

  const getButtonClass = (isMobile: boolean = false) => {
    const padding = isMobile ? "py-3 w-full rounded-full text-sm text-center" : "px-5 py-2.5 rounded-full text-sm";
    const base = `font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ease-out shadow-lg border cursor-pointer ${padding}`;
    
    if (brandAccent === 'dynamic') {
      return theme === 'dark'
        ? `${base} bg-white text-neutral-950 border-transparent hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] shadow-white/[0.02]`
        : `${base} bg-neutral-950 text-white border-transparent hover:bg-white hover:text-neutral-900 hover:border-[#dfdbd0] shadow-neutral-950/[0.05]`;
    }

    return theme === 'dark'
      ? `${base} bg-[var(--brand-accent-color)] text-white border border-transparent hover:bg-transparent hover:text-[var(--brand-accent-color)] hover:border-[var(--brand-accent-color)] shadow-white/[0.02]`
      : `${base} bg-[var(--brand-accent-color)] text-white border border-transparent hover:bg-transparent hover:text-[var(--brand-accent-color)] hover:border-[var(--brand-accent-color)] shadow-neutral-950/[0.05]`;
  };

  const SelectedBrandIcon = (() => {
    switch (brandIcon) {
      case 'star': return Star;
      case 'target': return Target;
      case 'flame': return Flame;
      case 'crown': return Crown;
      default: return Leaf;
    }
  })();

  const handleNavClick = (id: string) => {
    playHapticClick?.('click');
    setMobileMenuOpen(false);
    if (currentPage !== 'landing') {
      setCurrentPage('landing');
      // Wait for page transition, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          smoothScrollTo(element);
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        smoothScrollTo(element);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick?.('click');
    setCurrentPage('landing');
    smoothScrollToTop();
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick?.('click');
    setMobileMenuOpen(false);
    setCurrentPage('dashboard');
    smoothScrollToTop();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20">
        {/* Butter-smooth GPU-accelerated background layer */}
        <div 
          className={`absolute inset-0 -z-10 transition-opacity duration-300 ease-out will-change-opacity ${
            (isScrolled || mobileMenuOpen) ? 'opacity-100' : 'opacity-0'
          } ${
            theme === 'dark'
              ? 'bg-[#070708]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.35)] border-b border-white/[0.04]'
              : 'bg-[#fbfaf7]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-b border-neutral-200/40'
          }`}
        />
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center gap-2 group focus:outline-none">
            <SelectedBrandIcon className={`w-5.5 h-5.5 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} strokeWidth={2.5} />
            <span className={`font-sans font-bold text-xl tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{brandName}.</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'features', label: 'Features' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'faq', label: 'FAQ' },
              { id: 'blog', label: 'Blog' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none ${
                  currentPage === 'landing' && activeSection === item.id 
                    ? theme === 'dark'
                      ? 'text-white bg-white/[0.08] border border-white/[0.12] shadow-sm' 
                      : 'text-neutral-950 bg-neutral-200/75 border border-neutral-350 shadow-sm'
                    : theme === 'dark'
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Dashboard button removed per user request */}
          </nav>

          {/* Right CTA / Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => { playHapticClick?.('toggle'); toggleTheme(); }}
              aria-label="Toggle Theme"
              className={`p-2.5 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button 
              onClick={() => { playHapticClick?.('click'); handleOpenJoinModal(); }}
              className={`text-sm font-semibold transition-colors duration-200 ${
                theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => { playHapticClick?.('click'); handleOpenJoinModal(); }}
              className={getButtonClass(false)}
            >
              Get started
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            className={`md:hidden p-2 rounded-full border transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-neutral-900'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 left-0 right-0 z-40 border-b p-6 md:hidden flex flex-col gap-5 shadow-2xl transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-[#070708]/95 border-white/[0.08] text-neutral-100' 
                : 'bg-[#fbfaf7]/98 border-neutral-200/80 text-neutral-900'
            } backdrop-blur-lg`}
          >
            <div className="flex flex-col gap-2">
              {[
                { id: 'features', label: 'Features' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'faq', label: 'FAQ' },
                { id: 'blog', label: 'Blog' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 text-left text-sm font-medium rounded-lg px-3 transition-colors duration-200 ${
                    currentPage === 'landing' && activeSection === item.id 
                      ? theme === 'dark'
                        ? 'bg-white/[0.08] text-white' 
                        : 'bg-neutral-200/60 text-neutral-950 font-semibold'
                      : theme === 'dark'
                        ? 'text-neutral-400 hover:text-white'
                        : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* Dashboard button removed per user request */}
            </div>
            
            {/* Added Theme Toggle to Mobile Menu for accessibility */}
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-semibold text-neutral-400">Theme</span>
              <button
                onClick={() => { playHapticClick?.('toggle'); toggleTheme(); }}
                aria-label="Toggle Theme"
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/[0.04] text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-neutral-300'}`} />
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { playHapticClick?.('click'); setMobileMenuOpen(false); handleOpenJoinModal(); }}
                className={`py-2.5 text-center font-medium text-sm border rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'text-neutral-300 hover:text-white border-white/[0.08]'
                    : 'text-neutral-700 hover:text-neutral-950 border-neutral-300'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => { playHapticClick?.('click'); setMobileMenuOpen(false); handleOpenJoinModal(); }}
                className={getButtonClass(true)}
              >
                Get started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
