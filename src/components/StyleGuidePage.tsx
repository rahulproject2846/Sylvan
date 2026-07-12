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
  Palette,
  MessageSquare,
  BookOpen,
  Calendar,
  Users,
  ChevronRight,
  Sliders,
  Play,
  Lock,
  CheckCircle,
  Eye,
  MousePointer,
  HelpCircle
} from 'lucide-react';

interface StyleGuidePageProps {
  theme: 'dark' | 'light';
  setCurrentPage: (page: 'landing' | 'behance') => void;
  handleOpenJoinModal?: (plan?: any) => void;
}

export default function StyleGuidePage({ theme, setCurrentPage }: StyleGuidePageProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTabDemo, setActiveTabDemo] = useState<string>('Community');
  const [demoInput, setDemoInput] = useState<string>('');
  const [rsvpDemo, setRsvpDemo] = useState<boolean>(false);
  const [lessonDemo, setLessonDemo] = useState<number[]>([0]);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const colors = [
    { rgb: '7 7 8', hex: '#070708', label: 'Obsidian Void (Main Dark BG)' },
    { rgb: '12 12 14', hex: '#0C0C0E', label: 'Elevated Ash (Dark Cards)' },
    { rgb: '251 250 247', hex: '#FBFAF7', label: 'Sylvan Pearl (Main Light BG)' },
    { rgb: '244 242 235', hex: '#F4F2EB', label: 'Sylvan Ivory (Light Cards)' },
    { rgb: '233 230 220', hex: '#E9E6DC', label: 'Brand Clay (Light Borders / Highlights)' },
    { rgb: '223 219 208', hex: '#DFDBD0', label: 'Brand Ochre (Light Contrasts)' },
    { rgb: '161 161 161', hex: '#A1A1A1', label: 'Muted Pewter (Gray Text)' },
    { rgb: '255 255 255', hex: '#FFFFFF', label: 'Pure White (Dark Texts)' }
  ];

  const typographyDemos = [
    {
      font: 'Plus Jakarta Sans',
      category: 'Primary Sans-Serif (UI, Buttons & Body Copy)',
      desc: 'Used for system controls, navigation menus, descriptions, forms, and general high-readability items.',
      styles: [
        { label: 'Display Bold', class: 'text-3xl font-extrabold tracking-tight' },
        { label: 'UI Title Semi-bold', class: 'text-lg font-semibold tracking-wide' },
        { label: 'Body Text Regular', class: 'text-sm font-normal text-neutral-400' }
      ]
    },
    {
      font: 'Playfair Display',
      category: 'Editorial Serif (Headings & Literary Accents)',
      desc: 'Infuses warmth, high-end design prestige, and narrative flow in large headings.',
      styles: [
        { label: 'Hero Display Serif', class: 'text-4xl sm:text-5xl font-display font-medium tracking-tight italic' },
        { label: 'Section Title Serif', class: 'text-2xl font-display font-semibold italic' }
      ]
    },
    {
      font: 'JetBrains Mono',
      category: 'Monospace (Subheadings, Points, Live Status)',
      desc: 'Gives a modern developer aesthetic, precision stats, point logs, and lightweight meta labels.',
      styles: [
        { label: 'Status Code Label', class: 'font-mono text-xs uppercase tracking-widest font-black text-[#a1a1a1]' },
        { label: 'Points/Counters', class: 'font-mono text-sm font-semibold' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative transition-colors duration-500 text-left overflow-hidden ${
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16 border-b pb-6 transition-colors duration-300" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}>
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
          Sylvan. Brand Spec & Component Guide
        </span>
      </div>

      {/* MAIN DESCRIPTION */}
      <div className="mb-24 max-w-4xl">
        <h1 className="text-5xl sm:text-7xl font-display font-medium tracking-tight mb-6 italic leading-none">
          Sylvan Design Language
        </h1>
        <p className={`text-base sm:text-lg leading-relaxed font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          A cohesive brand specification documenting the exact typography, palette scales, interactive components, micro-widgets, and layouts that compose Sylvan's unified, high-end creator experience.
        </p>
      </div>

      {/* TYPOGRAPHY SECTION */}
      <section className="mb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          01. Typography System
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
          {typographyDemos.map((demo, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-3xl flex flex-col justify-between border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_15px_30px_rgba(0,0,0,0.4)]' 
                  : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-neutral-50/50 shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
              }`}
            >
              <div className="mb-6">
                <div className="flex flex-col gap-2 mb-4">
                  <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight leading-none text-neutral-900 dark:text-white block">
                    {demo.font}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-wider font-mono text-neutral-500 dark:text-neutral-400 leading-relaxed block break-words whitespace-normal font-bold">
                    {demo.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium break-words whitespace-normal">{demo.desc}</p>
              </div>

              <div className="space-y-5 pt-5 border-t border-dashed" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                {demo.styles.map((style, sIdx) => (
                  <div key={sIdx} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-extrabold">{style.label}</span>
                    <span className={`${style.class} transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'} leading-tight break-words overflow-hidden text-ellipsis`}>
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLOR PALETTE SECTION */}
      <section className="mb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          02. Cohesive Color Palette
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div
              key={color.hex}
              onClick={() => copyToClipboard(color.hex)}
              className={`p-5 rounded-3xl border flex flex-col justify-between cursor-pointer group transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_10px_20px_rgba(0,0,0,0.3)]' 
                  : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-[#fbfaf7] shadow-[0_8px_20px_rgba(140,137,125,0.03)]'
              }`}
            >
              <div className="w-full aspect-square rounded-2xl shadow-inner mb-4 transition-transform group-hover:scale-[1.02] border border-[#dfdbd0] dark:border-white/[0.06]" style={{ backgroundColor: color.hex }} />
              
              <div className="text-left flex flex-col gap-1.5 w-full overflow-hidden">
                <span className={`text-[11px] font-black uppercase tracking-wider transition-colors block leading-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  {color.label.split(' (')[0]}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-relaxed break-words whitespace-normal block w-full">
                  {color.label}
                </span>
                <span className="text-[10.5px] font-mono font-bold text-neutral-500 dark:text-neutral-400 mt-1 block">
                  HEX {color.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPONENT BUTTONS & STATES */}
      <section className="mb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          03. Standard Buttons & Interactive States
        </h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          {/* BUTTON SPEC CARD */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <h3 className={`text-base sm:text-lg font-black tracking-tight uppercase font-mono mb-6 border-b pb-3 ${
              theme === 'dark' ? 'text-white border-white/[0.08]' : 'text-neutral-900 border-neutral-200'
            }`}>
              Button Variations
            </h3>
            
            <div className="space-y-6">
              {/* Primary Buttons */}
               <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                 <div>
                   <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                     Primary Brand Button
                   </span>
                   <p className="text-xs text-neutral-500 mt-0.5">Used for the main calls to action on the site.</p>
                 </div>
                 <button className={`px-6 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide transition-all self-center text-center border duration-300 ${
                   theme === 'dark' 
                     ? 'bg-white hover:bg-white/[0.08] hover:text-white border-transparent hover:border-white/[0.15] text-neutral-950 shadow-white/[0.02]' 
                     : 'bg-neutral-950 hover:bg-white hover:text-neutral-900 hover:border-[#dfdbd0] text-white border-transparent shadow-neutral-950/[0.05]'
                 }`}>
                   Join Platform
                 </button>
               </div>

              {/* Secondary Buttons */}
               <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                 <div>
                   <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                     Secondary Outline Button
                   </span>
                   <p className="text-xs text-neutral-500 mt-0.5">Used for secondary routing and exploration.</p>
                 </div>
                 <button className={`px-6 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide transition-all border self-center text-center duration-300 ${
                   theme === 'dark' 
                     ? 'bg-white/[0.04] text-white border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.08] shadow-sm' 
                     : 'bg-[#e9e6dc] text-neutral-900 border-[#dfdbd0] hover:bg-white hover:border-[#dfdbd0] shadow-sm'
                 }`}>
                   Explore Courses
                 </button>
               </div>

              {/* Interactive Tab Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    Tab Controller / Menu Item
                  </span>
                  <p className="text-xs text-neutral-500 mt-0.5">Custom active & inactive states.</p>
                </div>
                <div className="flex gap-2">
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    theme === 'dark' 
                      ? 'bg-white/[0.08] text-white border-white/[0.08]' 
                      : 'bg-neutral-200/80 text-neutral-950 font-bold border-neutral-300/60 shadow-sm'
                  }`}>
                    Active Tab
                  </button>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-bold border border-transparent transition-all ${
                    theme === 'dark' 
                      ? 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200' 
                      : 'text-neutral-500 hover:bg-neutral-200/40 hover:text-neutral-900'
                  }`}>
                    Inactive
                  </button>
                </div>
              </div>

              {/* Icon Button controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    Icon Button (Compact)
                  </span>
                  <p className="text-xs text-neutral-500 mt-0.5">Used in toolbar rows and small grids.</p>
                </div>
                <div className="flex gap-2">
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                    theme === 'dark' 
                      ? 'bg-[#0c0c0e] border-white/[0.08] text-neutral-300 hover:text-white' 
                      : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600 hover:text-neutral-900 shadow-sm'
                  }`}>
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                    theme === 'dark' 
                      ? 'bg-[#0c0c0e] border-white/[0.08] text-neutral-300 hover:text-white' 
                      : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600 hover:text-neutral-900 shadow-sm'
                  }`}>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT FORM ELEMENTS SPEC */}
          <div className={`p-8 rounded-3xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <h3 className={`text-base sm:text-lg font-black tracking-tight uppercase font-mono mb-6 border-b pb-3 ${
              theme === 'dark' ? 'text-white border-white/[0.08]' : 'text-neutral-900 border-neutral-200'
            }`}>
              Interactive Controls
            </h3>
            
            <div className="space-y-6">
              {/* Text Input */}
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  Standard Input Field
                </span>
                <input 
                  type="text" 
                  placeholder="Enter your email address..."
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs border font-medium focus:outline-none transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-white/[0.03] border-white/[0.1] text-white placeholder-neutral-500 focus:border-white/[0.2] focus:bg-white/[0.05]' 
                      : 'bg-neutral-100/60 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:bg-white'
                  }`}
                />
              </div>

              {/* Status Pill Indicator */}
              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    Status Badges (Live / Active)
                  </span>
                  <p className="text-xs text-neutral-500 mt-0.5">Shows status in the mockup panel.</p>
                </div>
                <div className="flex gap-2">
                  <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[9px] font-extrabold transition-colors uppercase tracking-wider ${
                    theme === 'dark' ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'bg-neutral-950/10 border-neutral-300 text-neutral-950'
                  }`}>
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[9px] font-extrabold transition-colors uppercase tracking-wider ${
                    theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06] text-neutral-500' : 'bg-neutral-150 border-neutral-200 text-neutral-400'
                  }`}>
                    Draft
                  </div>
                </div>
              </div>

              {/* Micro Toggle RSVP */}
              <div className="grid grid-cols-2 items-center gap-4 pt-4 border-t border-dashed" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    Interactive RSVP Switch
                  </span>
                  <p className="text-xs text-neutral-500 mt-0.5">Used in mockup events.</p>
                </div>
                <button 
                  onClick={() => setRsvpDemo(!rsvpDemo)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border shrink-0 text-center uppercase tracking-wide cursor-pointer ${
                    rsvpDemo 
                      ? theme === 'dark'
                        ? 'bg-white text-neutral-950 border-white' 
                        : 'bg-neutral-900 text-white border-neutral-900'
                      : theme === 'dark'
                        ? 'bg-transparent border-white/[0.12] text-neutral-300 hover:bg-white/[0.03]'
                        : 'bg-transparent border-[#dfdbd0] text-neutral-700 hover:bg-neutral-950/5'
                  }`}
                >
                  {rsvpDemo ? 'RSVP\'d (Going)' : 'Join Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURE WIDGET MINIATURES */}
      <section className="mb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          04. Sylvan Mockup Modules (Dashboard Miniatures)
        </h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          
          {/* COMMUNITY CONTEXT CARD */}
          <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <div>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                COMMUNITY FEED WIDGET
              </span>
              <h3 className={`text-base sm:text-lg font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                Interactive Discussion Bubble
              </h3>
            </div>
            
            <div className={`p-4 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#f5f3ec] border-neutral-300/50'
            }`}>
              <div className="flex gap-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Nina Park's avatar" 
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Nina Park</span>
                    <span className="text-[9px] font-mono text-neutral-500">12m ago</span>
                  </div>
                  <p className={`text-[10.5px] mt-1 leading-normal transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Just wrapped up a full rebrand using only Framer variables — took 3x longer to set up, but the client handoff was the cleanest I've ever done.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 mt-4 leading-relaxed font-medium">
              Maintains high visual density and crisp layout, ensuring community interactions look clean and organized.
            </p>
          </div>

          {/* ACTIVE COURSE ROW */}
          <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0c0c0e] border-white/[0.06]' 
              : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <div>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                COURSE UNIT SELECTION
              </span>
              <h3 className={`text-base sm:text-lg font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                Lesson Rows & Completion Bars
              </h3>
            </div>
            
            <div className="space-y-2">
              {/* Active completed lesson */}
              <div className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                theme === 'dark' ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-neutral-200/50 border-neutral-300'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-neutral-500" />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>01. Visual Density & Margin Scale</span>
                </div>
                <span className="text-[10px] font-semibold opacity-60">12m</span>
              </div>

              {/* Interactive incomplete lesson */}
              <div className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]' : 'bg-[#e9e6dc]/30 border-[#dfdbd0] hover:bg-[#e9e6dc]/60'
              }`}>
                <div className="flex items-center gap-2">
                  <Play className="w-3 h-3 text-neutral-500 ml-0.5" />
                  <span className="font-semibold text-neutral-500">02. Modern Typography Hierarchies</span>
                </div>
                <span className="text-[10px] font-semibold opacity-60 text-neutral-500">18m</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-4 leading-relaxed font-medium">
              Provides distinct styling for active, completed, and locked lessons using semantic line-icons.
            </p>
          </div>

        </div>
      </section>

      {/* LAYOUT GRID SECTION */}
      <section className="mb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          05. Core Layout Grid
        </h2>
        
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
            <h3 className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
              1356*12 Columns Grid System
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Sylvan aligns content to a precise 12-column bento system with dynamic breakpoints. This ensures perfect spacing density on devices ranging from mobile phones to high-resolution widescreen monitors.
            </p>
          </div>

        </div>
      </section>

      {/* COMPONENT SHOWCASE SECTION */}
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-8 italic border-l-4 pl-4" style={{ borderColor: theme === 'dark' ? 'white' : 'black' }}>
          06. Sylvan Platform Core Component Showcase
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6">
          
          {/* COMPONENT 1: PLATFORM HERO BADGE */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#0c0c0e] border-white/[0.06]' : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                HERO LAUNCHER BADGE
              </span>
              <h4 className={`text-base font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                Sylvan Core Tag
              </h4>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed font-medium">Used at the pinnacle of the hero section to set Sylvan's visual focus and branding.</p>
            </div>
            
            <div className="py-6 flex justify-center items-center rounded-2xl border bg-black/[0.02] dark:bg-white/[0.01] border-neutral-300/30 dark:border-white/[0.04]">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-white/[0.08] bg-white/[0.03] text-white' 
                  : 'border-[#dfdbd0] bg-[#e9e6dc]/40 text-neutral-950'
              }`}>
                Community platform for creators
              </div>
            </div>
          </div>

          {/* COMPONENT 2: NEWSLETTER SUBSCRIPTION COMPONENT */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#0c0c0e] border-white/[0.06]' : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                CONVERSION / INPUTS
              </span>
              <h4 className={`text-base font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                Newsletter Form
              </h4>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed font-medium">High-contrast, high-readability form that fits gracefully into standard sections.</p>
            </div>
            
            <div className="p-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.01] border-neutral-300/30 dark:border-white/[0.04] space-y-3">
              <input 
                type="email" 
                readOnly
                placeholder="Enter your email address"
                value="creator@sylvan.design"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium focus:outline-none transition-all duration-200 cursor-not-allowed ${
                  theme === 'dark' 
                    ? 'bg-white/[0.03] border-white/[0.1] text-neutral-300' 
                    : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                }`}
              />
              <button className={`w-full py-2 rounded-xl text-xs font-bold font-sans tracking-wide transition-colors ${
                theme === 'dark' ? 'bg-white text-black' : 'bg-neutral-950 text-white'
              }`}>
                Subscribe to Dispatch
              </button>
            </div>
          </div>

          {/* COMPONENT 3: MINIMAL BENTO PRICING COMPACT */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#0c0c0e] border-white/[0.06]' : 'bg-[#fdfdfc] border-[#dfdbd0]'
          }`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                PRICING STRUCTURES
              </span>
              <h4 className={`text-base font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                The Sylvan Tier Card
              </h4>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed font-medium">Showcases plan price, billing recurrence, and visual bullets highlighting values.</p>
            </div>
            
            <div className={`p-4 rounded-2xl border transition-colors ${
              theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#f5f3ec]/50 border-neutral-300/45'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Pro Sylvan</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 uppercase tracking-wide">Popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-bold font-sans">$49</span>
                <span className="text-[9px] text-neutral-500">/ month</span>
              </div>
              <div className="space-y-1 text-[10px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3px]" />
                  <span>Custom domain & brand style</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3px]" />
                  <span>Unlimited masterclasses & lessons</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
