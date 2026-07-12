import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, 
  Volume2, 
  VolumeX, 
  Star, 
  Target, 
  Flame, 
  Crown, 
  Leaf, 
  Check, 
  X, 
  RotateCcw,
  Sliders
} from 'lucide-react';

interface LiveCustomizerDeckProps {
  brandName: string;
  brandIcon: string;
  brandAccent: string;
  brandTagline: string;
  soundEnabled: boolean;
  onSave: (name: string, icon: string, accent: string, tagline: string) => void;
  onSoundToggle: (enabled: boolean) => void;
  playHapticClick: (type?: 'click' | 'success' | 'toggle') => void;
  theme: 'dark' | 'light';
}

const PRESET_ACCENTS = [
  { name: 'Dynamic Contrast', color: 'dynamic', bg: 'bg-neutral-950 dark:bg-white border border-neutral-300 dark:border-white/20' },
  { name: 'Sylvan Gold', color: '#857850', bg: 'bg-[#857850]' },
  { name: 'Emerald Forest', color: '#10b981', bg: 'bg-[#10b981]' },
  { name: 'Ocean Cobalt', color: '#3b82f6', bg: 'bg-[#3b82f6]' },
  { name: 'Royal Amethyst', color: '#8b5cf6', bg: 'bg-[#8b5cf6]' },
  { name: 'Crimson Ember', color: '#ef4444', bg: 'bg-[#ef4444]' }
];

const PRESET_ICONS = [
  { id: 'tree', label: 'Leaf Symbol', icon: Leaf },
  { id: 'star', label: 'Star Symbol', icon: Star },
  { id: 'target', label: 'Target', icon: Target },
  { id: 'flame', label: 'Flame', icon: Flame },
  { id: 'crown', label: 'Crown', icon: Crown }
];

export default function LiveCustomizerDeck({
  brandName,
  brandIcon,
  brandAccent,
  brandTagline,
  soundEnabled,
  onSave,
  onSoundToggle,
  playHapticClick,
  theme
}: LiveCustomizerDeckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState(brandName);
  const [tempIcon, setTempIcon] = useState(brandIcon);
  const [tempAccent, setTempAccent] = useState(brandAccent);
  const [tempTagline, setTempTagline] = useState(brandTagline);

  // Sync state if changed externally
  useEffect(() => {
    setTempName(brandName);
    setTempIcon(brandIcon);
    setTempAccent(brandAccent);
    setTempTagline(brandTagline);
  }, [brandName, brandIcon, brandAccent, brandTagline]);

  const handleToggleOpen = () => {
    playHapticClick('click');
    setIsOpen(!isOpen);
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(tempName, tempIcon, tempAccent, tempTagline);
    playHapticClick('success');
    
    // Add custom accent color dynamic CSS variable to body
    document.documentElement.style.setProperty('--brand-accent-color', tempAccent);
    
    // Show user a brief visual success confirmation
    setIsOpen(false);
  };

  const handleReset = () => {
    playHapticClick('toggle');
    setTempName('Sylvan');
    setTempIcon('tree');
    setTempAccent('dynamic');
    setTempTagline('Sylvan gives creators, educators, and coaches a fully branded space with courses, events, discussions, and members—all under your own command.');
    
    onSave(
      'Sylvan',
      'tree',
      'dynamic',
      'Sylvan gives creators, educators, and coaches a fully branded space with courses, events, discussions, and members—all under your own command.'
    );
    const resolvedDefault = theme === 'dark' ? '#ffffff' : '#000000';
    document.documentElement.style.setProperty('--brand-accent-color', resolvedDefault);
  };

  const bgStyle = theme === 'dark'
    ? 'bg-[#0d0d10]/95 border-white/[0.08] text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
    : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-[0_15px_35px_rgba(130,126,110,0.15)]';

  const inputStyle = theme === 'dark'
    ? 'bg-white/[0.03] border-white/[0.08] text-white focus:border-[var(--brand-accent-color)] focus:bg-white/[0.06]'
    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-[var(--brand-accent-color)] focus:bg-white';

  return (
    <div className="fixed bottom-6 left-6 z-[999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute bottom-16 left-0 w-[320px] sm:w-[350px] p-5 rounded-2xl border backdrop-blur-xl ${bgStyle}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.05] dark:border-white/[0.05] border-neutral-100">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[var(--brand-accent-color)] animate-pulse" />
                <h4 className="text-sm font-bold tracking-tight">Customizer</h4>
              </div>
              <button 
                onClick={handleToggleOpen}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="flex flex-col gap-4 text-left">
              {/* Brand Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Brand Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={15}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${inputStyle}`}
                  placeholder="e.g. CreatorLab"
                />
              </div>

              {/* Tagline Description Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Tagline</label>
                <textarea
                  value={tempTagline}
                  onChange={(e) => setTempTagline(e.target.value)}
                  maxLength={160}
                  rows={2}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all resize-none ${inputStyle}`}
                  placeholder="A fully branded community space..."
                />
              </div>

              {/* Icon / Emblem Choice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Logo Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_ICONS.map((ico) => {
                    const IconComponent = ico.icon;
                    const isSelected = tempIcon === ico.id;
                    return (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => {
                          playHapticClick('click');
                          setTempIcon(ico.id);
                        }}
                        title={ico.label}
                        className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--brand-accent-color)] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 scale-105 shadow-sm shadow-[var(--brand-accent-color)]/30'
                            : 'border-neutral-200 dark:border-white/[0.06] hover:bg-neutral-100 dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Accent Tones */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Brand Accent Color</label>
                <div className="flex items-center gap-2.5">
                  {PRESET_ACCENTS.map((acc) => {
                    const isSelected = tempAccent === acc.color;
                    return (
                      <button
                        key={acc.color}
                        type="button"
                        onClick={() => {
                          playHapticClick('click');
                          setTempAccent(acc.color);
                        }}
                        title={acc.name}
                        className={`w-6 h-6 rounded-full ${acc.bg} transition-all relative flex items-center justify-center border border-black/10 cursor-pointer`}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 stroke-[3px] ${acc.color === 'dynamic' ? 'text-white dark:text-neutral-950' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Feedback Switcher */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] dark:border-white/[0.05] border-neutral-100">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Ambient Audio Clicks</span>
                  <span className="text-[9px] opacity-40">Play subtle, mechanical UI sounds</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSoundToggle(!soundEnabled);
                    // play sound on next frame so toggle is fresh
                    setTimeout(() => playHapticClick('toggle'), 30);
                  }}
                  className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                  }`}
                  title={soundEnabled ? "Mute Click Effects" : "Enable Click Effects"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 text-[11px] font-bold border border-neutral-200 dark:border-white/[0.08] rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: tempAccent === 'dynamic'
                      ? (theme === 'dark' ? '#ffffff' : '#000000')
                      : tempAccent
                  }}
                  className={`px-3 py-2 text-[11px] font-bold ${
                    tempAccent === 'dynamic'
                      ? (theme === 'dark' ? 'text-neutral-950' : 'text-white')
                      : 'text-white'
                  } rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-transparent`}
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Live
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger floating button */}
      <motion.button
        onClick={handleToggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg relative cursor-pointer focus:outline-none select-none transition-all ${
          isOpen
            ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-neutral-950'
            : theme === 'dark'
              ? 'bg-transparent border-white/[0.12] text-white hover:bg-white/[0.05]'
              : 'bg-transparent border-neutral-300 text-neutral-800 hover:bg-neutral-100'
        }`}
        title="Customize This Space"
      >
        <Wand2 className="w-5 h-5" strokeWidth={2} />
        {/* Breathing live beacon glow indicator - dot matches light/dark theme color */}
        <span className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 animate-pulse ${
          theme === 'dark' 
            ? 'bg-white border-[#151518]' 
            : 'bg-neutral-950 border-white'
        }`} />
      </motion.button>
    </div>
  );
}
