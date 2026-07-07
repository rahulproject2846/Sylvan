import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Compass, 
  Sparkles, 
  Leaf, 
  LayoutGrid, 
  Award, 
  Globe, 
  Palette 
} from 'lucide-react';

interface StyleGuidePageProps {
  theme: 'dark' | 'light';
  setCurrentPage: (page: 'landing' | 'behance') => void;
  handleOpenJoinModal: (plan?: any) => void;
}

export default function StyleGuidePage({ theme, setCurrentPage }: StyleGuidePageProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const colors = [
    { rgb: '8 8 8', hex: '#080808', label: 'Slate Obsidian' },
    { rgb: '15 15 15', hex: '#0F0F0F', label: 'Deep Charcoal' },
    { rgb: '251 250 247', hex: '#FBFAF7', label: 'Sylvan Pearl' },
    { rgb: '212 206 196', hex: '#D4CEC4', label: 'Brand Beige' },
  ];

  return (
    <div className={`min-h-screen py-24 px-6 md:px-12 max-w-7xl mx-auto relative transition-colors duration-500 text-left overflow-hidden ${
      theme === 'dark' ? 'bg-[#070708] text-white' : 'bg-[#fbfaf7] text-neutral-950'
    }`}>
      
      {/* FLOATING SUCCESS TOAST */}
      <AnimatePresence>
        {copiedHex && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full border shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#121214] border-white/10 text-white' : 'bg-white border-neutral-300 text-neutral-900'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-[#a1a1a1] stroke-[3.5px]" />
            <span>Copied <span className="font-mono text-[#a1a1a1] font-bold">{copiedHex}</span> to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between mb-16 border-b pb-6 transition-colors duration-300" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}>
        <button 
          onClick={() => {
            setCurrentPage('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`inline-flex items-center gap-2 text-xs font-bold tracking-tight transition-transform hover:translate-x-[-3px] focus:outline-none ${
            theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sylvan Platform
        </button>

        <span className="text-[10px] font-mono tracking-widest font-black uppercase text-[#a1a1a1]">
          Sylvan. Brand Spec
        </span>
      </div>

      {/* TYPOGRAPHY SECTION */}
      <section className="mb-20">
        <h2 className="text-xl font-bold tracking-tight mb-8">Typography</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - Plus Jakarta Sans (Body & UI) */}
          <div className={`p-8 rounded-3xl flex flex-col justify-between aspect-[4/3] relative overflow-hidden border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-neutral-50/50 shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="font-sans font-black text-2xl lg:text-3xl tracking-tight leading-none">
                Plus Jakarta Sans
              </span>
              <span className="text-[9px] uppercase tracking-wider text-right font-mono text-neutral-400 shrink-0 ml-2">
                Primary<br />Sans-serif
              </span>
            </div>
            
            <p className="text-sm leading-relaxed font-normal mt-6 font-sans">
              Plus Jakarta Sans is a warm, highly legible modern variable typeface tailored for interfaces and readable body copy.
            </p>
          </div>

          {/* Card 2 - Playfair Display (Editorial Display) */}
          <div className={`p-8 rounded-3xl flex flex-col justify-between aspect-[4/3] relative overflow-hidden border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#121215] border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)]' 
              : 'bg-[#f4f2eb] border-[#cbc6b8] shadow-[0_15px_40px_rgba(140,137,125,0.08)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="font-display font-black text-3xl tracking-tight leading-none">
                Playfair Display
              </span>
              <span className="text-[9px] uppercase tracking-wider text-right font-mono text-neutral-400 shrink-0 ml-2">
                Editorial<br />Display Serif
              </span>
            </div>
            
            <p className="text-sm leading-relaxed font-normal mt-6 font-display italic">
              Playfair Display is a high-contrast serif font family that infuses editorial elegance, storytelling warmth, and prestige.
            </p>
          </div>

          {/* Card 3 - JetBrains Mono (Technical / Status UI) */}
          <div className={`p-8 rounded-3xl flex flex-col justify-between aspect-[4/3] relative overflow-hidden border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-neutral-50/50 shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
          }`}>
            <div className="flex justify-between items-start">
              <span className="font-mono font-bold text-xl lg:text-2xl tracking-tight leading-none">
                JetBrains Mono
              </span>
              <span className="text-[9px] uppercase tracking-wider text-right font-mono text-neutral-400 shrink-0 ml-2">
                Technical<br />Monospace
              </span>
            </div>
            
            <p className="text-xs leading-relaxed mt-6 font-mono text-neutral-400 uppercase tracking-wider">
              ABCDEFGHIJKLMNOP<br />QRSTUVWXYZ<br />1234567890
            </p>
          </div>
        </div>
      </section>

      {/* COLOR PALETTE SECTION */}
      <section className="mb-20">
        <h2 className="text-xl font-bold tracking-tight mb-8">Color Palette</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {colors.map((color) => (
            <div
              key={color.hex}
              onClick={() => copyToClipboard(color.hex)}
              className={`p-5 rounded-3xl border flex flex-col justify-between aspect-[4/5] cursor-pointer group transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
                  : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-neutral-50/50 shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
              }`}
            >
              <div className="w-full aspect-square rounded-2xl shadow-inner mb-4 transition-transform group-hover:scale-[1.02]" style={{ backgroundColor: color.hex }} />
              
              <div className="text-left flex flex-col gap-1 mt-auto">
                <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">
                  {color.label}
                </span>
                <span className="text-xs font-bold font-mono tracking-tight text-neutral-500">
                  RGB {color.rgb}
                </span>
                <span className="text-xs font-bold font-mono tracking-tight text-[#a1a1a1]">
                  HEX {color.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAYOUT GRID SECTION */}
      <section className="mb-12">
        <h2 className="text-xl font-bold tracking-tight mb-8 text-center">Layout Grid</h2>
        
        <div className={`rounded-3xl border p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-between transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-[#0c0c0e] border-white/[0.06] shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-[#fdfdfc] border-[#dfdbd0] shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
        }`}>
          
          {/* GRID COLUMNS */}
          <div className="grid grid-cols-12 gap-5 w-full h-80 relative">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div 
                key={idx} 
                className="h-full rounded-md bg-gradient-to-b from-[#a1a1a1]/[0.12] via-[#a1a1a1]/[0.03] to-transparent border-t border-x border-[#a1a1a1]/[0.15]" 
              />
            ))}
          </div>

          {/* MEASUREMENT GUIDES */}
          <div className="w-full mt-6 font-mono text-[10px] text-neutral-400 flex flex-col gap-2 select-none">
            {/* Dimensions indicators line */}
            <div className="flex justify-between items-center px-1">
              <span>40px</span>
              <div className="flex-1 flex justify-around border-b border-dashed border-neutral-300/40 dark:border-white/[0.08] mx-4 py-1">
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
                <span>20px</span>
              </div>
              <span>40px</span>
            </div>

            {/* Total width line */}
            <div className="relative w-full border-t border-dashed border-[#a1a1a1]/30 py-1.5 mt-2 flex justify-center">
              <span className={`px-2 text-[#a1a1a1] font-bold transition-colors ${theme === 'dark' ? 'bg-[#0c0c0e]/95' : 'bg-[#fdfdfc]/95'}`}>1440 px</span>
            </div>

            {/* Content width line */}
            <div className="relative w-[94.4%] mx-auto border-t border-dashed border-[#a1a1a1]/20 py-1.5 flex justify-center">
              <span className={`px-2 text-[#a1a1a1] font-bold transition-colors ${theme === 'dark' ? 'bg-[#0c0c0e]/95' : 'bg-[#fdfdfc]/95'}`}>1356 px</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <h3 className="text-xl font-bold tracking-tight mb-2">1356*12 Columns</h3>
            <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
              We deliver a clean, straightforward design where each screen is crafted with unique components and clear labels, making it easy to customize and adapt.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
