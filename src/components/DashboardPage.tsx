import React, { useState, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  Send, 
  Lock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Compass, 
  Heart, 
  Smile, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Sliders, 
  LayoutGrid, 
  Sun, 
  Moon,
  Check,
  Search,
  Leaf,
  Target,
  Crown,
  Star
} from 'lucide-react';
import { LEADERBOARD_MEMBERS, COURSE_MODULES } from '../data';
import { CourseModule, LeaderboardMember } from '../types';
import Typewriter from './Typewriter';

interface DashboardPageProps {
  theme: 'dark' | 'light';
  setCurrentPage: (page: 'landing' | 'behance' | 'dashboard') => void;
  handleOpenJoinModal: (plan?: any) => void;
  brandName?: string;
  brandIcon?: string;
  playHapticClick?: (type?: 'click' | 'success' | 'toggle') => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 30 },
      opacity: { duration: 0.22, ease: "easeOut" }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 30 },
      opacity: { duration: 0.22, ease: "easeOut" }
    }
  })
};

const getUnifiedButtonClass = (theme: string, isPrimary: boolean = true) => {
  const base = "font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ease-out shadow-lg border";
  if (isPrimary) {
    return theme === 'dark'
      ? `${base} bg-white text-neutral-950 border-transparent hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] shadow-white/[0.02]`
      : `${base} bg-neutral-950 text-white border-transparent hover:bg-white hover:text-neutral-900 hover:border-[#dfdbd0] shadow-neutral-950/[0.05]`;
  } else {
    return theme === 'dark'
      ? `${base} bg-transparent text-white border-white/[0.15] hover:bg-white/[0.04]`
      : `${base} bg-transparent text-neutral-950 border-[#dfdbd0] hover:bg-neutral-100/60`;
  }
};

export default function DashboardPage({
  theme,
  setCurrentPage,
  handleOpenJoinModal,
  brandName = 'Sylvan',
  brandIcon = 'tree',
  playHapticClick
}: DashboardPageProps) {

  const SelectedBrandIcon = (() => {
    switch (brandIcon) {
      case 'star': return Star;
      case 'target': return Target;
      case 'flame': return Flame;
      case 'crown': return Crown;
      default: return Leaf;
    }
  })();
  // Tabs for interactive experience
  const [activeTab, setActiveTab] = useState<'Overview' | 'Chat' | 'Courses' | 'Events' | 'Members' | 'Leaderboard'>('Overview');
  const [prevTab, setPrevTab] = useState<'Overview' | 'Chat' | 'Courses' | 'Events' | 'Members' | 'Leaderboard'>('Overview');
  
  // Interactive Chat State
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Nina Park', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', text: "Just wrapped up a full rebrand using only Framer variables — took 3x longer to set up, but the client handoff was the cleanest I've ever done.", time: '12m ago' },
    { id: 2, sender: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', text: "Has anyone benchmarked custom fonts on Cloudflare Pages vs Netlify? Seeing some weird layout shifts on mobile Safari.", time: '4m ago' }
  ]);

  // Course completion states
  const [completedLessons, setCompletedLessons] = useState<string[]>(['Welcome & Core Philosophies']);
  const [expandedModule, setExpandedModule] = useState<string | null>('m-1');

  // Event RSVPs
  const [eventRSVPs, setEventRSVPs] = useState<{ [key: string]: boolean }>({
    'ev-1': true,
    'ev-2': false
  });

  // UX UPGRADES STATES
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [eventsViewMode, setEventsViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);
  
  // Member Search and Detail
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<LeaderboardMember | null>(null);
  const [dmText, setDmText] = useState<string>('');
  const [dmSentSuccess, setDmSentSuccess] = useState<boolean>(false);

  const tabIndexMap = {
    'Overview': 0,
    'Chat': 1,
    'Courses': 2,
    'Events': 3,
    'Members': 4,
    'Leaderboard': 5
  };

  const currentIdx = tabIndexMap[activeTab] ?? 0;
  const prevIdx = tabIndexMap[prevTab] ?? 0;
  const slideDirection = currentIdx >= prevIdx ? 1 : -1;

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const newMsg = {
      id: chatMessages.length + 1,
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80',
      text: chatText,
      time: 'Just now'
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatText('');
  };

  const toggleRSVP = (eventId: string) => {
    setEventRSVPs(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const toggleLesson = useCallback((lesson: string) => {
    setCompletedLessons(prev => {
      const next = prev.includes(lesson) 
        ? prev.filter(l => l !== lesson) 
        : [...prev, lesson];
      
      const totalLessons = COURSE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
      if (next.length === totalLessons) {
        setShowCelebration(true);
      }
      return next;
    });
  }, []);

  return (
    <div className={`pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative transition-colors duration-500 text-left`}>
      
      {/* SECTION HEADER */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-neutral-950'
        }`}>
          Sylvan Workspace
        </h1>
        <p className={`text-sm mt-2 font-medium transition-colors duration-300 ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
        }`}>
          Explore the fully functional and interactive white-label community dashboard mockup.
        </p>
      </div>

      {/* FULL CONTAINER DASHBOARD */}
      <div className={`w-full rounded-3xl border transition-all duration-300 ${
        theme === 'dark'
          ? 'border-white/[0.08] bg-white/[0.015] backdrop-blur-xl shadow-[0_45px_100px_rgba(0,0,0,0.65)]'
          : 'border-[#dfdbd0] bg-white/70 backdrop-blur-xl shadow-[0_45px_100px_rgba(0,0,0,0.06)]'
      } overflow-hidden mb-24`}>
        {/* Mock Browser Top Bar */}
        <div className={`h-12 border-b flex items-center justify-between px-4 transition-all duration-300 ${
          theme === 'dark' ? 'bg-neutral-900/60 border-neutral-900' : 'bg-neutral-100/90 border-neutral-200'
        }`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
          </div>
          <div className={`h-7 w-[60%] sm:w-1/2 px-4 rounded-full border flex items-center justify-center gap-1.5 text-xs select-none transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#070708] border-white/[0.08] text-neutral-400' : 'bg-white border-neutral-300 text-neutral-600 shadow-sm'
          }`}>
            <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">community.sylvan-saas.vercel.app/dashboard</span>
          </div>
          <div className="flex items-center gap-1.5 w-12 justify-end shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700/60" />
          </div>
        </div>

        {/* Workspace Layout */}
        <div className={`flex flex-col md:flex-row h-[600px] sm:h-[650px] md:h-[680px] text-left transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#070708]/15' : 'bg-white/20'
        }`}>
          {/* Sidebar */}
          <div className={`w-full md:w-1/4 md:min-w-[180px] md:max-w-[240px] border-b md:border-b-0 md:border-r p-4 flex flex-col gap-1.5 select-none transition-colors duration-300 ${
            theme === 'dark' ? 'bg-white/[0.01] border-white/[0.08]' : 'bg-[#f4f2eb]/60 border-neutral-300'
          }`}>
            <div className={`px-2 pb-3 mb-3 border-b flex items-center gap-2 ${
              theme === 'dark' ? 'border-white/[0.06]' : 'border-neutral-300'
            }`}>
              <SelectedBrandIcon className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} strokeWidth={2.5} />
              <span className={`font-sans font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{brandName}.</span>
            </div>

            <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar py-1 md:py-0">
              {[
                { label: 'Overview', icon: Globe },
                { label: 'Chat', icon: MessageSquare, count: 2 },
                { label: 'Courses', icon: BookOpen },
                { label: 'Events', icon: Calendar },
                { label: 'Members', icon: Users },
                { label: 'Leaderboard', icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.label;
                return (
                  <button 
                    key={tab.label}
                    onClick={() => {
                      playHapticClick?.('click');
                      setPrevTab(activeTab);
                      setActiveTab(tab.label as any);
                    }}
                    className={`flex-1 md:flex-initial w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold outline-none focus:outline-none transition-all duration-150 border shrink-0 ${
                      isSelected 
                        ? theme === 'dark'
                          ? 'bg-white/[0.08] text-white border-white/[0.08]' 
                          : 'bg-neutral-200/80 text-neutral-950 font-bold border-neutral-300/60 shadow-sm'
                        : theme === 'dark'
                          ? 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200 border-transparent'
                          : 'text-neutral-500 hover:bg-neutral-200/40 hover:text-neutral-900 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                        isSelected 
                          ? theme === 'dark' ? 'text-white' : 'text-neutral-950' 
                          : 'text-neutral-500'
                      }`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.count && (
                      <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                        theme === 'dark' ? 'bg-white/10 text-white' : 'bg-neutral-950/15 text-neutral-950'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col transition-all duration-300 ${
            theme === 'dark' ? 'bg-white/[0.01]' : 'bg-white/40'
          }`}>
            <AnimatePresence mode="wait">
              {/* 1. OVERVIEW SCREEN */}
              {activeTab === 'Overview' && (
                <motion.div 
                  key="Overview"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-5 h-full justify-between"
                >
                  <div className="flex flex-col gap-5">
                    {/* Welcome Card */}
                    <motion.div 
                      whileHover={{ scale: 1.015, translateY: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`relative overflow-hidden rounded-2xl p-6 flex items-center justify-between shadow-sm cursor-pointer border backdrop-blur-sm ${
                        theme === 'dark'
                          ? 'bg-gradient-to-tr from-white/[0.04] via-white/[0.015] to-transparent border-white/[0.08]'
                          : 'bg-gradient-to-tr from-neutral-200/50 via-neutral-100/30 to-neutral-50/10 border-neutral-300'
                      }`}
                    >
                      <div className="z-10 max-w-[75%]">
                        <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>Featured Community</span>
                        <h3 className={`text-xl font-bold mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Strong By Ava</h3>
                        <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Weekly live coaching sessions, curriculum lesson progression, and peer critiques.</p>
                      </div>
                      <div className="relative shrink-0 flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center font-bold text-neutral-950 text-2xl shadow">A</div>
                        <span className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>847 members</span>
                      </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className={`backdrop-blur-sm p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold uppercase tracking-wide truncate">Active Members</span>
                        <span className={`text-lg sm:text-2xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1,280</span>
                      </div>
                      <div className={`backdrop-blur-sm p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold uppercase tracking-wide truncate">Course Takers</span>
                        <span className={`text-lg sm:text-2xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>324</span>
                      </div>
                      <div className={`backdrop-blur-sm p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold uppercase tracking-wide truncate">Forum</span>
                        <span className={`text-lg sm:text-2xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>12 Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Join Prompt Card */}
                  <motion.div 
                    whileHover={{ scale: 1.01, translateY: -1, boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.25)" }}
                    className={`backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
                      theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-[#f8f6f0]/85 border-[#dfdbd0]'
                    }`}
                  >
                    <div className="flex items-start gap-4 text-left">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                        alt="Ava" 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border shrink-0 ${theme === 'dark' ? 'border-neutral-800' : 'border-[#cbc6b8]'}`}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className={`text-xs sm:text-sm font-bold block leading-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                          Join Ava Torres's circle discussions
                        </span>
                        <span className={`text-xs block mt-1.5 leading-normal ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'}`}>
                          Participate in design critiques, strength circles, training progressions and sprints with other members.
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenJoinModal()}
                      className={`w-full sm:w-auto px-6 py-2.5 font-extrabold rounded-full text-xs sm:text-sm transition-colors shadow-sm shrink-0 text-center ${
                        theme === 'dark' 
                          ? 'bg-white text-neutral-950 hover:bg-neutral-100' 
                          : 'bg-neutral-950 text-white hover:bg-neutral-900'
                      }`}
                    >
                      Join now
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* 2. CHAT SCREEN */}
              {activeTab === 'Chat' && (
                <motion.div 
                  key="Chat"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col h-full justify-between"
                >
                  {/* Header */}
                  <div className={`pb-3 flex items-center justify-between gap-2 shrink-0 border-b ${
                    theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                  }`}>
                    <div className="min-w-0 flex-1 text-left">
                      <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>#design-lounge</h3>
                      <p className={`text-xs mt-0.5 truncate ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Casual conversations, critiques, and feedback loops.</p>
                    </div>
                    <span className={`text-xs flex items-center gap-2 shrink-0 whitespace-nowrap ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>8 online</span>
                    </span>
                  </div>

                  {/* Messages Board */}
                  <div className="flex-1 overflow-y-auto my-4 flex flex-col gap-3.5 pr-1 select-text scrollbar-thin">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className="flex gap-3 items-start">
                        <img 
                          src={msg.avatar} 
                          alt={msg.sender} 
                          className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
                            theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        <div className="max-w-[85%] text-left">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{msg.sender}</span>
                            <span className={`text-[10px] ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>{msg.time}</span>
                          </div>
                          <p className={`text-xs sm:text-sm mt-1.5 backdrop-blur-sm px-4 py-2.5 rounded-2xl rounded-tl-none inline-block leading-relaxed border ${
                            theme === 'dark' 
                              ? 'text-neutral-200 bg-white/[0.03] border-white/[0.06]' 
                              : 'text-neutral-850 bg-neutral-100/80 border-neutral-200/80'
                          }`}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Bar */}
                  <form onSubmit={handleSendMessage} className={`flex gap-3 pt-3 shrink-0 border-t ${
                    theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                  }`}>
                    <input 
                      type="text"
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      placeholder="Type a message to sylvan community..."
                      className={`flex-1 rounded-full px-5 py-3 text-xs sm:text-sm focus:outline-none focus:border-neutral-450 dark:focus:border-neutral-500 border ${
                        theme === 'dark' 
                          ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-neutral-550' 
                          : 'bg-neutral-100 border-neutral-200 text-neutral-950 placeholder-neutral-400'
                      }`}
                    />
                    <button 
                      type="submit"
                      className="p-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* 3. COURSES SCREEN */}
              {activeTab === 'Courses' && (() => {
                const totalLessons = COURSE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
                const completedLessonsCount = completedLessons.length;
                const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
                
                return (
                  <motion.div 
                    key="Courses"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-4 text-left"
                  >
                    <div className={`pb-3.5 flex flex-col gap-3 border-b ${
                      theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Course Syllabus</h3>
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Interactive chapters and course progression records.</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`text-xs sm:text-sm font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{progressPercent}%</span>
                          <span className={`text-[10px] sm:text-xs font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'}`}>{completedLessonsCount}/{totalLessons} lessons completed</span>
                        </div>
                      </div>
                      
                      {/* Progress bar container */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/[0.06]' : 'bg-neutral-200'}`}>
                        <motion.div 
                          className={`h-full rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-neutral-950'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5 pb-8 overflow-y-auto max-h-[350px] sm:max-h-[400px] scrollbar-thin">
                      {COURSE_MODULES.map(module => {
                        const isExpanded = expandedModule === module.id;
                        return (
                          <div key={module.id} className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-colors ${
                            theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                          }`}>
                            <button 
                              onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                              className={`w-full px-5 py-4 flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-medium transition-colors ${
                                theme === 'dark' ? 'hover:bg-white/[0.05]' : 'hover:bg-neutral-200/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <BookOpen className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
                                <span className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} title={module.title}>
                                  {module.title}
                                </span>
                              </div>
                              <div className={`flex items-center gap-2 shrink-0 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                <span className="text-[10px] sm:text-xs font-mono whitespace-nowrap">{module.lessons.length} lessons</span>
                                <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className={`overflow-hidden border-t ${
                                    theme === 'dark' ? 'bg-[#070708]/30 border-white/[0.04]' : 'bg-white/40 border-neutral-200'
                                  }`}
                                >
                                  <div className="px-5 pt-2 pb-5 flex flex-col gap-3 text-left w-full">
                                    {module.lessons.map((lesson, idx) => {
                                      const isCompleted = completedLessons.includes(lesson);
                                      return (
                                        <div 
                                          key={idx} 
                                          onClick={() => toggleLesson(lesson)}
                                          className={`flex items-center gap-3 py-2 text-xs sm:text-sm cursor-pointer transition-colors group select-none min-w-0 w-full ${
                                            theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-750 hover:text-neutral-950'
                                          }`}
                                        >
                                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                            isCompleted
                                              ? theme === 'dark'
                                                ? 'bg-white border-white text-neutral-950'
                                                : 'bg-neutral-950 border-neutral-950 text-white'
                                              : theme === 'dark'
                                                ? 'border-white/[0.12] bg-white/[0.02] text-transparent group-hover:border-white/[0.25]'
                                                : 'border-[#dfdbd0] bg-neutral-50 text-transparent group-hover:border-neutral-450'
                                          }`}>
                                            <Check className="w-3 h-3 stroke-[3.5px]" />
                                          </div>
                                          <span 
                                            className={`transition-all duration-300 truncate flex-1 min-w-0 ${isCompleted ? 'line-through text-neutral-500 font-medium' : ''}`}
                                            title={lesson}
                                          >
                                            {lesson}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })()}              {/* 4. EVENTS SCREEN */}
              {activeTab === 'Events' && (() => {
                const ALL_EVENTS = [
                  { id: 'ev-1', title: 'Product Layout Review Loop', host: 'Ava Torres', date: 'Jul 8, 2026', dayNum: 8, time: '10:00 AM', desc: 'Interactive visual layout review and designer check-ins. Great for giving/getting direct feedback.' },
                  { id: 'ev-2', title: 'Typography Masterclass', host: 'Marcus Aurel', date: 'Jul 15, 2026', dayNum: 15, time: '2:30 PM', desc: 'Deep dive into optical hierarchy, custom type adjustments, tracking, and leading rules for high-density screens.' },
                  { id: 'ev-3', title: 'Sylvan Design Q&A', host: 'Ava Torres', date: 'Jul 22, 2026', dayNum: 22, time: '4:00 PM', desc: 'Weekly community hangout, troubleshooting specific layout design systems and answering setup questions.' }
                ];

                const filteredEvents = selectedEventDate 
                  ? ALL_EVENTS.filter(ev => ev.dayNum === parseInt(selectedEventDate))
                  : ALL_EVENTS;

                // Calendar days for July 2026 (Starts on Wed (3 empty offset days), 31 days total)
                const offsetDays = Array(3).fill(null);
                const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

                return (
                  <motion.div 
                    key="Events"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-4 text-left h-full"
                  >
                    <div className={`pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                      <div>
                        <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Events Calendar</h3>
                        <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>RSVP for community masterclasses and co-working sprints.</p>
                      </div>
                      <div className="flex gap-1.5 bg-neutral-200/50 dark:bg-white/[0.04] p-1 rounded-xl shrink-0">
                        <button 
                          onClick={() => { setEventsViewMode('list'); setSelectedEventDate(null); }} 
                          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all outline-none ${eventsViewMode === 'list' ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm' : 'text-neutral-500'}`}
                        >
                          Agenda
                        </button>
                        <button 
                          onClick={() => setEventsViewMode('calendar')} 
                          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all outline-none ${eventsViewMode === 'calendar' ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm' : 'text-neutral-500'}`}
                        >
                          Calendar View
                        </button>
                      </div>
                    </div>

                    {eventsViewMode === 'calendar' ? (
                      <div className="flex flex-col lg:flex-row gap-5 w-full">
                        {/* Interactive Calendar Card */}
                        <div className={`w-full lg:w-[340px] lg:h-[360px] p-5 rounded-2xl border transition-colors flex flex-col justify-center shrink-0 ${
                          theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#fcfbf9] border-[#dfdbd0]'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>July 2026</span>
                            {selectedEventDate && (
                              <button 
                                onClick={() => setSelectedEventDate(null)} 
                                className={`text-[10px] font-bold underline ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'}`}
                              >
                                View All Events
                              </button>
                            )}
                          </div>
                          
                          {/* Weekdays */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                              <span key={day} className="text-[10px] font-mono font-bold text-neutral-500 py-1">{day}</span>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {offsetDays.map((_, i) => (
                              <div key={`empty-${i}`} className="aspect-square" />
                            ))}
                            {calendarDays.map(dayNum => {
                              const hasEvent = ALL_EVENTS.some(ev => ev.dayNum === dayNum);
                              const isSelected = selectedEventDate === String(dayNum);
                              return (
                                <button
                                  key={dayNum}
                                  onClick={() => setSelectedEventDate(String(dayNum))}
                                  className={`aspect-square text-[11px] font-semibold rounded-lg flex flex-col items-center justify-center relative transition-all duration-150 outline-none ${
                                    isSelected
                                      ? theme === 'dark'
                                        ? 'bg-white text-black font-extrabold shadow'
                                        : 'bg-neutral-950 text-white font-extrabold shadow'
                                      : hasEvent
                                        ? theme === 'dark'
                                          ? 'border border-white/20 bg-white/[0.06] font-bold text-white hover:bg-white/[0.12]'
                                          : 'border border-neutral-300 bg-neutral-100 font-bold text-neutral-950 hover:bg-neutral-200'
                                        : theme === 'dark'
                                          ? 'text-neutral-400 hover:bg-white/[0.04]'
                                          : 'text-neutral-600 hover:bg-neutral-100'
                                  }`}
                                >
                                  <span>{dayNum}</span>
                                  {hasEvent && !isSelected && (
                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-neutral-950'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Event Details Preview on Selected Day */}
                        <div className="flex-1 flex flex-col gap-3 justify-start min-w-[240px] lg:h-[360px] lg:max-h-[360px] lg:overflow-y-auto pr-1">
                          <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            {selectedEventDate ? `Selected: July ${selectedEventDate}, 2026` : 'Select a calendar day with event dot'}
                          </span>
                          {filteredEvents.length > 0 ? (
                            filteredEvents.map(ev => {
                              const isRSVPed = eventRSVPs[ev.id];
                              return (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  key={ev.id} 
                                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-colors ${
                                    theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                                  }`}
                                >
                                  <div>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-neutral-950/10 text-neutral-950'}`}>{ev.time}</span>
                                    <h4 className={`text-xs sm:text-sm font-bold mt-2 leading-snug ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{ev.title}</h4>
                                    <p className={`text-[10px] leading-relaxed mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'}`}>{ev.desc}</p>
                                    <span className={`text-[10px] block mt-1.5 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Hosted by {ev.host}</span>
                                  </div>
                                  <button 
                                    onClick={() => toggleRSVP(ev.id)}
                                    className={`w-full py-2 rounded-lg text-[10px] sm:text-xs font-bold mt-3.5 transition-all duration-150 shrink-0 text-center ${
                                      isRSVPed 
                                        ? theme === 'dark' 
                                          ? 'bg-white text-neutral-950 hover:bg-neutral-200' 
                                          : 'bg-neutral-950 text-white hover:bg-neutral-900'
                                        : theme === 'dark'
                                          ? 'border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]'
                                          : 'border border-neutral-300 bg-neutral-200/50 text-neutral-700 hover:bg-white'
                                    }`}
                                  >
                                    {isRSVPed ? 'Going ✓' : 'RSVP for Event'}
                                  </button>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className={`p-5 rounded-2xl border text-center transition-colors flex flex-col items-center justify-center ${
                              theme === 'dark' ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-neutral-50 border-neutral-200'
                            }`}>
                              <Calendar className="w-5 h-5 text-neutral-500 mb-2" />
                              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>No structured masterclasses</span>
                              <p className={`text-[10px] mt-1 leading-normal max-w-[180px] ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Feel free to request a co-working focus block for this day!</p>
                              <button 
                                onClick={() => handleOpenJoinModal()}
                                className={`mt-3 px-3 py-1 rounded-lg text-[9px] font-bold transition-all border ${
                                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-950'
                                }`}
                              >
                                Book Co-working
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {ALL_EVENTS.map(ev => {
                          const isRSVPed = eventRSVPs[ev.id];
                          return (
                            <div key={ev.id} className={`backdrop-blur-sm rounded-2xl p-5 flex flex-col justify-between gap-4 border transition-all duration-300 ${
                              theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                            }`}>
                              <div>
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-650'}`}>{ev.date} • {ev.time}</span>
                                <h4 className={`text-sm sm:text-base font-bold mt-1.5 leading-snug ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{ev.title}</h4>
                                <span className={`text-xs block mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Hosted by {ev.host}</span>
                              </div>
                              <button 
                                onClick={() => toggleRSVP(ev.id)}
                                className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 shrink-0 text-center ${
                                  isRSVPed 
                                    ? theme === 'dark' 
                                      ? 'bg-white text-neutral-950 hover:bg-neutral-200 shadow-sm' 
                                      : 'bg-neutral-950 text-white hover:bg-neutral-900 shadow-sm'
                                    : theme === 'dark'
                                      ? 'border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]'
                                      : 'border border-neutral-300 bg-neutral-200/50 text-neutral-700 hover:bg-white'
                                }`}
                              >
                                {isRSVPed ? 'Going ✓' : 'RSVP'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              {/* 5. MEMBERS SCREEN */}
              {activeTab === 'Members' && (() => {
                const filteredMembers = LEADERBOARD_MEMBERS.filter(member => {
                  const matchesSearch = member.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                                        member.role.toLowerCase().includes(memberSearch.toLowerCase());
                  const matchesRole = memberRoleFilter === 'All' || member.role === memberRoleFilter;
                  return matchesSearch && matchesRole;
                });

                return (
                  <motion.div 
                    key="Members"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-4 text-left h-full"
                  >
                    <div className={`pb-2.5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                      <div>
                        <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Member Directory</h3>
                        <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Connect with practitioners, builders, and designers.</p>
                      </div>

                      {/* Pill filters */}
                      <div className="flex gap-1 overflow-x-auto no-scrollbar shrink-0 py-0.5">
                        {['All', 'Design', 'Writing', 'Product'].map(role => (
                          <button
                            key={role}
                            onClick={() => setMemberRoleFilter(role)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 outline-none ${
                              memberRoleFilter === role
                                ? theme === 'dark'
                                  ? 'bg-white text-black shadow'
                                  : 'bg-neutral-950 text-white shadow'
                                : theme === 'dark'
                                  ? 'bg-white/[0.02] text-neutral-400 hover:text-white border border-white/[0.06]'
                                  : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search bar inside dashboard */}
                    <div className="relative shrink-0 w-full">
                      <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Search workspace members..."
                        className={`w-full rounded-full pl-10 pr-5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 border ${
                          theme === 'dark' 
                            ? 'bg-white/[0.02] border-white/[0.06] text-white placeholder-neutral-600' 
                            : 'bg-neutral-100/50 border-neutral-200 text-neutral-950 placeholder-neutral-400'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[300px] pr-1">
                      {filteredMembers.map(member => (
                        <motion.div 
                          whileHover={{ scale: 1.02, translateY: -1 }}
                          onClick={() => setSelectedMember(member)}
                          key={member.name} 
                          className={`backdrop-blur-sm p-3.5 rounded-2xl flex items-center gap-3 border transition-all cursor-pointer relative ${
                            theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-[#f8f6f0]/85 border-[#dfdbd0] hover:bg-[#eae7de]/50'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className={`w-9 h-9 rounded-full object-cover border ${
                                theme === 'dark' ? 'border-white/[0.08]' : 'border-[#cbc6b8]'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border ${
                              theme === 'dark' ? 'border-[#070708]' : 'border-white'
                            }`} />
                          </div>
                          <div className="overflow-hidden min-w-0 flex-1">
                            <span className={`text-xs font-bold block truncate ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} title={member.name}>{member.name}</span>
                            <span className={`text-[10px] block uppercase font-bold tracking-wide truncate ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{member.role}</span>
                          </div>
                        </motion.div>
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="col-span-full py-8 text-center text-neutral-500 text-xs">
                          No members matching "{memberSearch}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}

              {/* 6. LEADERBOARD SCREEN */}
              {activeTab === 'Leaderboard' && (
                <motion.div 
                  key="Leaderboard"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-4 text-left"
                >
                  <div className={`pb-2 border-b ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                    <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Engagement Leaderboard</h3>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'}`}>Rankings updated dynamically based on active community participation.</p>
                  </div>

                  <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
                    {LEADERBOARD_MEMBERS.map(member => (
                      <div key={member.rank} className={`backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center justify-between border transition-colors ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <span className={`text-xs font-extrabold w-4 text-center shrink-0 ${
                            member.rank === 1 
                              ? theme === 'dark' ? 'text-white' : 'text-neutral-950' 
                              : member.rank === 2 
                                ? theme === 'dark' ? 'text-neutral-300' : 'text-neutral-500' 
                                : 'text-neutral-400'
                          }`}>{member.rank}</span>
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
                              theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <span className={`text-xs sm:text-sm font-bold truncate whitespace-nowrap min-w-0 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{member.name}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold shrink-0 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-650'}`}>{member.points} pts</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CTA SECTION: Copied and beautifully formatted from landing page */}
      <section className={`relative rounded-3xl overflow-hidden py-16 px-6 sm:px-12 md:px-16 mb-16 select-none border transition-all duration-300 ${
        theme === 'dark'
          ? 'border-white/[0.08]'
          : 'border-[#dfdbd0]'
      }`}>
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay scale-110 blur-[6px] animate-bg-drift-reverse" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=80')`,
              willChange: 'transform'
            }} 
          />
          
          <div className={`absolute inset-0 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-[radial-gradient(circle_at_50%_50%,transparent_10%,#070708_95%)]' 
              : 'bg-[radial-gradient(circle_at_50%_50%,transparent_10%,#fbfaf7_95%)]'
          }`} />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-4 md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Your community <br />
              is one sec away.
            </h2>
            <p className={`text-xs sm:text-sm mt-5 leading-relaxed max-w-sm mx-auto md:mx-0 text-center md:text-left font-medium transition-colors duration-300 min-h-[80px] ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
            }`}>
              <Typewriter 
                words={[`${brandName} is in beta and free to join. Set up your space, invite your first members, and see what it feels like when everything lives in one place — under your name.`]}
                typingSpeed={25}
                showCursor={false}
                oneWay={true}
                triggerInView={true}
              />
            </p>
            <button 
              onClick={() => handleOpenJoinModal()}
              className={`px-8 py-3.5 text-xs sm:text-sm rounded-full mt-6 ${getUnifiedButtonClass(theme, true)}`}
            >
              Start for free
            </button>
          </motion.div>

          {/* Right side mockup - Ava Torres Card preview */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 md:col-span-8 flex justify-center md:justify-end relative w-full"
          >
            <div className={`w-full lg:max-w-[700px] md:max-w-[550px] max-w-[480px] rounded-[24px] overflow-hidden flex h-[350px] relative z-10 transition-all duration-300 border ${
              theme === 'dark' 
                ? 'bg-[#0c0c0e]/95 border-white/[0.06] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] hover:border-white/[0.09]' 
                : 'bg-white/95 border-neutral-300 shadow-[0_20px_45px_rgba(140,137,125,0.08)] hover:border-neutral-350'
            }`}>
              {/* Sidebar list items */}
              <div className={`w-12 sm:w-[30%] border-r pt-5 pb-3 px-3 sm:p-5 flex flex-col gap-4 shrink-0 text-left transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#080809] border-white/[0.04]' : 'bg-[#f4f2eb] border-neutral-200'
              }`}>
                <div className="flex items-center justify-center sm:justify-between w-full">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <SelectedBrandIcon className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} strokeWidth={2.5} />
                    <span className={`font-sans font-bold text-[10px] sm:text-xs tracking-tight hidden sm:inline ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{brandName}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 mt-2">
                  {[
                    { label: 'Overview', icon: LayoutGrid },
                    { label: 'Chat', icon: MessageSquare },
                    { label: 'Courses', icon: BookOpen },
                    { label: 'Events', icon: Calendar },
                    { label: 'Members', icon: Users },
                    { label: 'Leaderboard', icon: Award }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={item.label} 
                        className={`flex items-center justify-center sm:justify-start gap-2.5 transition-colors cursor-pointer text-[10px] sm:text-[11px] font-semibold ${
                          theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-650 hover:text-neutral-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Panel info of the community */}
              <div className={`flex-1 p-5 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#121214]/90' : 'bg-white/40'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shrink-0 ${
                  theme === 'dark' ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                }`}>
                  S
                </div>

                <h3 className={`text-base sm:text-lg font-bold mt-3 tracking-tight transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>
                  Strong By Ava
                </h3>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex -space-x-1.5">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48&q=80" alt="Member" className={`w-4 h-4 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&h=48&q=80" alt="Member" className={`w-4 h-4 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=48&h=48&q=80" alt="Member" className={`w-4 h-4 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'}`}>847 members</span>
                </div>

                <button 
                  onClick={() => handleOpenJoinModal()}
                  className={`w-full max-w-[200px] py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-extrabold mt-4 transition-all hover:scale-105 active:scale-95 hover:shadow-xl shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-[#e2e2e4] hover:bg-white text-[#070708] hover:shadow-white/[0.05]' 
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white hover:shadow-neutral-950/15'
                  }`}
                >
                  Join now
                </button>

                <p className={`text-[10px] sm:text-xs leading-relaxed mt-4 text-left font-normal max-w-[280px] sm:max-w-[320px] line-clamp-3 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
                }`}>
                  Ava Torres is a certified strength coach. → 12-week progressive training programs with video lessons → Weekly live Q&As and form-checks → Supportive women-only strength training space.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1. COURSE COMPLETION CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Blurry Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCelebration(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
            />

            {/* Falling Leaf Confetti Elements */}
            <div className="absolute inset-0 z-[160] overflow-hidden pointer-events-none">
              {Array.from({ length: 45 }).map((_, i) => {
                const randomLeft = (i * 2.3) % 100; // evenly spread but random-ish
                const randomDelay = (i * 0.12) % 3.5;
                const randomScale = 0.6 + ((i * 0.17) % 0.8);
                const leafColor = i % 3 === 0 
                  ? 'bg-amber-400' 
                  : i % 3 === 1 
                    ? 'bg-emerald-500' 
                    : 'bg-blue-500';
                return (
                  <div 
                    key={i}
                    className={`absolute top-0 w-3 h-4 rounded-tl-full rounded-br-full ${leafColor} animate-confetti`}
                    style={{
                      left: `${randomLeft}%`,
                      animationDelay: `${randomDelay}s`,
                      transform: `scale(${randomScale})`,
                      animationDuration: `${3.5 + ((i * 0.25) % 2)}s`
                    }}
                  />
                );
              })}
            </div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full max-w-[460px] rounded-3xl p-6 sm:p-8 border shadow-2xl relative z-[170] text-center select-none ${
                theme === 'dark' 
                  ? 'bg-[#0f0f12] border-white/10 text-white shadow-black/80' 
                  : 'bg-white border-neutral-200 text-neutral-950 shadow-neutral-950/10'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-5 relative">
                <Award className="w-8 h-8 text-emerald-500 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-none">Course Completed! 🎉</h3>
              <p className={`text-xs mt-2 uppercase font-mono tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Sylvan Journey Accomplished</p>

              <p className={`text-xs sm:text-sm leading-relaxed mt-4 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                Outstanding progress! You have completed all 12 modules in the curriculum. You have officially unlocked the <strong className={`${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Sylvan Visionary</strong> badge & earned <strong className="text-emerald-500">+150 XP</strong>!
              </p>

              <div className={`my-5 p-3.5 rounded-2xl border flex items-center gap-3.5 text-left ${
                theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className={`text-[10px] block uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Unlocked Reward</span>
                  <span className={`text-xs font-bold block ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>"Sylvan Visionary" Exclusive Role Badge</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <button
                  onClick={() => {
                    // Reset completed lessons helper
                    setCompletedLessons({});
                    setShowCelebration(false);
                    setActiveTab('Courses');
                  }}
                  className={`flex-1 py-3 rounded-full text-xs font-bold transition-all border ${
                    theme === 'dark'
                      ? 'border-white/10 hover:bg-white/5 text-neutral-300'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Restart & Study Again
                </button>
                <button
                  onClick={() => setShowCelebration(false)}
                  className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-white hover:bg-neutral-200 text-neutral-950'
                      : 'bg-neutral-950 hover:bg-neutral-900 text-white'
                  }`}
                >
                  Return to Workspace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DETAILED MEMBER BIOGRAPHY & DM MODAL */}
      <AnimatePresence>
        {selectedMember && (() => {
          // Biographical descriptions mapper based on name
          const bioDatabase: { [key: string]: { bio: string; badge: string; level: string; joined: string } } = {
            'Alex Kim': {
              bio: 'Alex is a Senior Product Lead with over 8 years of experience. He enjoys refining visual rhythm, spacing formulas, and typography alignments, and is currently prototyping new creator monetization models.',
              badge: 'Product Champion',
              level: 'Level 5 Workspace Lead',
              joined: 'Jan 2026'
            },
            'Morgan Reed': {
              bio: 'Morgan is an Editorial Designer and Copywriter. She focuses on typographical contrast, semantic storytelling, and editorial hierarchies, helping authors design distraction-free reading environments.',
              badge: 'Writing Pioneer',
              level: 'Level 4 Active Member',
              joined: 'Feb 2026'
            },
            'Sam Jordan': {
              bio: 'Sam is a UX Architect obsessed with buttery fluid animations, spring layouts, high-performance canvas widgets, and offline-first responsive grid interfaces.',
              badge: 'Interaction Guru',
              level: 'Level 4 Active Member',
              joined: 'Mar 2026'
            },
            'Taylor Chen': {
              bio: 'Taylor is an Interface Stylist. He spends his free time optimizing vector graphics, creating customized CSS frameworks, and hanging out in the layout design channels.',
              badge: 'Styling Scholar',
              level: 'Level 3 Pro Contributor',
              joined: 'Apr 2026'
            }
          };

          const mDetails = bioDatabase[selectedMember.name] || {
            bio: 'Active practitioner in the Sylvan community. Committed to layout precision, visual system consistency, and collaborative co-working feedback.',
            badge: 'Sylvan Practitioner',
            level: 'Level 3 Active Member',
            joined: 'May 2026'
          };

          const handleSendDM = (e: React.FormEvent) => {
            e.preventDefault();
            if (!dmText.trim()) return;
            setDmSentSuccess(true);
            setDmText('');
            setTimeout(() => {
              setDmSentSuccess(false);
              setSelectedMember(null);
            }, 2500);
          };

          return (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              {/* Blurry Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!dmSentSuccess) {
                    setSelectedMember(null);
                    setDmSentSuccess(false);
                  }
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className={`w-full max-w-[460px] rounded-3xl p-6 sm:p-7 border shadow-2xl relative z-[170] text-left ${
                  theme === 'dark' 
                    ? 'bg-[#0f0f12] border-white/10 text-white shadow-black/80' 
                    : 'bg-white border-neutral-200 text-neutral-950 shadow-neutral-950/10'
                }`}
              >
                {dmSentSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold block">Message Transmitted!</span>
                    <p className={`text-xs mt-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Your direct message was delivered to {selectedMember.name}.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 pb-4 border-b border-white/[0.08] dark:border-neutral-100">
                      <img 
                        src={selectedMember.avatar} 
                        alt={selectedMember.name} 
                        className={`w-14 h-14 rounded-full object-cover border-2 shrink-0 ${
                          theme === 'dark' ? 'border-white/[0.12]' : 'border-neutral-300'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-base sm:text-lg font-black block truncate leading-tight">{selectedMember.name}</span>
                        <span className={`text-[11px] block uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{selectedMember.role}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className={`text-[10px] font-mono font-semibold ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>{mDetails.level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="mt-4 space-y-3.5">
                      <div>
                        <span className={`text-[10px] uppercase font-mono font-bold tracking-wider block ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Biography</span>
                        <p className={`text-xs leading-relaxed mt-1 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>{mDetails.bio}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-white/[0.01] border-white/[0.06]' : 'bg-neutral-50 border-neutral-200'}`}>
                          <span className={`text-[9px] uppercase font-mono font-bold tracking-wider block ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Active Badge</span>
                          <span className={`text-xs font-bold block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{mDetails.badge}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-white/[0.01] border-white/[0.06]' : 'bg-neutral-50 border-neutral-200'}`}>
                          <span className={`text-[9px] uppercase font-mono font-bold tracking-wider block ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Engagement</span>
                          <span className={`text-xs font-bold block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{selectedMember.points} XP pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick DM Form */}
                    <form onSubmit={handleSendDM} className="mt-5 pt-4 border-t border-white/[0.08] dark:border-neutral-100">
                      <label className={`text-[10px] uppercase font-mono font-bold tracking-wider block mb-2 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Send Direct Message
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={dmText}
                          onChange={(e) => setDmText(e.target.value)}
                          placeholder={`Message ${selectedMember.name.split(' ')[0]}...`}
                          className={`w-full rounded-full pl-4 pr-12 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 border ${
                            theme === 'dark' 
                              ? 'bg-white/[0.02] border-white/[0.06] text-white placeholder-neutral-600' 
                              : 'bg-neutral-100/50 border-neutral-200 text-neutral-950 placeholder-neutral-400'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!dmText.trim()}
                          className={`absolute right-1.5 p-2 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-40 ${
                            theme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-900'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => setSelectedMember(null)}
                        className={`w-full py-2.5 rounded-full text-xs font-bold transition-all text-center border ${
                          theme === 'dark'
                            ? 'border-white/10 hover:bg-white/5 text-neutral-300'
                            : 'border-neutral-300 hover:bg-neutral-100 text-neutral-750'
                        }`}
                      >
                        Close Profile
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
