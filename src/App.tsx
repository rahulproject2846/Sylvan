import React, { useState, useEffect, FormEvent, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Leaf, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  MessageSquare, 
  Calendar, 
  Award, 
  BookOpen, 
  Users, 
  X, 
  Send, 
  Play, 
  FileText, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Menu,
  ChevronLeft,
  Folder,
  Home,
  Search,
  Bell,
  UserPlus,
  ArrowUp,
  ArrowLeft,
  Sparkles,
  Clock,
  Sliders,
  LayoutGrid,
  Sun,
  Moon
} from 'lucide-react';
// @ts-ignore
import sylvanMidgroundHills from './assets/images/sylvan_midground_hills_1783188486035.jpg';
// @ts-ignore
import sylvanForegroundTrees from './assets/images/sylvan_foreground_trees_1783188468078.jpg';
import { 
  BLOG_POSTS, 
  FAQ_ITEMS, 
  PRICING_PLANS, 
  LEADERBOARD_MEMBERS, 
  COURSE_MODULES 
} from './data';
import { BlogPost, FAQItem, PricingPlan, LeaderboardMember, CourseModule } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import StyleGuidePage from './components/StyleGuidePage';
import PolicyPage from './components/PolicyPage';
import Typewriter from './components/Typewriter';
import MouseFollower from './components/MouseFollower';
import { smoothScrollTo, smoothScrollToTop } from './lib/scroll';

const blogContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    }
  }
};

const blogCardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    }
  }
};

const pricingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const pricingCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1] // Ease out cubic
    }
  }
};

const faqContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    }
  }
};

const faqCardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

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
      opacity: { duration: 0.15, ease: "easeIn" }
    }
  })
};

interface FloatingDecorationProps {
  icon: React.ComponentType<any>;
  className?: string;
  delay?: number;
  duration?: number;
  rotateDirection?: 1 | -1;
  theme: 'dark' | 'light';
  yRange?: number[];
  xRange?: number[];
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

function FloatingDecoration({
  icon: Icon,
  className = "",
  delay = 0,
  duration = 14,
  rotateDirection = 1,
  theme,
  yRange = [0, -18, 0],
  xRange = [0, 8, 0],
  glowColor,
  size = 'md'
}: FloatingDecorationProps) {
  const sizeClasses = {
    sm: 'p-2.5',
    md: 'p-3.5',
    lg: 'p-4.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const themeStyles = theme === 'dark' 
    ? 'bg-transparent border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] text-neutral-400 hover:text-white' 
    : 'bg-transparent border-[#dfdbd0] hover:bg-white hover:border-neutral-400 text-neutral-600 hover:text-[#2d2d2d]';

  return (
    <motion.div
      animate={{ 
        rotate: [rotateDirection * -10, rotateDirection * 10, rotateDirection * -10], 
        y: yRange,
        x: xRange
      }}
      whileHover={{ 
        scale: 1.15,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className={`absolute rounded-full border hidden lg:flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 z-10 ${sizeClasses[size]} ${themeStyles} ${className}`}
      style={{
        boxShadow: glowColor && theme === 'dark' 
          ? `0 0 30px 2px ${glowColor}` 
          : undefined
      }}
    >
      <Icon className={`${iconSizes[size]} transition-transform duration-300`} />
    </motion.div>
  );
}

const heroTabIndexMap: { [key: string]: number } = {
  'Overview': 0,
  'Chat': 1,
  'Courses': 2,
  'Events': 3,
  'Members': 4,
  'Leaderboard': 5
};

const coreTabIndexMap: { [key: string]: number } = {
  'Community': 0,
  'Courses': 1,
  'Events': 2,
  'Members': 3
};

const coreFeatureTabs = ['Community', 'Courses', 'Events', 'Members'];

const getUnifiedButtonClass = (theme: string, isPrimary: boolean = true) => {
  const base = "font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ease-out shadow-lg border";
  if (isPrimary) {
    return theme === 'dark'
      ? `${base} bg-white text-neutral-950 border-transparent hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] shadow-white/[0.02]`
      : `${base} bg-neutral-950 text-white border-transparent hover:bg-white hover:text-neutral-900 hover:border-[#dfdbd0] shadow-neutral-950/[0.05]`;
  } else {
    return theme === 'dark'
      ? `${base} bg-white/[0.04] text-white border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.08] shadow-sm`
      : `${base} bg-[#e9e6dc] text-neutral-900 border border-[#dfdbd0] hover:bg-white hover:border-[#dfdbd0] shadow-sm`;
  }
};

export default function App() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Core Features tabs: 'Community' | 'Courses' | 'Events' | 'Members'
  const [activeCoreTab, setActiveCoreTab] = useState('Community');
  const [prevCoreTab, setPrevCoreTab] = useState('Community');

  // FAQ Category: 'general' | 'features' | 'privacy'
  const [activeFaqCategory, setActiveFaqCategory] = useState<'general' | 'features' | 'privacy'>('general');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // HERO App Mockup Active Tab
  const [activeHeroTab, setActiveHeroTab] = useState<'Overview' | 'Chat' | 'Courses' | 'Events' | 'Members' | 'Leaderboard'>('Overview');
  const [prevHeroTab, setPrevHeroTab] = useState<'Overview' | 'Chat' | 'Courses' | 'Events' | 'Members' | 'Leaderboard'>('Overview');

  // Interactive HERO Chat State
  const [heroChatText, setHeroChatText] = useState('');
  const [heroMessages, setHeroMessages] = useState([
    { id: 1, sender: 'Taylor Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80', text: 'Hey designers! Working on the new landing page hierarchy. Should we use playfair display for headings?', time: '10:14 AM' },
    { id: 2, sender: 'Sam Jordan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', text: 'Definitely. It matches that high-end organic brand feel perfectly. Use Inter or Jakarta for the body though to keep it clean.', time: '10:15 AM' }
  ]);

  // Interactive HERO Course Modules state
  const [heroExpandedModule, setHeroExpandedModule] = useState<string | null>('m-1');

  // Interactive HERO Events RSVP state
  const [heroEventRSVPs, setHeroEventRSVPs] = useState<{ [key: string]: boolean }>({
    'ev-1': false,
    'ev-2': true
  });

  // State for interactive features bento cards
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [courseChapter, setCourseChapter] = useState<'ch-1' | 'ch-2'>('ch-1');

  // Interactive course lessons state (Core Features mockup)
  const [completedCoreLessons, setCompletedCoreLessons] = useState<number[]>([0]); // Starts with first lesson completed

  // Page routing state
  const [currentPage, setCurrentPage] = useState<'landing' | 'behance'>('landing');

  // Interactive HERO course lessons completed state
  const [completedHeroLessons, setCompletedHeroLessons] = useState<string[]>(['Welcome & Core Philosophies']);

  const toggleHeroLesson = useCallback((lesson: string) => {
    setCompletedHeroLessons(prev => 
      prev.includes(lesson) 
        ? prev.filter(l => l !== lesson) 
        : [...prev, lesson]
    );
  }, []);

  // Track active scroll section for header highlighting
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'cookie' | null>(null);

  // Theme state: dark (Dark Forest) or light (Light Parchment/Clay)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('sylvan-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // default to Dark Forest
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sylvan-theme', nextTheme);
      return nextTheme;
    });
  }, []);

  // Auto-play state for Core Features dashboard
  const [autoPlayDashboard, setAutoPlayDashboard] = useState(true);

  // Automated Community Feed inside Core Mockup
  const [coreChatMessages, setCoreChatMessages] = useState([
    { id: 1, sender: 'Nina Park', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', text: "Just wrapped up a full rebrand using only Framer variables — took 3x longer to set up, but the client handoff was the cleanest I've ever done.", time: '12m ago' }
  ]);
  const [isCoreTyping, setIsCoreTyping] = useState(false);

  // Automated Points tracking inside Members Mockup
  const [alexPoints, setAlexPoints] = useState(3842);
  const [morganPoints, setMorganPoints] = useState(3120);

  // Automated RSVP tracking inside Events Mockup
  const [coreEventsRSVP, setCoreEventsRSVP] = useState(false);

  // Slide directions calculators
  const currentHeroIdx = heroTabIndexMap[activeHeroTab] ?? 0;
  const prevHeroIdx = heroTabIndexMap[prevHeroTab] ?? 0;
  const heroSlideDirection = currentHeroIdx >= prevHeroIdx ? 1 : -1;

  const currentCoreIdx = coreTabIndexMap[activeCoreTab] ?? 0;
  const prevCoreIdx = coreTabIndexMap[prevCoreTab] ?? 0;
  const coreSlideDirection = currentCoreIdx >= prevCoreIdx ? 1 : -1;

  // Autoplay cycle effect
  useEffect(() => {
    if (!autoPlayDashboard) return;

    const interval = setInterval(() => {
      const tabsOrder = ['Community', 'Courses', 'Events', 'Members'];
      const currentIndex = coreTabIndexMap[activeCoreTab] ?? 0;
      const nextIndex = (currentIndex + 1) % tabsOrder.length;
      
      setPrevCoreTab(activeCoreTab);
      setActiveCoreTab(tabsOrder[nextIndex]);
    }, 5500); // cycle every 5.5s

    return () => clearInterval(interval);
  }, [activeCoreTab, autoPlayDashboard]);

  // Automated Community feed messages typewriter simulation
  useEffect(() => {
    if (activeCoreTab !== 'Community') {
      // Reset chat messages
      setCoreChatMessages([
        { id: 1, sender: 'Nina Park', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', text: "Just wrapped up a full rebrand using only Framer variables — took 3x longer to set up, but the client handoff was the cleanest I've ever done.", time: '12m ago' }
      ]);
      setIsCoreTyping(false);
      return;
    }

    const t1 = setTimeout(() => {
      setIsCoreTyping(true);
    }, 1200);

    const t2 = setTimeout(() => {
      setIsCoreTyping(false);
      setCoreChatMessages(prev => [
        ...prev,
        {
          id: 2,
          sender: 'Sam Jordan',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
          text: "Agreed! Client handoffs with variables are a game-changer. Standardizing tokens makes it so seamless.",
          time: 'Just now'
        }
      ]);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeCoreTab]);

  // Automated Courses Progression
  useEffect(() => {
    if (activeCoreTab !== 'Courses') return;

    // Start with lesson 0 completed
    setCompletedCoreLessons([0]);

    const t1 = setTimeout(() => {
      setCompletedCoreLessons(prev => [...prev, 1]);
    }, 1500);

    const t2 = setTimeout(() => {
      setCompletedCoreLessons(prev => [...prev, 2]);
    }, 3000);

    const t3 = setTimeout(() => {
      setCompletedCoreLessons(prev => [...prev, 3]);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeCoreTab]);

  // Automated Events RSVP toggle
  useEffect(() => {
    if (activeCoreTab !== 'Events') return;
    setCoreEventsRSVP(false);

    const t1 = setTimeout(() => {
      setCoreEventsRSVP(true);
    }, 2000);

    return () => clearTimeout(t1);
  }, [activeCoreTab]);

  // Automated Members Standings Points increment
  useEffect(() => {
    if (activeCoreTab !== 'Members') return;
    setAlexPoints(3842);
    setMorganPoints(3120);

    const interval = setInterval(() => {
      setAlexPoints(p => p + Math.floor(Math.random() * 12) + 4);
      setMorganPoints(p => p + Math.floor(Math.random() * 8) + 3);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeCoreTab]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          setShowBackToTop(window.scrollY > 400);
          const scrollPosition = window.scrollY + 100;
          const sections = ['home', 'features', 'pricing', 'faq', 'blog'];
          
          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }

          // Calculate scroll progress percentage
          const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (Esc key) to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBlog(null);
        setJoinModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHeroSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!heroChatText.trim()) return;
    
    const newMsg = {
      id: heroMessages.length + 1,
      sender: 'You (Creator)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80',
      text: heroChatText.trim(),
      time: 'Just now'
    };
    setHeroMessages([...heroMessages, newMsg]);
    setHeroChatText('');
  };

  const toggleHeroRSVP = (eventId: string) => {
    setHeroEventRSVPs(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleOpenJoinModal = (plan?: PricingPlan) => {
    if (plan) setSelectedPlan(plan);
    else setSelectedPlan(null);
    setJoinModalOpen(true);
    setRegistrationSuccess(false);
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userName) return;
    setRegistrationSuccess(true);
    setTimeout(() => {
      setJoinModalOpen(false);
      setUserEmail('');
      setUserName('');
      setRegistrationSuccess(false);
    }, 2500);
  };

  const goToNextCoreTab = () => {
    setAutoPlayDashboard(false);
    const index = coreFeatureTabs.indexOf(activeCoreTab);
    const nextIndex = (index + 1) % coreFeatureTabs.length;
    setPrevCoreTab(activeCoreTab);
    setActiveCoreTab(coreFeatureTabs[nextIndex]);
  };

  const goToPrevCoreTab = () => {
    setAutoPlayDashboard(false);
    const index = coreFeatureTabs.indexOf(activeCoreTab);
    const prevIndex = (index - 1 + coreFeatureTabs.length) % coreFeatureTabs.length;
    setPrevCoreTab(activeCoreTab);
    setActiveCoreTab(coreFeatureTabs[prevIndex]);
  };

  const filteredFaqs = FAQ_ITEMS.filter(item => item.category === activeFaqCategory);

  // Custom descriptions under core feature tab mockups
  const getTabLabelDescription = () => {
    switch (activeCoreTab) {
      case 'Community':
        return 'Post, discuss, react - the feed your members live in.';
      case 'Courses':
        return 'Structure lessons, embed videos, track completion progress.';
      case 'Events':
        return 'Host masterclasses, live review calls, and keep members sync’d.';
      case 'Members':
        return 'Gamify profiles, award badges, and track top active contributors.';
      default:
        return '';
    }
  };

  return (
    <>
      <MouseFollower theme={theme} />
      <div 
        id="home" 
        className={`min-h-screen font-sans antialiased overflow-x-hidden relative transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-[#070708] text-neutral-100 dot-grid' 
            : 'bg-[#fbfaf7] text-neutral-900 dot-grid-light'
        }`}
      >
      {/* Background Decorative Ambient Glows */}
      <motion.div 
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 0.9, 0.6] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full ambient-glow pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1.03, 0.97, 1.03], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-neutral-400/[0.03] rounded-full ambient-glow pointer-events-none" 
      />

      {/* STICKY HEADER COMPONENT */}
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isScrolled={isScrolled}
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleOpenJoinModal={handleOpenJoinModal}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === 'landing' ? (
        <>
          {/* HERO SECTION */}
          <div className={`relative w-full overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#070708]' : 'bg-[#fbfaf7]'}`}>
        {/* Abstract Layered Organic Wave System Background (matches the reference wave image) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-90">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="w-full h-full min-h-screen">
            <defs>
              <filter id="wave-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-4" dy="16" stdDeviation="16" floodColor={theme === 'dark' ? '#000000' : '#807d75'} floodOpacity={theme === 'dark' ? '0.95' : '0.15'} />
              </filter>
            </defs>
            {/* Charcoal/Parchment canvas */}
            <rect width="1440" height="900" fill={theme === 'dark' ? '#070708' : '#fbfaf7'} />
            
            {/* Wave Layer 1 */}
            <path 
              d="M 0,250 C 350,140 700,420 1000,220 C 1250,50 1370,120 1440,70 L 1440,900 L 0,900 Z" 
              fill={theme === 'dark' ? '#0b0b0d' : '#f4f2eb'} 
              filter="url(#wave-shadow)" 
            />
            {/* Wave Layer 2 */}
            <path 
              d="M 0,390 C 280,280 550,540 850,340 C 1120,140 1320,280 1440,190 L 1440,900 L 0,900 Z" 
              fill={theme === 'dark' ? '#111114' : '#eae7de'} 
              filter="url(#wave-shadow)" 
            />
            {/* Wave Layer 3 */}
            <path 
              d="M 0,520 C 240,440 480,630 780,470 C 1080,270 1280,430 1440,330 L 1440,900 L 0,900 Z" 
              fill={theme === 'dark' ? '#18181c' : '#dfdbd0'} 
              filter="url(#wave-shadow)" 
            />
            {/* Wave Layer 4 */}
            <path 
              d="M 0,650 C 200,610 420,720 720,590 C 1020,420 1220,580 1440,480 L 1440,900 L 0,900 Z" 
              fill={theme === 'dark' ? '#202025' : '#d2cdc1'} 
              filter="url(#wave-shadow)" 
            />
            {/* Wave Layer 5 */}
            <path 
              d="M 0,760 C 160,740 380,810 680,710 C 980,570 1180,700 1440,630 L 1440,900 L 0,900 Z" 
              fill={theme === 'dark' ? '#2b2b32' : '#c5c0b2'} 
              filter="url(#wave-shadow)" 
            />
          </svg>
          
          {/* Accent lighting overlapping background waves */}
          <motion.div 
            animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.7, 1.0, 0.7] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-[10%] left-[20%] w-[900px] h-[550px] rounded-full bg-[#f48c06]/[0.025] blur-[120px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1.03, 0.97, 1.03], opacity: [0.6, 1.0, 0.6] }}
            transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] w-[700px] h-[450px] rounded-full bg-blue-500/[0.015] blur-[145px] pointer-events-none" 
          />
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${theme === 'dark' ? 'to-[#070708]/80' : 'to-[#fbfaf7]/80'}`} />
        </div>

        <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
          {/* Floating animated decorations in Hero */}
          <FloatingDecoration 
            icon={Globe} 
            theme={theme} 
            className="top-[38%] right-[2%] xl:right-[-6%]" 
            duration={20} 
            delay={1} 
            rotateDirection={-1} 
            glowColor="rgba(168,85,247,0.15)"
            size="lg"
          />
          <FloatingDecoration 
            icon={Award} 
            theme={theme} 
            className="bottom-[15%] left-[6%] xl:left-[-2%]" 
            duration={14} 
            delay={1.5} 
            rotateDirection={1} 
            glowColor="rgba(245,158,11,0.12)"
            size="md"
          />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mt-4">
          {/* Badge Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold mb-6 shadow-sm transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' 
                : 'bg-white border-neutral-300 text-neutral-850'
            }`}
          >
            Community platform for creators
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl sm:text-6xl md:text-7.5xl font-bold tracking-tight mt-4 leading-tight drop-shadow-sm transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-950'
            }`}
          >
            <span className="relative block w-full">
              {/* Invisible layout spacer to reserve the maximum height of the typewriter words */}
              <span className="invisible pointer-events-none select-none block">
                Your movement deserves its own independent host.
              </span>
              <span className="absolute inset-x-0 top-0 block text-center">
                <Typewriter 
                  words={[
                    "Your community deserves its own home.",
                    "Your members deserve a distraction-free space.",
                    "Your curriculum deserves a beautiful brand.",
                    "Your movement deserves its own independent host.",
                    "Your audience deserves a place to truly connect."
                  ]}
                  typingSpeed={50}
                  deletingSpeed={25}
                  pauseDuration={3000}
                  cursorClassName="font-bold font-mono ml-0.5 text-current"
                />
              </span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-base sm:text-lg font-medium mt-6 max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
              theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
            }`}
          >
            Sylvan gives creators, educators, and coaches a fully branded space with courses, events, discussions, and members—all under your own command.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <button 
              onClick={() => handleOpenJoinModal()}
              className={`px-8 py-3.5 rounded-full text-sm ${getUnifiedButtonClass(theme, true)}`}
            >
              Get started free
            </button>
          </motion.div>
        </div>

        {/* INTERACTIVE WEB APP PREVIEW (MOCKUP) WITH 3D PERSPECTIVE */}
        <div className="w-full max-w-4xl mt-16 relative z-20 [perspective:2000px] select-none">
          {/* Floating Element Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.7 }}
            className={`absolute -left-12 top-1/4 z-30 hidden lg:flex items-center gap-3 backdrop-blur border px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/[0.04] border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                : 'bg-white/90 border-neutral-200 shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-xs font-bold block ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>847 Active</span>
              <span className={`text-[10px] block ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Members online</span>
            </div>
          </motion.div>

          {/* Floating Element Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.8 }}
            className={`absolute -right-12 bottom-1/4 z-30 hidden lg:flex items-center gap-3 backdrop-blur border px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/[0.04] border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                : 'bg-white/90 border-neutral-200 shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-xs font-bold block ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Live Class</span>
              <span className={`text-[10px] block ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>In progress</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40, rotateX: 12, rotateY: -8, rotateZ: 2 }}
            animate={{ opacity: 1, y: 0, rotateX: 8, rotateY: -4, rotateZ: 1 }}
            whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
            className={`w-full rounded-3xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'border-white/[0.08] bg-white/[0.015] backdrop-blur-xl shadow-[0_45px_100px_rgba(0,0,0,0.65)]'
                : 'border-neutral-200 bg-white/70 backdrop-blur-xl shadow-[0_45px_100px_rgba(0,0,0,0.06)]'
            } overflow-hidden`}
          >
          {/* Mock Browser Top Bar */}
          <div className={`h-12 border-b flex items-center justify-between px-4 transition-all duration-300 ${
            theme === 'dark' ? 'bg-neutral-900/60 border-neutral-900' : 'bg-neutral-100/90 border-neutral-200'
          }`}>
            {/* Window controls */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
            </div>
            {/* Mock URL Bar */}
            <div className={`h-7 w-1/2 rounded-full border flex items-center justify-center gap-1.5 text-xs select-none transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#070708] border-white/[0.08] text-neutral-400' : 'bg-white border-neutral-300 text-neutral-600 shadow-sm'
            }`}>
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span>community.sylvan.live</span>
            </div>
            {/* Action spacer */}
            <div className="flex items-center gap-1.5 w-12 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            </div>
          </div>

          {/* Interactive Interface Frame */}
          <div className={`flex h-[450px] md:h-[480px] backdrop-blur-xl text-left transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#070708]/30' : 'bg-white/30'
          }`}>
            {/* Sidebar Controls */}
            <div className={`w-12 sm:w-1/4 sm:min-w-[120px] sm:max-w-[180px] border-r p-1.5 sm:p-3 md:p-4 flex flex-col gap-1 select-none transition-colors duration-300 ${
              theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-neutral-50/70 border-neutral-200'
            }`}>
              <div className={`px-1 sm:px-2 pb-3 mb-2 border-b flex items-center justify-center sm:justify-start gap-1.5 ${
                theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
              }`}>
                <Leaf className={`w-4 h-4 transition-colors duration-300 shrink-0 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`} strokeWidth={2.5} />
                <span className={`font-sans font-bold text-sm tracking-tight transition-colors duration-300 hidden sm:inline ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Sylvan.</span>
              </div>

              {[
                { label: 'Overview', icon: Globe },
                { label: 'Chat', icon: MessageSquare, count: 2 },
                { label: 'Courses', icon: BookOpen },
                { label: 'Events', icon: Calendar },
                { label: 'Members', icon: Users },
                { label: 'Leaderboard', icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeHeroTab === tab.label;
                return (
                  <button 
                    key={tab.label}
                    onClick={() => {
                      setPrevHeroTab(activeHeroTab);
                      setActiveHeroTab(tab.label as any);
                    }}
                    className={`w-full flex items-center justify-center sm:justify-between px-1.5 py-2 sm:px-2.5 rounded-xl text-left text-xs font-medium transition-all duration-150 ${
                      isSelected 
                        ? theme === 'dark'
                          ? 'bg-white/[0.08] text-white border border-white/[0.08]' 
                          : 'bg-neutral-200/80 text-neutral-950 font-bold border border-neutral-300/60 shadow-sm'
                        : theme === 'dark'
                          ? 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200'
                          : 'text-neutral-500 hover:bg-neutral-200/40 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
                      <span className="truncate hidden sm:inline">{tab.label}</span>
                    </div>
                    {tab.count && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 hidden sm:flex">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
 
            {/* Main Interactive App Content Panel */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-transparent flex flex-col">
              <AnimatePresence mode="wait">
                {/* 1. OVERVIEW SCREEN */}
                {activeHeroTab === 'Overview' && (
                  <motion.div 
                    key="Overview"
                    custom={heroSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-4"
                  >
                    {/* Welcome Card with Gradient */}
                    <motion.div 
                      whileHover={{ scale: 1.02, translateY: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`relative overflow-hidden rounded-2xl p-5 flex items-center justify-between shadow-sm cursor-pointer border backdrop-blur-sm ${
                        theme === 'dark'
                          ? 'bg-gradient-to-tr from-blue-600/15 via-purple-500/10 to-white/[0.01] border-white/[0.08]'
                          : 'bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-neutral-100/10 border-neutral-300'
                      }`}
                    >
                      <div className="z-10 max-w-[70%]">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Featured Community</span>
                        <h3 className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Strong By Ava</h3>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Weekly live coaching sessions, curriculum lesson progression, and peer critiques.</p>
                      </div>
                      <div className="relative shrink-0 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-neutral-950 text-xl shadow">A</div>
                        <span className={`text-[10px] ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>847 members</span>
                      </div>
                    </motion.div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`backdrop-blur-sm p-3 rounded-2xl border ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] text-neutral-500 block font-medium uppercase">Active Members</span>
                        <span className={`text-base font-semibold mt-0.5 block ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1,280</span>
                      </div>
                      <div className={`backdrop-blur-sm p-3 rounded-2xl border ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] text-neutral-500 block font-medium uppercase">Course Takers</span>
                        <span className={`text-base font-semibold mt-0.5 block ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>324</span>
                      </div>
                      <div className={`backdrop-blur-sm p-3 rounded-2xl border ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}>
                        <span className="text-[10px] text-neutral-500 block font-medium uppercase">Discussions</span>
                        <span className={`text-base font-semibold mt-0.5 block ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>12 Active</span>
                      </div>
                    </div>

                    {/* Quick Link Card */}
                    <motion.div 
                      whileHover={{ scale: 1.015, translateY: -1, boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.25)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`backdrop-blur-sm rounded-2xl p-4 mt-1 flex items-center justify-between cursor-pointer border ${
                        theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Ava" 
                          className={`w-9 h-9 rounded-full object-cover border ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Join Ava's circle discussions</span>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Participate in design critiques and sprints</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleOpenJoinModal()}
                        className={`px-4 py-2 font-medium rounded-full text-xs transition-colors shadow-sm shrink-0 ${
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
                {activeHeroTab === 'Chat' && (
                  <motion.div 
                    key="Chat"
                    custom={heroSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col h-full justify-between"
                  >
                    {/* Header */}
                    <div className={`pb-2 flex items-center justify-between shrink-0 border-b ${
                      theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                    }`}>
                      <div>
                        <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>#design-lounge</h3>
                        <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Casual design conversations and feedback loops.</p>
                      </div>
                      <span className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        8 online
                      </span>
                    </div>

                    {/* Messages Board */}
                    <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-3 pr-1 select-text scrollbar-thin">
                      {heroMessages.map(msg => (
                        <div key={msg.id} className="flex gap-2.5 items-start">
                          <img 
                            src={msg.avatar} 
                            alt={msg.sender} 
                            className={`w-7 h-7 rounded-full object-cover shrink-0 border ${
                              theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <div className="max-w-[85%]">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{msg.sender}</span>
                              <span className={`text-[9px] ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{msg.time}</span>
                            </div>
                            <p className={`text-xs mt-1 backdrop-blur-sm px-3 py-2 rounded-2xl rounded-tl-none inline-block leading-relaxed border ${
                              theme === 'dark' 
                                ? 'text-neutral-200 bg-white/[0.03] border-white/[0.06]' 
                                : 'text-neutral-800 bg-neutral-100/80 border-neutral-200/80'
                            }`}>
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input Bar */}
                    <form onSubmit={handleHeroSendMessage} className={`flex gap-2 pt-2 shrink-0 border-t ${
                      theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                    }`}>
                      <input 
                        type="text"
                        value={heroChatText}
                        onChange={(e) => setHeroChatText(e.target.value)}
                        placeholder="Send a message..."
                        className={`flex-1 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 border ${
                          theme === 'dark' 
                            ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-neutral-500' 
                            : 'bg-neutral-100 border-neutral-200 text-neutral-950 placeholder-neutral-400'
                        }`}
                      />
                      <button 
                        type="submit"
                        className="p-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. COURSES SCREEN */}
                {activeHeroTab === 'Courses' && (() => {
                  const totalLessons = COURSE_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
                  const completedLessonsCount = completedHeroLessons.length;
                  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
                  
                  return (
                    <motion.div 
                      key="Courses"
                      custom={heroSlideDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col gap-3"
                    >
                      <div className={`pb-3 flex flex-col gap-2.5 border-b ${
                        theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <h3 className={`text-xs font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Course Syllabus</h3>
                            <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Interactive chapters and progression records.</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className={`text-[11px] font-mono font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{progressPercent}%</span>
                            <span className={`text-[9px] font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'}`}>{completedLessonsCount}/{totalLessons} lessons</span>
                          </div>
                        </div>
                        
                        {/* Elegant Progress bar container */}
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/[0.06]' : 'bg-neutral-200'}`}>
                          <motion.div 
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                        {COURSE_MODULES.map(module => {
                          const isExpanded = heroExpandedModule === module.id;
                          return (
                            <div key={module.id} className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-colors ${
                              theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                            }`}>
                              <button 
                                onClick={() => setHeroExpandedModule(isExpanded ? null : module.id)}
                                className={`w-full px-4 py-3 flex items-center justify-between text-left text-xs font-medium transition-colors ${
                                  theme === 'dark' ? 'hover:bg-white/[0.05]' : 'hover:bg-neutral-200/50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-blue-400" />
                                  <span className={`font-semibold text-[11px] ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{module.title}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                  <span className="text-[9px] font-mono">{module.lessons.length} lessons</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180 text-blue-400' : ''}`} />
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
                                    <div className="px-4 py-2.5 flex flex-col gap-2 text-left">
                                      {module.lessons.map((lesson, idx) => {
                                        const isCompleted = completedHeroLessons.includes(lesson);
                                        return (
                                          <div 
                                            key={idx} 
                                            onClick={() => toggleHeroLesson(lesson)}
                                            className={`flex items-center gap-2.5 py-1.5 text-[11px] cursor-pointer transition-colors group select-none ${
                                              theme === 'dark' ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-neutral-950'
                                            }`}
                                          >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                              isCompleted
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : theme === 'dark'
                                                  ? 'border-white/[0.12] bg-white/[0.02] text-transparent group-hover:border-white/[0.25]'
                                                  : 'border-neutral-300 bg-neutral-50 text-transparent group-hover:border-neutral-400'
                                            }`}>
                                              <Check className="w-3 h-3 stroke-[3.5px]" />
                                            </div>
                                            <span className={`transition-all duration-300 ${isCompleted ? 'line-through text-neutral-500 font-medium' : ''}`}>
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
                })()}

                {/* 4. EVENTS SCREEN */}
                {activeHeroTab === 'Events' && (
                  <motion.div 
                    key="Events"
                    custom={heroSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-3"
                  >
                    <div className={`pb-2 border-b ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                      <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Events Calendar</h3>
                      <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>RSVP for community masterclasses and sync calls.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'ev-1', title: 'Product Layout Review Loop', host: 'Ava Torres', date: 'Jul 8, 2026', time: '10:00 AM' },
                        { id: 'ev-2', title: 'Typography Masterclass', host: 'Marcus Aurel', date: 'Jul 15, 2026', time: '2:30 PM' }
                      ].map(ev => {
                        const isRSVPed = heroEventRSVPs[ev.id];
                        return (
                          <div key={ev.id} className={`backdrop-blur-sm rounded-2xl p-3.5 flex items-center justify-between gap-3 border transition-colors ${
                            theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                          }`}>
                            <div>
                              <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{ev.date} • {ev.time}</span>
                              <h4 className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{ev.title}</h4>
                              <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Hosted by {ev.host}</span>
                            </div>
                            <button 
                              onClick={() => toggleHeroRSVP(ev.id)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 ${
                                isRSVPed 
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25' 
                                  : theme === 'dark'
                                    ? 'bg-white text-neutral-950 hover:bg-neutral-100 shadow-sm'
                                    : 'bg-neutral-950 text-white hover:bg-neutral-900 shadow-sm'
                              }`}
                            >
                              {isRSVPed ? 'Going ✓' : 'RSVP'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 5. MEMBERS SCREEN */}
                {activeHeroTab === 'Members' && (
                  <motion.div 
                    key="Members"
                    custom={heroSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-3"
                  >
                    <div className={`pb-2 border-b ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                      <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Member Directory</h3>
                      <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Connect with design practitioners and strategists.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {LEADERBOARD_MEMBERS.map(member => (
                        <div key={member.name} className={`backdrop-blur-sm p-3 rounded-2xl flex items-center gap-2.5 border transition-colors ${
                          theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                        }`}>
                          <div className="relative">
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className={`w-8 h-8 rounded-full object-cover border ${
                                theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border ${
                              theme === 'dark' ? 'border-[#070708]' : 'border-white'
                            }`} />
                          </div>
                          <div className="overflow-hidden">
                            <span className={`text-xs font-medium block truncate ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{member.name}</span>
                            <span className={`text-[9px] block uppercase font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 6. LEADERBOARD SCREEN */}
                {activeHeroTab === 'Leaderboard' && (
                  <motion.div 
                    key="Leaderboard"
                    custom={heroSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-2"
                  >
                    <div className={`pb-2 border-b ${theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'}`}>
                      <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Engagement Leaderboard</h3>
                      <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Rankings updated dynamically based on active community participation.</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {LEADERBOARD_MEMBERS.map(member => (
                        <div key={member.rank} className={`backdrop-blur-sm px-3.5 py-2.5 rounded-2xl flex items-center justify-between border transition-colors ${
                          theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100/70 border-neutral-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-bold w-4 text-center ${
                              member.rank === 1 
                                ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600' 
                                : member.rank === 2 
                                  ? theme === 'dark' ? 'text-neutral-300' : 'text-neutral-500' 
                                  : 'text-neutral-400'
                            }`}>{member.rank}</span>
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className={`w-7 h-7 rounded-full object-cover border ${
                                theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{member.name}</span>
                          </div>
                          <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{member.points} pts</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

  </div>

      {/* INTRO BRAND VOICE SECTION */}
      <section className={`transition-all duration-300 py-24 px-6 relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-white/[0.01]' 
          : 'bg-[#eae7de]/15'
      }`}>



        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300'
              : 'bg-neutral-200/60 border-neutral-300 text-neutral-850'
          }`}>
            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
            About Sylvan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 tracking-tight leading-snug">
            <span className={`block mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Sylvan is a community platform built for creators, educators, and coaches.</span>
            <span className="relative block w-full mt-4">
              {/* Invisible layout spacer to reserve the maximum height of the typewriter words across all viewport widths */}
              <span className="invisible pointer-events-none select-none block">
                Share beautiful galleries, track member progress, and launch live cohorts on your timeline.
              </span>
              <span className={`absolute inset-x-0 top-0 block text-center font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <Typewriter 
                  words={[
                    "Create custom courses, host live webinars, and manage your members under your own domain.",
                    "Host engaging discussions, organize calendar events, and build deep roots for your brand.",
                    "Unite premium education, interactive spaces, and member databases inside a single space.",
                    "Own your content, charge for memberships, and grow your audience with zero middleman fees.",
                    "Share beautiful galleries, track member progress, and launch live cohorts on your timeline."
                  ]} 
                  typingSpeed={40}
                  deletingSpeed={20}
                  pauseDuration={2500}
                  cursorClassName="font-bold font-mono ml-0.5 text-current"
                />
              </span>
            </span>
          </h2>
          <p className={`mt-8 text-base leading-relaxed max-w-xl mx-auto font-normal transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-700'}`}>
            Every space runs under your own custom domain. Members sign up and interact inside your beautifully branded home—they never see a Sylvan logo, establishing a high quality and high ticket experience.
          </p>
        </motion.div>
      </section>

      {/* CORE FEATURES TABS SECTION */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 relative">


        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center md:text-left md:flex md:items-end md:justify-between mb-16 flex flex-col items-center md:flex-row"
        >
          <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300'
                : 'bg-neutral-200/60 border-neutral-300 text-neutral-800'
            }`}>
              <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              Core Features
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold mt-5 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
              One platform to run
            </h2>
            <h2 className={`text-4xl sm:text-5xl font-bold mt-2 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
              your entire community.
            </h2>
          </div>
          <p className={`text-sm mt-6 md:mt-2 max-w-xs text-center md:text-right leading-relaxed font-medium transition-colors duration-300 min-h-[140px] sm:min-h-[100px] md:min-h-[80px] overflow-hidden mx-auto md:mx-0 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            <Typewriter 
              words={["Sylvan brings your courses, events, discussions, and members into one space, so you stop switching between tools and start spending time with your community."]} 
              typingSpeed={25}
              showCursor={false}
              oneWay={true}
              triggerInView={true}
            />
          </p>
        </motion.div>

        {/* Tab Selection Row */}
        <div className="flex flex-row flex-nowrap justify-start md:justify-center items-center gap-3 sm:gap-6 md:gap-10 my-10 py-2.5 overflow-x-auto whitespace-nowrap select-none no-scrollbar px-6 md:px-0 w-full">
          {coreFeatureTabs.map(tab => {
            const isSelected = activeCoreTab === tab;
            return (
              <button 
                key={tab}
                onClick={() => {
                  setPrevCoreTab(activeCoreTab);
                  setActiveCoreTab(tab);
                  setAutoPlayDashboard(false);
                }}
                className={`px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 border hover:scale-[1.04] hover:shadow-lg hover:shadow-neutral-500/5 ${
                  isSelected 
                    ? theme === 'dark'
                      ? 'bg-white text-neutral-950 border-white shadow-md font-bold' 
                      : 'bg-neutral-950 text-white border-neutral-950 shadow-md font-bold'
                    : theme === 'dark'
                      ? 'text-neutral-400 hover:text-white border-white/[0.08] bg-white/[0.04]'
                      : 'text-neutral-600 hover:text-neutral-950 border-neutral-200 bg-neutral-100'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Feature Layout Showcase Panel */}
        <div className={`w-full relative overflow-hidden rounded-3xl border p-6 sm:p-12 md:p-14 flex items-center justify-center shadow-2xl transition-all duration-300 ${
          theme === 'dark' ? 'border-white/[0.08] bg-[#070708]' : 'border-neutral-200 bg-white'
        }`}>
          {/* The decorative organic premium wave background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-[0.25] md:opacity-[0.35]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="waveGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.12" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="35" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <g filter="url(#softGlow)">
                {/* Layer 1 Waves */}
                <path 
                  d="M0,150 Q180,260 360,180 T720,240 T1080,190 T1440,220 L1440,800 L0,800 Z" 
                  fill={theme === 'dark' ? 'url(#waveGradDark)' : 'url(#waveGradLight)'} 
                />
                {/* Layer 2 Waves */}
                <path 
                  d="M0,320 Q240,420 480,330 T960,390 T1440,310 L1440,800 L0,800 Z" 
                  fill={theme === 'dark' ? 'rgba(99,102,241,0.04)' : 'rgba(165,180,252,0.02)'} 
                  stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}
                  strokeWidth="1.5"
                />
                {/* Layer 3 Waves */}
                <path 
                  d="M0,450 Q300,320 600,410 T1200,350 T1440,400 L1440,800 L0,800 Z" 
                  fill={theme === 'dark' ? 'rgba(192,132,252,0.03)' : 'rgba(233,213,255,0.01)'} 
                  stroke={theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'}
                  strokeWidth="1.2"
                />
              </g>
            </svg>
            {/* Soft Ambient Blur Spots */}
            <div className={`absolute top-[10%] left-[15%] w-[350px] h-[350px] rounded-full blur-[110px] pointer-events-none transition-colors duration-300 ${
              theme === 'dark' ? 'bg-white/8' : 'bg-neutral-950/5'
            }`} />
            <div className={`absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300 ${
              theme === 'dark' ? 'bg-indigo-500/6' : 'bg-purple-300/4'
            }`} />
            <div className={`absolute inset-0 bg-gradient-to-b ${
              theme === 'dark' 
                ? 'from-[#070708]/40 via-transparent to-[#070708]/90' 
                : 'from-[#fbfaf7]/20 via-transparent to-[#fbfaf7]/85'
            }`} />
          </div>

          {/* Browser Mockup Panel */}
          <div className={`relative z-10 w-full max-w-4xl rounded-2xl border backdrop-blur-md shadow-3xl overflow-hidden flex flex-row h-[460px] transition-all duration-300 ${
            theme === 'dark' 
              ? 'border-white/[0.08] bg-white/[0.02]' 
              : 'border-neutral-300 bg-white/75 shadow-[0_20px_40px_rgba(140,137,125,0.08)]'
          }`}>
            {/* Left Sidebar */}
            <div className={`w-12 md:w-56 shrink-0 border-r p-1.5 md:p-4 flex flex-col gap-3 md:gap-5 text-left h-full select-none overflow-y-auto no-scrollbar transition-all duration-300 ${
              theme === 'dark' ? 'bg-white/[0.01] border-white/[0.08]' : 'bg-[#f4f2eb]/60 border-neutral-300'
            }`}>
              {/* Header Info */}
              <div className="flex items-center justify-center md:justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/15 text-white' : 'bg-neutral-950/15 text-neutral-950'
                  }`}>
                    <Leaf className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <span className={`text-xs font-bold tracking-tight transition-colors duration-300 hidden md:inline ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Sylvan</span>
                </div>
                <Search className={`w-3.5 h-3.5 transition-colors duration-300 hidden md:inline ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`} />
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col gap-1">
                {[
                  { id: 'Community', label: 'Chat', icon: MessageSquare },
                  { id: 'Courses', label: 'Courses', icon: BookOpen },
                  { id: 'Events', label: 'Events', icon: Calendar },
                  { id: 'Members', label: 'Members', icon: Users },
                  { id: 'Leaderboard', label: 'Leaderboard', icon: Award }
                ].map((item) => {
                  const Icon = item.icon;
                  const isItemActive = activeCoreTab === item.id || (item.id === 'Community' && activeCoreTab === 'Community');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id !== 'Leaderboard') {
                          setPrevCoreTab(activeCoreTab);
                          setActiveCoreTab(item.id);
                          setAutoPlayDashboard(false);
                        }
                      }}
                      className={`flex items-center justify-center md:justify-start gap-2.5 p-2 md:px-3 md:py-2 rounded-lg text-xs font-semibold transition-all text-left border hover:scale-[1.04] active:scale-[0.96] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] duration-200 ${
                        isItemActive
                          ? theme === 'dark'
                            ? 'bg-white/[0.06] border-white/[0.08] text-white'
                            : 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : theme === 'dark'
                            ? 'text-neutral-400 hover:text-white hover:bg-white/[0.03] border-transparent'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/40 border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lower Section: Courses */}
              <div className="mt-2 hidden md:block">
                <div className={`flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  <span>Courses</span>
                  <span className={`text-sm font-normal cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'hover:text-white text-neutral-500' : 'hover:text-neutral-950 text-neutral-500'}`}>+</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  {[
                    'User Research Methods',
                    'Product Thinking',
                    'Design Systems',
                    'Framer Course',
                    'Start here'
                  ].map((course, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                          : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-white/40'}`}>
              <AnimatePresence mode="wait">
                {activeCoreTab === 'Community' && (
                  <motion.div 
                    key="mock-comm"
                    custom={coreSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col h-full justify-between"
                  >
                    {/* Header bar */}
                    <div className={`h-14 border-b px-5 flex items-center justify-between shrink-0 select-none transition-colors duration-300 ${theme === 'dark' ? 'border-white/[0.08]' : 'border-[#dfdbd0]'}`}>
                      <span className={`text-xs font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}># general-chat</span>
                      <div className="flex items-center gap-3">
                        <Bell className={`w-3.5 h-3.5 cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-neutral-950'}`} />
                        <button className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold transition-all hover:scale-105 active:scale-95 duration-200 ${
                          theme === 'dark'
                            ? 'bg-white hover:bg-neutral-100 text-neutral-950 shadow-[0_4px_12px_rgba(255,255,255,0.15)]'
                            : 'bg-neutral-950 hover:bg-neutral-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                        }`}>
                          <UserPlus className="w-3 h-3" /> Invite
                        </button>
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                          className="w-6 h-6 rounded-full object-cover border border-white/[0.08]" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Feed Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                      <AnimatePresence initial={false}>
                        {coreChatMessages.map((msg) => (
                          <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-3 text-left"
                          >
                            <img 
                              src={msg.avatar} 
                              className="w-7 h-7 rounded-full object-cover border border-white/[0.08] shrink-0" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-baseline gap-1.5">
                                <span className={`text-xs font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{msg.sender}</span>
                                <span className="text-[9px] text-neutral-400">{msg.time}</span>
                              </div>
                              <p className={`text-[11.5px] mt-1 leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                {msg.text}
                              </p>
                              
                              {/* Show nested reply card for first message */}
                              {msg.id === 1 && (
                                <div className={`mt-3 border backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1.5 transition-all duration-300 ${
                                  theme === 'dark' 
                                    ? 'bg-white/[0.03] border-white/[0.06]' 
                                    : 'bg-neutral-50 border-neutral-200 shadow-sm'
                                }`}>
                                  <div className="flex items-center gap-1.5">
                                    <img 
                                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" 
                                      className="w-5 h-5 rounded-full object-cover shrink-0" 
                                      referrerPolicy="no-referrer" 
                                    />
                                    <span className={`text-[11px] font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>James Ko</span>
                                  </div>
                                  <p className={`text-[10px] italic border-l-2 pl-2 leading-tight transition-all duration-300 ${theme === 'dark' ? 'text-neutral-500 border-white/[0.08]' : 'text-neutral-500 border-neutral-300'}`}>
                                    Just wrapped a full rebrand using only Framer...
                                  </p>
                                  <p className={`text-[11px] leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Been avoiding variables because the docs are all over the place. Is the setup time actually worth it for smaller projects?
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* Animated Typing Indicator */}
                        {isCoreTyping && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-3 text-left items-center"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" 
                              className="w-7 h-7 rounded-full object-cover border border-white/[0.08] shrink-0" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="flex gap-1 py-1.5 px-3 bg-neutral-300/30 dark:bg-white/[0.04] border border-neutral-300/20 dark:border-white/[0.06] rounded-full">
                              <span className="w-1.5 h-1.5 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tags row */}
                    <div className={`px-5 py-2.5 border-t flex items-center gap-2 backdrop-blur-sm shrink-0 select-none transition-all duration-300 ${
                      theme === 'dark' ? 'border-white/[0.08] bg-white/[0.01]' : 'border-[#dfdbd0] bg-[#f4f2eb]/40'
                    }`}>
                      <span className={`px-2.5 py-1 rounded-full border text-[9px] font-semibold transition-colors duration-300 ${
                        theme === 'dark'
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-neutral-950/10 text-neutral-950 border-neutral-950/20'
                      }`}>Discussion</span>
                      <span className={`px-2.5 py-1 rounded-full border text-[9px] font-medium transition-colors duration-300 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.03] text-neutral-400 border-white/[0.06] hover:text-white'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:text-neutral-950 shadow-sm'
                      }`}>Questions</span>
                      <span className={`px-2.5 py-1 rounded-full border text-[9px] font-medium transition-colors duration-300 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.03] text-neutral-400 border-white/[0.06] hover:text-white'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:text-neutral-950 shadow-sm'
                      }`}>Resources</span>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-colors duration-300 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.03] text-neutral-400 border-white/[0.06] hover:text-white'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:text-neutral-950 shadow-sm'
                      }`}>+</span>
                    </div>

                    {/* Footer Input Area */}
                    <div className={`p-4 border-t flex items-center justify-between backdrop-blur-sm gap-3 shrink-0 select-none transition-all duration-300 ${
                      theme === 'dark' ? 'border-white/[0.08] bg-white/[0.01]' : 'border-[#dfdbd0] bg-[#f4f2eb]/40'
                    }`}>
                      <span className="text-xs text-neutral-500 pl-2">What's on your mind?</span>
                      <div className="flex items-center gap-2.5">
                        <span className={`cursor-pointer text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-950'}`}>▩</span>
                        <span className={`cursor-pointer text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-950'}`}>☰</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow transition-all active:scale-95 ${
                          theme === 'dark'
                            ? 'bg-white hover:bg-neutral-100 text-neutral-950'
                            : 'bg-neutral-950 text-white hover:bg-neutral-900'
                        }`}>
                          <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCoreTab === 'Courses' && (() => {
                  const progressPercent = Math.round((completedCoreLessons.length / 4) * 100);
                  return (
                    <motion.div 
                      key="mock-cour"
                      custom={coreSlideDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col h-full"
                    >
                      {/* Header bar */}
                      <div className={`h-14 border-b px-5 flex items-center justify-between shrink-0 select-none transition-colors duration-300 ${theme === 'dark' ? 'border-white/[0.08]' : 'border-[#dfdbd0]'}`}>
                        <span className={`text-xs font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Courses / UI Spacing Masterclass</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10.5px] font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {progressPercent}% Complete
                          </span>
                          <div className={`w-16 sm:w-20 h-1.5 rounded-full overflow-hidden shrink-0 ${theme === 'dark' ? 'bg-white/[0.06]' : 'bg-neutral-300'}`}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ type: "spring", stiffness: 80, damping: 12 }}
                              className="h-full bg-emerald-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lessons list */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
                        {[
                          { id: 0, title: '01. Visual Density & Margin Scale', duration: '12m' },
                          { id: 1, title: '02. Modern Typography Hierarchies', duration: '18m' },
                          { id: 2, title: '03. Relative Sizing with EM/REM', duration: '15m' },
                          { id: 3, title: '04. Case Study: Dashboard Spacing Rules', duration: '24m' }
                        ].map((lesson, idx) => {
                          const isCompleted = completedCoreLessons.includes(lesson.id);
                          const isActive = !isCompleted && (idx === 0 || completedCoreLessons.includes(lesson.id - 1));
                          const isLocked = !isCompleted && !isActive;

                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (completedCoreLessons.includes(lesson.id)) {
                                  setCompletedCoreLessons(completedCoreLessons.filter(i => i !== lesson.id));
                                } else {
                                  setCompletedCoreLessons([...completedCoreLessons, lesson.id].sort());
                                }
                              }}
                              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] select-none ${
                                isActive 
                                  ? theme === 'dark'
                                    ? 'bg-white/5 border-white/20 backdrop-blur-sm' 
                                    : 'bg-neutral-950/5 border-neutral-950/20'
                                  : isCompleted
                                    ? theme === 'dark'
                                      ? 'bg-emerald-500/5 border-emerald-500/10'
                                      : 'bg-emerald-500/5 border-emerald-500/25'
                                    : theme === 'dark'
                                      ? 'bg-white/[0.01] border-white/[0.08]'
                                      : 'bg-neutral-50/60 border-neutral-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                                    <Check className="w-3 h-3" />
                                  </div>
                                ) : isActive ? (
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${
                                    theme === 'dark'
                                      ? 'bg-white/10 border border-white/35 text-white'
                                      : 'bg-neutral-950/10 border border-neutral-950/35 text-neutral-950'
                                  }`}>
                                    <Play className={`w-2.5 h-2.5 ml-0.5 animate-pulse ${
                                      theme === 'dark' ? 'fill-white' : 'fill-neutral-950'
                                    }`} />
                                  </div>
                                ) : (
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                                    theme === 'dark' ? 'bg-white/[0.02] border-white/[0.08] text-neutral-600' : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                                  }`}>
                                    <Lock className="w-2.5 h-2.5" />
                                  </div>
                                )}
                                <span className={`text-[11.5px] font-medium text-left transition-colors ${
                                  isLocked 
                                    ? 'text-neutral-500' 
                                    : theme === 'dark' ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-800 group-hover:text-neutral-950'
                                }`}>{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-500 font-mono">{lesson.duration}</span>
                                {isCompleted && (
                                  <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded tracking-wide">Completed</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })()}

                {activeCoreTab === 'Events' && (
                  <motion.div 
                    key="mock-even"
                    custom={coreSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col h-full"
                  >
                    {/* Header bar */}
                    <div className={`h-14 border-b px-5 flex items-center justify-between shrink-0 select-none transition-colors duration-300 ${theme === 'dark' ? 'border-white/[0.08]' : 'border-[#dfdbd0]'}`}>
                      <span className={`text-xs font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Events / Community Calendar</span>
                    </div>

                    {/* Events list */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
                      {[
                        { date: 'Wed, Jul 15', title: 'Portfolio Feedback & Critique Sync', rsvps: coreEventsRSVP ? 13 : 12, host: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80', active: coreEventsRSVP },
                        { date: 'Thu, Jul 23', title: 'Framer Advanced Interactions Live Class', rsvps: 34, host: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', active: false }
                      ].map((ev, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all duration-300 ${
                          theme === 'dark' 
                            ? 'bg-white/[0.03] border-white/[0.08] backdrop-blur-sm' 
                            : 'bg-white/85 border-neutral-300 shadow-sm'
                        }`}>
                          <div className="flex flex-col gap-1 max-w-[280px]">
                            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors duration-300 ${
                              theme === 'dark' ? 'text-white/80' : 'text-neutral-950/80'
                            }`}>{ev.date}</span>
                            <span className={`text-[11.5px] font-semibold leading-snug transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>{ev.title}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <img src={ev.host} className="w-4 h-4 rounded-full object-cover border border-white/5" referrerPolicy="no-referrer" />
                              <span className={`text-[10px] transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'}`}>Hosted by Creator • {ev.rsvps} attending</span>
                            </div>
                          </div>
                          <button className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all hover:scale-[1.06] active:scale-[0.94] hover:shadow-md duration-200 ${
                            ev.active 
                              ? theme === 'dark' 
                                ? 'bg-white text-neutral-950 hover:bg-neutral-200 shadow-sm' 
                                : 'bg-neutral-950 text-white hover:bg-neutral-900 shadow-sm'
                              : theme === 'dark'
                                ? 'border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]'
                                : 'border border-[#dfdbd0] bg-[#e9e6dc] text-neutral-700 hover:bg-white'
                          }`}>
                            {ev.active ? 'Going ✓' : 'RSVP'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeCoreTab === 'Members' && (
                  <motion.div 
                    key="mock-memb"
                    custom={coreSlideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col h-full"
                  >
                    {/* Header bar */}
                    <div className={`h-14 border-b px-5 flex items-center justify-between shrink-0 select-none transition-colors duration-300 ${theme === 'dark' ? 'border-white/[0.08]' : 'border-[#dfdbd0]'}`}>
                      <span className={`text-xs font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Weekly Engagement Standings</span>
                      <span className="text-[10px] text-neutral-500">Resets Mondays</span>
                    </div>

                    {/* Members rank list */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-2 no-scrollbar">
                      {[
                        { rank: '#1', name: 'Alex Kim', pts: `${alexPoints.toLocaleString()} pts`, tag: 'Contributor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80' },
                        { rank: '#2', name: 'Morgan R.', pts: `${morganPoints.toLocaleString()} pts`, tag: 'Creator', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80' },
                        { rank: '#3', name: 'James Ko', pts: '2,450 pts', tag: 'Scholar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80' },
                        { rank: '#4', name: 'Sara Osei', pts: '1,980 pts', tag: 'Advisor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80' }
                      ].map((member, idx) => (
                        <div key={idx} className={`flex items-center justify-between border p-3 rounded-xl transition-all duration-300 ${
                          theme === 'dark' 
                            ? 'bg-white/[0.03] border-white/[0.08] backdrop-blur-sm' 
                            : 'bg-white/85 border-neutral-300 shadow-sm'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[10px] font-bold ${idx === 0 ? 'text-yellow-500' : 'text-neutral-500'}`}>{member.rank}</span>
                            <img src={member.avatar} className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.08]" referrerPolicy="no-referrer" />
                            <div className="text-left">
                              <span className={`text-xs font-bold block transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{member.name}</span>
                              <span className={`text-[9px] font-bold uppercase transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>{member.tag}</span>
                            </div>
                          </div>
                          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                            theme === 'dark'
                              ? 'text-white bg-white/5 border-white/10'
                              : 'text-neutral-950 bg-neutral-950/5 border-neutral-950/10 font-semibold'
                          }`}>{member.pts}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation / Caption Row */}
        <div className="flex items-center justify-between mt-10 max-w-4xl mx-auto select-none">
          <button 
            onClick={goToPrevCoreTab} 
            className={`w-11 h-11 border rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
              theme === 'dark' 
                ? 'border-white/[0.08] bg-white/[0.04] backdrop-blur-md text-white hover:border-white/[0.15] hover:bg-white/[0.08] hover:scale-[1.05] active:scale-[0.93]' 
                : 'border-[#dfdbd0] bg-[#e9e6dc] shadow-sm text-neutral-800 hover:border-[#dfdbd0] hover:bg-white hover:scale-[1.05] active:scale-[0.93]'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <AnimatePresence mode="wait">
            <motion.p 
              key={activeCoreTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className={`text-sm sm:text-base font-semibold text-center px-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
              }`}
            >
              {getTabLabelDescription()}
            </motion.p>
          </AnimatePresence>

          <button 
            onClick={goToNextCoreTab} 
            className={`w-11 h-11 border rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
              theme === 'dark' 
                ? 'border-white/[0.08] bg-white/[0.04] backdrop-blur-md text-white hover:border-white/[0.15] hover:bg-white/[0.08] hover:scale-[1.05] active:scale-[0.93]' 
                : 'border-[#dfdbd0] bg-[#e9e6dc] shadow-sm text-neutral-800 hover:border-[#dfdbd0] hover:bg-white hover:scale-[1.05] active:scale-[0.93]'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* DETAILED FEATURES CARD GRID */}
      <section className="py-24 px-6 relative overflow-hidden transition-all duration-300 bg-transparent">


        <div className="max-w-7xl mx-auto">
          {/* Header layout from reference image: Badge left-top, Title left, Subtitle right */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid md:grid-cols-12 gap-6 md:gap-12 items-end mb-16"
          >
            <div className="md:col-span-7 text-center md:text-left flex flex-col items-center md:items-start">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all duration-300 ${
                theme === 'dark' ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-700'
              }`}>
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                What you get
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold mt-5 tracking-tight leading-none transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Set up once.
              </h2>
              <h2 className={`text-4xl md:text-5xl font-bold mt-2 tracking-tight leading-none transition-colors duration-300 ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Run it the way you want.
              </h2>
            </div>
            <div className="md:col-span-5 text-center md:text-left md:pb-2">
              <p className={`text-sm sm:text-base leading-relaxed font-normal transition-colors duration-300 min-h-[60px] ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <Typewriter 
                  words={["Sylvan is built so you spend time with your community, not configuring it. From your first setting to your hundredth member, the platform stays out of your way."]}
                  typingSpeed={25}
                  showCursor={false}
                  oneWay={true}
                  triggerInView={true}
                />
              </p>
            </div>
          </motion.div>

          {/* Bento Cards Layout with spacing */}
          <div className="mt-16 flex flex-col gap-10 sm:gap-14 lg:gap-16 relative w-full">
            
            {/* CARD 1: YOUR FRONT DOOR */}
            <div className="w-full">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                className={`w-full relative overflow-hidden rounded-3xl border flex flex-col md:flex-row h-auto md:h-[540px] transition-all duration-300 origin-top ${
                  theme === 'dark' 
                    ? 'border-white/[0.08] bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
                    : 'border-[#dfdbd0] bg-[#fdfdfc] shadow-[0_15px_35px_rgba(140,137,125,0.06)]'
                }`}
              >
                {/* Left side info pane */}
                <div className={`md:w-5/12 p-8 md:p-14 flex flex-col justify-between text-left h-full border-b md:border-b-0 md:border-r transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'border-white/[0.08] bg-[#0c0c0e]' 
                    : 'border-[#dfdbd0] bg-[#fbfaf7]'
                }`}>
                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white/[0.04] border-white/[0.08] text-neutral-400' 
                        : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                      Your front door
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-bold mt-8 leading-tight tracking-tight transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}>
                      A community overview page that sells itself.
                    </h3>
                    <p className={`text-xs sm:text-sm mt-5 leading-relaxed font-normal transition-colors duration-300 ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Customize your hero with a static color or animated gradient. Add a headline, a description and member avatars. Your overview page is the first thing a visitor sees — make it yours.
                    </p>
                  </div>

                  {/* Bottom tag */}
                  <div className={`mt-8 md:mt-0 flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <svg className="w-5 h-5 text-current opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                    </svg>
                    <span>First impressions that convert.</span>
                  </div>
                </div>

                {/* Right side interactive visualization with sand background */}
                <div className={`md:w-7/12 relative overflow-hidden flex flex-col h-full min-h-[440px] md:min-h-0 justify-center transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#18181b]' : 'bg-neutral-100'
                }`}>
                  {/* Sandy-dunes sunset background */}
                  <img 
                    src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&h=800&q=80" 
                    alt="Sunset Sands" 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                      theme === 'dark' ? 'brightness-[0.55] contrast-[1.05]' : 'brightness-[0.85] contrast-[1.0]'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  {/* Inside header tools */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <button className="w-8 h-8 rounded-lg bg-black/45 border border-white/[0.06] backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-white transition-colors">
                        {/* Settings sliders icon */}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-black/45 border border-white/[0.06] backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-white transition-colors">
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-black/45 border border-white/[0.06] backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-white transition-colors">
                        <span className="text-[10px] font-bold font-serif">A</span>
                      </button>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-white/[0.06] backdrop-blur-md transition-colors">
                      Update
                    </button>
                  </div>

                  {/* Central Floating Glass Profile Card */}
                  <div className={`relative z-10 w-[90%] max-w-[340px] backdrop-blur-lg border p-6 rounded-2xl flex flex-col items-center shadow-2xl text-center select-none mx-auto my-14 md:my-0 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-black/45 border-white/[0.08]'
                      : 'bg-white/80 border-white/40 shadow-[0_15px_30px_rgba(0,0,0,0.15)]'
                  }`}>
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        theme === 'dark' ? 'border-white/[0.12] text-white' : 'border-neutral-300 text-neutral-950'
                      }`}>
                        <Leaf className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <h4 className={`text-base font-bold mt-3 transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Sylvan</h4>
                    
                    <div className={`flex items-center gap-1.5 mt-0.5 cursor-pointer transition-colors ${
                      theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                    }`}>
                      <span className="text-xs">sylvan.live</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </div>

                    {/* Avatar Stack & member count */}
                    <div className={`flex items-center gap-2 mt-3 px-3 py-1 rounded-full border transition-all duration-300 ${
                      theme === 'dark' ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-neutral-100 border-neutral-300'
                    }`}>
                      <div className="flex -space-x-1.5">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80" className="w-4.5 h-4.5 rounded-full object-cover border border-black" referrerPolicy="no-referrer" />
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80" className="w-4.5 h-4.5 rounded-full object-cover border border-black" referrerPolicy="no-referrer" />
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80" className="w-4.5 h-4.5 rounded-full object-cover border border-black" referrerPolicy="no-referrer" />
                      </div>
                      <span className={`text-[11px] font-semibold transition-colors ${theme === 'dark' ? 'text-neutral-350' : 'text-neutral-700'}`}>305 members</span>
                    </div>

                    {/* Large white join button */}
                    <button 
                      onClick={() => handleOpenJoinModal()} 
                      className={`w-full py-3 rounded-xl text-xs mt-4 ${getUnifiedButtonClass(theme, true)}`}
                    >
                      Join now
                    </button>

                    {/* Sub-text course bullet points */}
                    <div className={`w-full mt-4 text-left border-t pt-3 flex flex-col gap-1.5 transition-colors ${
                      theme === 'dark' ? 'border-white/[0.08]' : 'border-neutral-200'
                    }`}>
                      <div className={`text-[11px] leading-normal flex items-start gap-1.5 transition-colors ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        <span className={`mt-0.5 font-bold transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>•</span>
                        <span>A full course library on Framer, design systems, and career growth</span>
                      </div>
                      <div className={`text-[11px] leading-normal flex items-start gap-1.5 transition-colors ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        <span className={`mt-0.5 font-bold transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>•</span>
                        <span>Weekly design critiques and live feedback sessions</span>
                      </div>
                      <div className={`text-[11px] leading-normal flex items-start gap-1.5 transition-colors ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        <span className={`mt-0.5 font-bold transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>•</span>
                        <span>A private job board for design roles, shared by members</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CARD 2: FRIENDLY COMPETITION (Inverted columns!) */}
            <div className="w-full">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                className={`w-full relative overflow-hidden rounded-3xl border flex flex-col-reverse md:flex-row h-auto md:h-[540px] transition-all duration-300 origin-top ${
                  theme === 'dark' 
                    ? 'border-white/[0.12] bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
                    : 'border-[#dfdbd0] bg-[#fdfdfc] shadow-[0_15px_35px_rgba(140,137,125,0.06)]'
                }`}
              >
                
                {/* Left side interactive leaderboard visual */}
                <div className={`md:w-7/12 relative overflow-hidden flex flex-col h-full min-h-[440px] md:min-h-0 justify-center md:border-r transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#121214] border-white/[0.08]' : 'bg-neutral-100 border-[#dfdbd0]'
                }`}>
                  {/* Dusk desert sand dunes sunset background */}
                  <img 
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&h=800&q=80" 
                    alt="Twilight Sands" 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                      theme === 'dark' ? 'brightness-[0.45] contrast-[1.08]' : 'brightness-[0.80] contrast-[1.0]'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />

                  {/* Leaderboard glass container */}
                  <div className={`relative z-10 w-[92%] max-w-[420px] backdrop-blur-xl border p-5 rounded-2xl flex flex-col shadow-2xl select-none mx-auto my-8 md:my-0 transition-all duration-300 ${
                    theme === 'dark' ? 'bg-black/45 border-white/[0.08]' : 'bg-white/80 border-white/50 shadow-[0_15px_30px_rgba(0,0,0,0.1)]'
                  }`}>
                    
                    {/* User profile row */}
                    <div className={`flex items-center justify-between mb-4 pb-3 border-b transition-colors ${
                      theme === 'dark' ? 'border-white/[0.06]' : 'border-neutral-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" 
                            alt="Sam Jordan" 
                            className={`w-10 h-10 rounded-full object-cover transition-colors ${
                              theme === 'dark' ? 'border border-white/[0.12]' : 'border border-neutral-300'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-orange-500/50" />
                        </div>
                        <div className="text-left">
                          <h5 className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Sam Jordan</h5>
                          <p className={`text-[10px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Rank #3 · 2,905 points</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
                        theme === 'dark' ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-700'
                      }`}>
                        <svg className="w-3.5 h-3.5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-bold">Level 7</span>
                      </div>
                    </div>

                    {/* Filter Timeframe pills */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <button 
                        onClick={() => setLeaderboardTimeframe('7d')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          leaderboardTimeframe === '7d' 
                            ? theme === 'dark'
                              ? 'bg-white/[0.08] border border-white/[0.15] text-white shadow-sm' 
                              : 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
                            : theme === 'dark'
                              ? 'bg-transparent border border-transparent text-neutral-400 hover:text-white'
                              : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        7 days
                      </button>
                      <button 
                        onClick={() => setLeaderboardTimeframe('30d')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          leaderboardTimeframe === '30d' 
                            ? theme === 'dark'
                              ? 'bg-white/[0.08] border border-white/[0.15] text-white shadow-sm' 
                              : 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
                            : theme === 'dark'
                              ? 'bg-transparent border border-transparent text-neutral-400 hover:text-white'
                              : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        30 days
                      </button>
                      <button 
                        onClick={() => setLeaderboardTimeframe('all')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          leaderboardTimeframe === 'all' 
                            ? theme === 'dark'
                              ? 'bg-white/[0.08] border border-white/[0.15] text-white shadow-sm' 
                              : 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
                            : theme === 'dark'
                              ? 'bg-transparent border border-transparent text-neutral-400 hover:text-white'
                              : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        All time
                      </button>
                    </div>

                    {/* Table column headers */}
                    <div className={`grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-2 text-left px-1 transition-colors ${
                      theme === 'dark' ? 'text-neutral-400 border-white/[0.04]' : 'text-neutral-500 border-neutral-200'
                    }`}>
                      <div className="col-span-2">Rank</div>
                      <div className="col-span-6">Member</div>
                      <div className="col-span-4 text-right">Points</div>
                    </div>

                    {/* List items based on timeframe state */}
                    <div className="flex flex-col gap-1 text-left">
                      {leaderboardTimeframe === '7d' && (
                        <>
                          {/* Rank 1 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-500">🏆</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>1</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Alex Kim</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Product · 42 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>3,842 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 420 pts</p>
                            </div>
                          </div>

                          {/* Rank 2 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-neutral-400">🥈</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>2</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Morgan Reed</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Community · 18 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>3,100 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 210 pts</p>
                            </div>
                          </div>

                          {/* Rank 3 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg border transition-all duration-300 ${
                            theme === 'dark' 
                              ? 'bg-white/[0.03] border-white/[0.06]' 
                              : 'bg-neutral-100/80 border-neutral-300 shadow-sm'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-700">🥉</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>3</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Sam Jordan</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>Engineering · 12 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>2,905 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 64 pts</p>
                            </div>
                          </div>

                          {/* Rank 4 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className={`text-xs font-bold pl-1 transition-colors ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>4</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Taylor Chen</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Design · 9 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>1,200 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 88 pts</p>
                            </div>
                          </div>
                        </>
                      )}

                      {leaderboardTimeframe === '30d' && (
                        <>
                          {/* Rank 1 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-500">🏆</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>1</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Morgan Reed</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Community · 78 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>12,450 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 1,450 pts</p>
                            </div>
                          </div>

                          {/* Rank 2 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-neutral-400">🥈</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>2</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Alex Kim</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Product · 112 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>11,820 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 1,120 pts</p>
                            </div>
                          </div>

                          {/* Rank 3 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg border transition-all duration-300 ${
                            theme === 'dark' 
                              ? 'bg-white/[0.03] border-white/[0.06]' 
                              : 'bg-neutral-100/80 border-neutral-300 shadow-sm'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-700">🥉</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>3</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Sam Jordan</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-350' : 'text-neutral-600'}`}>Engineering · 54 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>9,840 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 650 pts</p>
                            </div>
                          </div>

                          {/* Rank 4 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className={`text-xs font-bold pl-1 transition-colors ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>4</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Taylor Chen</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Design · 32 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>4,500 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 340 pts</p>
                            </div>
                          </div>
                        </>
                      )}

                      {leaderboardTimeframe === 'all' && (
                        <>
                          {/* Rank 1 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg border transition-all duration-300 ${
                            theme === 'dark' 
                              ? 'bg-white/[0.03] border-white/[0.06]' 
                              : 'bg-neutral-100/80 border-neutral-300 shadow-sm'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-500">🏆</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Sam Jordan</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>Engineering · 320 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>85,200 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 4,200 pts</p>
                            </div>
                          </div>

                          {/* Rank 2 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-neutral-400">🥈</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>2</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Alex Kim</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Product · 480 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>82,400 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 3,900 pts</p>
                            </div>
                          </div>

                          {/* Rank 3 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="text-[11px] text-amber-700">🥉</span>
                              <span className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>3</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>Morgan Reed</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Community · 310 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>79,150 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 2,800 pts</p>
                            </div>
                          </div>

                          {/* Rank 4 */}
                          <div className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-neutral-100/50'
                          }`}>
                            <div className="col-span-2 flex items-center gap-1">
                              <span className={`text-xs font-bold pl-1 transition-colors ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>4</span>
                            </div>
                            <div className="col-span-6 flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-white/[0.06]" referrerPolicy="no-referrer" />
                              <div>
                                <p className={`text-xs font-bold leading-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-955'}`}>Taylor Chen</p>
                                <p className={`text-[9px] font-medium transition-colors ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>Design · 140 posts</p>
                              </div>
                            </div>
                            <div className="col-span-4 text-right">
                              <p className={`text-xs font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>32,000 pts</p>
                              <p className="text-[9px] text-emerald-500 font-medium">+ 1,100 pts</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side info pane */}
                <div className={`md:w-5/12 p-8 md:p-14 flex flex-col justify-between text-left h-full border-b md:border-b-0 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-[#0c0c0e] border-white/[0.08]' 
                    : 'bg-[#fbfaf7] border-[#dfdbd0]'
                }`}>
                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white/[0.04] border-white/[0.08] text-neutral-400' 
                        : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                      Friendly competition
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-bold mt-8 leading-tight tracking-tight transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}>
                      A leaderboard your members actually check.
                    </h3>
                    <p className={`text-xs sm:text-sm mt-5 leading-relaxed font-normal transition-colors duration-300 ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Rankings based on posts, completions, and activity — surfaced automatically. Gives your most engaged members a reason to stay and your quieter ones a reason to show up.
                    </p>
                  </div>

                  {/* Bottom tag with target crosshair SVG icon */}
                  <div className={`mt-8 md:mt-0 flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <svg className="w-5 h-5 text-current opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                    </svg>
                    <span>Engagement that compounds over time.</span>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* CARD 3: COURSES EDITOR */}
            <div className="w-full">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                className={`w-full relative overflow-hidden rounded-3xl border flex flex-col md:flex-row h-auto md:h-[540px] transition-all duration-300 origin-top ${
                  theme === 'dark' 
                    ? 'border-white/[0.12] bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
                    : 'border-[#dfdbd0] bg-[#fdfdfc] shadow-[0_15px_35px_rgba(140,137,125,0.06)]'
                }`}
              >
                
                {/* Left side info pane */}
                <div className={`md:w-5/12 p-8 md:p-14 flex flex-col justify-between text-left h-full border-b md:border-b-0 md:border-r transition-all duration-300 ${
                  theme === 'dark' ? 'bg-[#0c0c0e] border-white/[0.08]' : 'bg-[#fbfaf7] border-[#dfdbd0]'
                }`}>
                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white/[0.04] border-white/[0.08] text-neutral-400' 
                        : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                      Courses
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-bold mt-8 leading-tight tracking-tight transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}>
                      Build your course the way you teach.
                    </h3>
                    <p className={`text-xs sm:text-sm mt-5 leading-relaxed font-normal transition-colors duration-300 ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Structure your content into chapters and lessons, in any order you want. Add your material, hit publish, and your members can start learning — right inside the community they already live in.
                    </p>
                  </div>

                  {/* Bottom tag with target crosshair SVG icon */}
                  <div className={`mt-8 md:mt-0 flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <svg className="w-5 h-5 text-current opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                    </svg>
                    <span>Courses that feel like yours, not a template.</span>
                  </div>
                </div>

                {/* Right side interactive visualization with misty woods background */}
                <div className={`md:w-7/12 relative overflow-hidden flex flex-col h-full min-h-[440px] md:min-h-0 justify-center transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#141416]' : 'bg-neutral-100'
                }`}>
                  {/* Twilight forest background */}
                  <img 
                    src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&h=800&q=80" 
                    alt="Twilight Woods" 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                      theme === 'dark' ? 'brightness-[0.45] contrast-[1.08]' : 'brightness-[0.80] contrast-[1.0]'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />

                  {/* Glass mockup course creator container */}
                  <div className={`relative z-10 w-[94%] max-w-[460px] backdrop-blur-xl border rounded-2xl flex flex-col shadow-2xl overflow-hidden select-none mx-auto my-8 md:my-0 transition-all duration-300 ${
                    theme === 'dark' ? 'bg-black/45 border-white/[0.08]' : 'bg-white/80 border-white/50 shadow-[0_15px_30px_rgba(0,0,0,0.1)]'
                  }`}>
                    
                    {/* Header bar of window */}
                    <div className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
                      theme === 'dark' ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-neutral-200/50 border-neutral-300'
                    }`}>
                      <div className="flex items-center gap-1.5 text-left">
                        {/* Settings slider controls button */}
                        <button className={`w-7 h-7 rounded flex items-center justify-center border transition-colors ${
                          theme === 'dark' 
                            ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white' 
                            : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600 hover:text-neutral-900 shadow-sm'
                        }`}>
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className={`h-4 w-px mx-0.5 ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-neutral-350'}`} />
                        
                        {/* Interactive Chapter tabs */}
                        <button 
                          onClick={() => setCourseChapter('ch-1')}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                            courseChapter === 'ch-1' 
                              ? theme === 'dark'
                                ? 'bg-white/[0.06] border border-white/[0.12] text-white' 
                                : 'bg-[#e9e6dc] border border-[#dfdbd0] text-neutral-900 shadow-sm'
                              : theme === 'dark'
                                ? 'text-neutral-400 hover:text-white'
                                : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          Chapter 1
                        </button>
                        <button 
                          onClick={() => setCourseChapter('ch-2')}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                            courseChapter === 'ch-2' 
                              ? theme === 'dark'
                                ? 'bg-white/[0.06] border border-white/[0.12] text-white' 
                                : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-900 shadow-sm'
                              : theme === 'dark'
                                ? 'text-neutral-400 hover:text-white'
                                : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          Chapter 2
                        </button>
                        
                        <button className={`w-6 h-6 rounded flex items-center justify-center transition-all text-xs font-bold border ${
                          theme === 'dark'
                            ? 'bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white'
                            : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-500 hover:text-neutral-900 shadow-sm'
                        }`}>
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status dropdown and publish */}
                        <div className={`px-2 py-1 rounded border flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors ${
                          theme === 'dark' 
                            ? 'bg-white/[0.02] border-white/[0.08] text-emerald-400' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}>
                          <span>Live</span>
                          <ChevronDown className="w-3 h-3 opacity-70" />
                        </div>
                        <button className={`px-3 py-1 rounded font-bold text-[10px] transition-colors shadow-md ${
                          theme === 'dark'
                            ? 'bg-white hover:bg-neutral-100 text-neutral-950'
                            : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        }`}>
                          Publish
                        </button>
                      </div>
                    </div>

                    {/* Floating document sheet */}
                    <div className="p-5 flex flex-col gap-4 text-left relative">
                      
                      {/* Floating Rich-Text Formatting Toolbar overlay */}
                      <div className={`absolute top-2 left-1/2 -translate-x-1/2 border backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2.5 shadow-xl transition-colors duration-300 ${
                        theme === 'dark' 
                          ? 'bg-neutral-900/90 border-white/[0.12] text-neutral-300' 
                          : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-800'
                      }`}>
                        <div className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${theme === 'dark' ? 'bg-white/40' : 'bg-neutral-600'}`} />
                        <span className="text-xs font-semibold hover:opacity-80 cursor-pointer px-1">B</span>
                        <span className="text-xs font-semibold italic hover:opacity-80 cursor-pointer px-1">I</span>
                        <span className="text-xs font-semibold underline hover:opacity-80 cursor-pointer px-1">U</span>
                        <svg className="w-3.5 h-3.5 opacity-75 hover:opacity-100 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div className={`h-3 w-px ${theme === 'dark' ? 'bg-white/[0.12]' : 'bg-neutral-400/50'}`} />
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                          theme === 'dark' ? 'text-neutral-300 bg-white/[0.06]' : 'text-neutral-800 bg-[#dfdbd0]'
                        }`}>
                          H1 <ChevronDown className="w-2.5 h-2.5 opacity-65" />
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                          theme === 'dark' ? 'text-neutral-400 bg-white/[0.04]' : 'text-neutral-700 bg-white/70 border border-neutral-300'
                        }`}>
                          Inter <ChevronDown className="w-2.5 h-2.5 opacity-65" />
                        </span>
                      </div>

                      {/* Content switching based on active chapter state */}
                      {courseChapter === 'ch-1' ? (
                        <div className="mt-8 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>The Product Mindset</h4>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                              theme === 'dark' ? 'bg-white/[0.04] border-white/[0.06] text-neutral-400' : 'bg-neutral-200 border-neutral-300 text-neutral-600'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>2 min</span>
                            </div>
                          </div>
                          
                          <div className={`text-[11px] leading-relaxed font-normal transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            What you'll need is to leave with a <span className={`px-1.5 py-0.5 rounded-full border font-semibold ${
                              theme === 'dark' ? 'border-white/[0.18] bg-white/[0.06] text-white' : 'border-neutral-350 bg-[#e9e6dc] text-neutral-900'
                            }`}>shared vocabulary</span> for talking about UX, a lightweight research habit, and clearer ways to structure screens before pixels.
                          </div>

                          {/* Blockquote callout box */}
                          <div className={`border-l-2 p-2.5 rounded-r-lg text-[10px] italic leading-normal transition-colors ${
                            theme === 'dark' 
                              ? 'border-neutral-500 bg-white/[0.02] text-neutral-400' 
                              : 'border-neutral-450 bg-[#e9e6dc] text-neutral-600'
                          }`}>
                            Tip: Share one real product thread in the community — we'll review it on our next live call.
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>The Research Loop</h4>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                              theme === 'dark' ? 'bg-white/[0.04] border-white/[0.06] text-neutral-400' : 'bg-neutral-200 border-neutral-300 text-neutral-600'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>4 min</span>
                            </div>
                          </div>
                          
                          <div className={`text-[11px] leading-relaxed font-normal transition-colors ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            Learn to conduct high-impact user research interviews that extract <span className={`px-1.5 py-0.5 rounded-full border font-semibold ${
                              theme === 'dark' ? 'border-white/[0.18] bg-white/[0.06] text-white' : 'border-neutral-350 bg-[#e9e6dc] text-neutral-900'
                            }`}>actionable feedback</span> without draining your weekly schedule. Focus on actual past behavior instead of hypothetical desires.
                          </div>

                          {/* Blockquote callout box */}
                          <div className={`border-l-2 p-2.5 rounded-r-lg text-[10px] italic leading-normal transition-colors ${
                            theme === 'dark' 
                              ? 'border-emerald-500/80 bg-white/[0.02] text-neutral-400' 
                              : 'border-emerald-600 bg-emerald-50/50 text-neutral-600'
                          }`}>
                            Tip: Download our template questionnaire script from the chapter resources folder below.
                          </div>
                        </div>
                      )}

                      {/* Slash command input bar */}
                      <div className={`border-t pt-3.5 flex items-center justify-between transition-colors ${
                        theme === 'dark' ? 'border-white/[0.06]' : 'border-neutral-300'
                      }`}>
                        <span className="text-[11px] font-mono text-neutral-400">Type "/" for commands</span>
                        
                        {/* Interactive float commands menu box */}
                        <div className={`border rounded-lg p-1.5 flex flex-col gap-0.5 w-[110px] shadow-lg select-none text-left transition-colors ${
                          theme === 'dark' 
                            ? 'bg-neutral-900/90 border-white/[0.1]' 
                            : 'bg-white border-[#dfdbd0] text-neutral-800'
                        }`}>
                          <div className="px-1.5 py-0.5 text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Blocks</div>
                          <div className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1 ${
                            theme === 'dark' ? 'text-white bg-white/[0.05]' : 'text-neutral-900 bg-neutral-100'
                          }`}>
                            <span>H</span> Heading
                          </div>
                          <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                            <span>¶</span> Paragraph
                          </div>
                          <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                            <span>💡</span> Callout
                          </div>
                          <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                            <span>&lt;&gt;</span> Code
                          </div>
                          <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                            <span>―</span> Divider
                          </div>
                          <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                            <span>🖼️</span> Image
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 relative">
        {/* Floating animated decorations in Pricing */}
        <FloatingDecoration 
          icon={Award} 
          theme={theme} 
          className="top-[25%] left-[2%] xl:left-[-6%]" 
          duration={18} 
          delay={0.4} 
          rotateDirection={1} 
          glowColor="rgba(234,179,8,0.12)"
          size="md"
        />
        <FloatingDecoration 
          icon={Lock} 
          theme={theme} 
          className="bottom-[25%] right-[2%] xl:right-[-6%]" 
          duration={16} 
          delay={1.1} 
          rotateDirection={-1} 
          glowColor="rgba(59,130,246,0.12)"
          size="md"
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid md:grid-cols-12 gap-6 items-start md:items-end justify-between mb-16"
        >
          <div className="md:col-span-7 text-center md:text-left flex flex-col items-center md:items-start">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-400' 
                : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
            }`}>
              <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              Pricing
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold mt-5 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Clear pricing plans
            </h2>
            <h2 className={`text-4xl sm:text-5xl font-bold mt-2 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              that scale with you.
            </h2>
          </div>
          <div className="md:col-span-5 text-center md:text-left md:pb-2">
            <p className={`text-sm sm:text-base leading-relaxed font-normal transition-colors duration-300 min-h-[60px] ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <Typewriter 
                words={["Choose a flexible, feature-rich pricing plan built for communities of all sizes. No hidden transaction fees, fully customizable, and complete data ownership."]}
                typingSpeed={25}
                showCursor={false}
                oneWay={true}
                triggerInView={true}
              />
            </p>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={pricingContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 md:gap-6 items-stretch mt-12 md:py-8"
        >
          {PRICING_PLANS.map(plan => {
            const isPro = plan.isPopular;
            return (
              <motion.div 
                key={plan.name}
                variants={pricingCardVariants}
                whileHover={{ scale: isPro ? 1.02 : 1.015 }}
                transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`relative rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border ${
                  isPro 
                    ? theme === 'dark'
                      ? 'bg-[#121215] border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 md:-my-5 md:py-11' 
                      : 'bg-[#f4f2eb] border-[#cbc6b8] shadow-[0_15px_40px_rgba(140,137,125,0.08)] z-10 md:-my-5 md:py-11'
                    : theme === 'dark'
                      ? 'bg-[#0c0c0e] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] shadow-[0_15px_30px_rgba(0,0,0,0.4)]'
                      : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-neutral-50/50 shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
                }`}
              >
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest block transition-colors ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {plan.name}
                  </span>
                  
                  <div className={`h-px mt-4 mb-6 transition-colors ${
                    theme === 'dark' ? 'bg-white/[0.06]' : 'bg-neutral-300'
                  }`} />

                  <div className="flex items-baseline gap-1 mt-4">
                    <span className={`text-4xl sm:text-5xl font-bold tracking-tight transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm font-medium lowercase transition-colors ${
                        theme === 'dark' ? 'text-neutral-450' : 'text-neutral-500'
                      }`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-[13px] mt-4 leading-relaxed font-normal min-h-[36px] transition-colors ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
                  }`}>
                    {plan.description}
                  </p>

                  <button 
                    onClick={() => handleOpenJoinModal(plan)}
                    className={`w-full py-3 rounded-full text-xs mt-6 ${getUnifiedButtonClass(theme, isPro)}`}
                  >
                    {plan.buttonText}
                  </button>
                  
                  {/* Features Row-by-Row Layout with Top and Bottom Borders */}
                  <div className={`mt-8 flex flex-col border-t transition-colors ${
                    theme === 'dark' ? 'border-white/[0.05]' : 'border-neutral-300'
                  }`}>
                    {plan.features.map(feat => (
                      <div 
                        key={feat} 
                        className={`flex items-center gap-3.5 py-4 border-b text-sm leading-normal transition-colors ${
                          theme === 'dark' ? 'border-white/[0.05]' : 'border-neutral-200'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/[0.18] bg-white/[0.02]' 
                            : 'border-[#dfdbd0] bg-neutral-100'
                        }`}>
                          <Check className={`w-3 h-3 stroke-[3px] transition-colors ${
                            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                          }`} />
                        </div>
                        <span className={`text-[13px] font-normal transition-colors ${
                          theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                        }`}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 relative overflow-hidden transition-colors duration-300">


        {/* FAQ Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 text-center md:text-left items-center md:items-end"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' 
                : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
            }`}>
              <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              FAQ
            </span>
            <h2 className={`text-4xl sm:text-[45px] font-bold mt-5 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Answers to the questions
            </h2>
            <h2 className={`text-4xl sm:text-[45px] font-bold mt-2 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              that come up most.
            </h2>
          </div>
          <div className={`text-center md:text-left md:max-w-[340px] text-sm leading-relaxed font-normal transition-colors duration-300 mx-auto md:mx-0 min-h-[60px] ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
          }`}>
            <Typewriter 
              words={["Learn how Sylvan works, what's included in the beta, what your members experience, and what to expect as the platform grows."]}
              typingSpeed={25}
              showCursor={false}
              oneWay={true}
              triggerInView={true}
            />
          </div>
        </motion.div>

        <motion.div 
          variants={faqContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-12 gap-8 items-start"
        >
          {/* Left Side: Categories and Support Card */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Category tabs */}
            <motion.div 
              variants={faqCardVariants}
              className={`flex flex-col gap-1 border p-1.5 rounded-[24px] transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#09090b]/40 border-white/[0.03]' : 'bg-[#e9e6dc] border-[#dfdbd0]'
              }`}
            >
              {[
                { id: 'general', label: 'General' },
                { id: 'features', label: 'Community & Features' },
                { id: 'privacy', label: 'Privacy & Access' }
              ].map(cat => {
                const isSelected = activeFaqCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => { setActiveFaqCategory(cat.id as any); setOpenFaqId(null); }}
                    className={`w-full text-center px-6 py-3.5 rounded-full text-xs font-bold transition-all duration-200 focus:outline-none ${
                      isSelected 
                        ? theme === 'dark'
                          ? 'bg-[#1e1e21] text-white border border-white/[0.08] shadow-inner' 
                          : 'bg-white text-neutral-950 shadow-sm border border-[#dfdbd0]'
                        : theme === 'dark'
                          ? 'text-neutral-400 hover:text-white hover:bg-white/[0.015] border border-transparent'
                          : 'text-neutral-650 hover:text-neutral-950 hover:bg-white/[0.25] border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </motion.div>

            {/* Support Card */}
            <motion.div 
              variants={faqCardVariants}
              whileHover={{ scale: 1.015 }}
              transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
              className={`border p-8 rounded-[24px] text-left flex flex-col justify-between h-auto transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#0c0c0e] border-white/[0.05]' 
                  : 'bg-[#fdfdfc] border-[#dfdbd0] shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
              }`}
            >
              <div>
                <h4 className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>Got Questions?</h4>
                <p className={`text-sm mt-3 leading-relaxed font-normal transition-colors duration-300 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
                }`}>
                  Can't find what you're looking for? Reach out — we're fast.
                </p>
              </div>
              <button 
                onClick={() => handleOpenJoinModal()}
                className={`text-sm font-semibold mt-8 flex items-center gap-1.5 transition-colors group self-start ${
                  theme === 'dark' ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-700'
                }`}
              >
                Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Side: FAQ Accordion */}
          <motion.div 
            variants={faqCardVariants}
            className="md:col-span-8 flex flex-col gap-4"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeFaqCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-4"
              >
                {filteredFaqs.map(item => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      className={`border rounded-[20px] overflow-hidden transition-all duration-300 shadow-md ${
                        theme === 'dark' 
                          ? 'bg-[#0c0c0e] border-white/[0.05] hover:border-white/[0.08]' 
                          : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] shadow-[0_10px_30px_rgba(140,137,125,0.04)]'
                      }`}
                    >
                      <button 
                        onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className={`text-sm sm:text-[15px] font-semibold tracking-tight pr-4 transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-neutral-900'
                        }`}>{item.question}</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          theme === 'dark' ? 'border-white/[0.08] bg-white/[0.04]' : 'border-[#dfdbd0] bg-[#e9e6dc]'
                        }`}>
                          <ChevronDown className={`w-3.5 h-3.5 transition-all duration-300 ${
                            isOpen 
                              ? 'rotate-180 ' + (theme === 'dark' ? 'text-white' : 'text-neutral-900') 
                              : (theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')
                          }`} />
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className={`px-8 pb-7 text-xs sm:text-[13px] leading-relaxed font-normal transition-colors ${
                              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-700'
                            }`}>
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* BLOG SECTION */}
      <section id="blog" className="py-28 px-6 max-w-7xl mx-auto scroll-mt-20 relative overflow-hidden transition-colors duration-300">


        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 text-center md:text-left items-center md:items-end"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300' 
                : 'bg-[#e9e6dc] border-[#dfdbd0] text-neutral-600'
            }`}>
              <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
              Blog
            </span>
            <h2 className={`text-4xl sm:text-[45px] font-bold mt-5 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Ideas, updates, and
            </h2>
            <h2 className={`text-4xl sm:text-[45px] font-bold mt-2 tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              practical AI workflows
            </h2>
          </div>
          <button 
            onClick={() => handleOpenJoinModal()}
            className={`text-sm font-semibold mt-6 md:mt-0 flex items-center gap-1.5 transition-colors group self-center md:self-auto ${
              theme === 'dark' ? 'text-white/95 hover:text-white' : 'text-neutral-900 hover:text-neutral-700'
            }`}
          >
            Visit blog <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Blog Post Cards Grid */}
        <motion.div 
          variants={blogContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {BLOG_POSTS.map(post => (
            <motion.article 
              key={post.id}
              variants={blogCardVariants}
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedBlog(post)}
              className={`rounded-[24px] p-4 pb-6 flex flex-col justify-between transition-all duration-300 border cursor-pointer group ${
                theme === 'dark'
                  ? 'bg-[#0b0b0d] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#121215] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                  : 'bg-[#fdfdfc] border-[#dfdbd0] hover:border-[#cbc6b8] hover:bg-[#f4f2eb]/40 hover:shadow-[0_15px_35px_rgba(140,137,125,0.06)]'
              }`}
            >
              <div>
                {/* Framed Card Thumbnail */}
                <div className={`aspect-[16/10] overflow-hidden relative rounded-[16px] transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#050506]' : 'bg-neutral-100'
                }`}>
                  {post.id === 'sylvan-vs-platforms' ? (
                    <div className={`w-full h-full relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-[#060608] via-[#111115] to-[#040405]' 
                        : 'bg-gradient-to-br from-[#f4f2eb] via-neutral-100 to-[#e9e6dc]'
                    }`}>
                      {/* Deep metallic smoke vector style back gradient */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-screen scale-110 blur-sm saturate-50" style={{ backgroundImage: `url('${post.image}')` }} />
                      
                      {/* Glassmorphic chrome silver rounded letter 'F' tile */}
                      <div className={`relative w-28 h-28 rounded-3xl border flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                        theme === 'dark'
                          ? 'from-white/[0.16] to-white/[0.02] border-white/[0.12] bg-gradient-to-b shadow-[0_15px_30px_rgba(0,0,0,0.8)]'
                          : 'from-white/70 to-white/10 border-neutral-300/80 bg-gradient-to-b shadow-md'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent" />
                        <span className={`text-5xl font-black font-sans select-none drop-shadow-sm transition-colors ${
                          theme === 'dark' ? 'text-white opacity-90' : 'text-neutral-900 opacity-95'
                        }`}>F</span>
                        <div className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-white/[0.2] to-transparent`} />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-102 ${
                        theme === 'dark' ? '' : 'brightness-[0.96] contrast-[1.02]'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                
                {/* Content */}
                <div className="mt-5 text-left">
                  <h3 className={`text-[17px] sm:text-lg font-bold tracking-tight leading-snug transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white group-hover:text-white/90' : 'text-neutral-900 group-hover:text-neutral-800'
                  }`}>
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className={`mt-8 flex items-center gap-2.5 text-xs font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'
              }`}>
                <span>{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className={`relative pt-36 pb-52 px-6 overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#070708]' : 'bg-[#fbfaf7]'
      }`}>
        {/* Breathtaking 4K High-Contrast Ambient Background with Blur effect (Ref: 4K Premium Fluid Silk) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Main 4K fluid dark/light high-contrast image with elegant blur and slow GPU-accelerated drift animation */}
          <div 
            className={`absolute inset-0 bg-cover bg-center opacity-70 blur-[45px] saturate-[1.2] animate-bg-drift`} 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=80')`,
              willChange: 'transform'
            }} 
          />
          {/* Subtle soft textured layer to keep high-contrast dark & white flow depth */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay scale-110 blur-[6px] animate-bg-drift-reverse" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=80')`,
              willChange: 'transform'
            }} 
          />
          
          {/* Smooth radial gradients and deep fading to blend into layout */}
          <div className={`absolute inset-0 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-[radial-gradient(circle_at_50%_50%,transparent_10%,#070708_95%)]' 
              : 'bg-[radial-gradient(circle_at_50%_50%,transparent_10%,#fbfaf7_95%)]'
          }`} />
          <div className={`absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t z-10 transition-colors duration-300 ${
            theme === 'dark' ? 'from-[#070708]' : 'from-[#fbfaf7]'
          } to-transparent`} />
          <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b z-10 transition-colors duration-300 ${
            theme === 'dark' ? 'from-[#070708]' : 'from-[#fbfaf7]'
          } to-transparent`} />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-4 md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <h2 className={`text-4xl sm:text-[44px] font-bold tracking-tight leading-[1.15] text-center md:text-left transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              Your community <br />
              is one sec away.
            </h2>
            <p className={`text-sm sm:text-base mt-6 leading-relaxed max-w-sm mx-auto md:mx-0 text-center md:text-left font-normal transition-colors duration-300 min-h-[80px] ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
            }`}>
              <Typewriter 
                words={["Sylvan is in beta and free to join. Set up your space, invite your first members, and see what it feels like when everything lives in one place — under your name."]}
                typingSpeed={25}
                showCursor={false}
                oneWay={true}
                triggerInView={true}
              />
            </p>
            <button 
              onClick={() => handleOpenJoinModal()}
              className={`px-8 py-3.5 text-sm rounded-full mt-8 ${getUnifiedButtonClass(theme, true)}`}
            >
              Start for free
            </button>
          </motion.div>

          {/* Right side mockup - maximized spacious size */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 md:col-span-8 flex justify-center md:justify-end relative w-full"
          >
            <div className={`w-full lg:max-w-[1020px] md:max-w-[820px] max-w-[540px] rounded-[24px] overflow-hidden flex lg:h-[640px] md:h-[540px] h-[440px] relative z-10 transition-all duration-300 border ${
              theme === 'dark' 
                ? 'bg-[#0c0c0e]/95 border-white/[0.06] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] hover:border-white/[0.09]' 
                : 'bg-white/95 border-neutral-300 shadow-[0_20px_45px_rgba(140,137,125,0.08)] hover:border-neutral-350'
            }`}>
              {/* Mockup Sidebar */}
              <div className={`w-12 sm:w-[30%] border-r p-3 sm:p-5 lg:p-7 flex flex-col gap-4 sm:gap-6 lg:gap-8 shrink-0 text-left transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#080809] border-white/[0.04]' : 'bg-[#f4f2eb] border-neutral-200'
              }`}>
                <div className="flex items-center justify-center sm:justify-between">
                  <div className={`w-6 sm:w-14 h-4.5 rounded-md opacity-80 shrink-0 ${
                    theme === 'dark' ? 'bg-[#1e1e21]' : 'bg-neutral-300'
                  }`} />
                  <Search className={`w-4 h-4 shrink-0 hidden sm:block ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`} />
                </div>

                <div className="flex flex-col gap-4 lg:gap-5.5 mt-2">
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
                        className={`flex items-center justify-center sm:justify-start gap-2.5 lg:gap-3 transition-colors cursor-pointer text-[11px] lg:text-xs font-semibold ${
                          theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mockup Main Panel */}
              <div className={`flex-1 p-4 sm:p-6 lg:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#121214]/90' : 'bg-white/40'
              }`}>
                {/* Circular Avatar */}
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-bold text-lg lg:text-2xl shadow-lg shrink-0 ${
                  theme === 'dark' ? 'bg-white text-black' : 'bg-neutral-900 text-white'
                }`}>
                  S
                </div>

                {/* Title */}
                <h3 className={`text-base lg:text-2xl font-bold mt-3 sm:mt-4 tracking-tight transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>
                  Strong By Ava
                </h3>

                {/* Avatar Stack */}
                <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48&q=80" className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&h=48&q=80" className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=48&h=48&q=80" className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border object-cover ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`} referrerPolicy="no-referrer" />
                  </div>
                  <span className={`text-[10px] sm:text-xs lg:text-sm font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'}`}>847 members</span>
                </div>

                {/* Button */}
                <button 
                  onClick={() => handleOpenJoinModal()}
                  className={`w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] py-2.5 sm:py-3 lg:py-3.5 rounded-full text-[11px] sm:text-xs lg:text-sm font-extrabold mt-4 sm:mt-6 lg:mt-8 transition-all hover:scale-105 active:scale-95 hover:shadow-xl shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-[#e2e2e4] hover:bg-white text-[#070708] hover:shadow-white/[0.05]' 
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white hover:shadow-neutral-950/15'
                  }`}
                >
                  Join now
                </button>

                {/* Bio / Description */}
                <p className={`text-[10px] sm:text-xs lg:text-[13px] leading-relaxed mt-4 sm:mt-6 lg:mt-8 text-left font-normal max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] line-clamp-3 sm:line-clamp-none transition-colors duration-300 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-650'
                }`}>
                  Ava Torres is a certified strength coach with 80k+ followers on Instagram. → 12-week progressive training programs with video lessons → Weekly live Q&As and form-check threads → A supportive community of women training for strength
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        </>
      ) : (
        <StyleGuidePage 
          theme={theme}
          setCurrentPage={setCurrentPage}
          handleOpenJoinModal={handleOpenJoinModal}
        />
      )}

      {/* FOOTER COMPONENT */}
      <Footer 
        theme={theme}
        handleOpenJoinModal={handleOpenJoinModal}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* 4. LEGAL COMPLIANCE CMS POLICY PAGE */}
      <AnimatePresence>
        {activePolicy && (
          <PolicyPage 
            activePolicy={activePolicy}
            onClose={() => setActivePolicy(null)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* PORTAL MODALS */}
      
      {/* 1. BLOG ARTICLE MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`border rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col transition-colors duration-300 ${
                theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-[#fbfaf7] border-[#dfdbd0]'
              }`}
            >
              {/* Cover Image */}
              <div className="h-48 shrink-0 relative overflow-hidden">
                <img 
                  src={selectedBlog.image} 
                  alt={selectedBlog.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  theme === 'dark' ? 'from-neutral-900' : 'from-[#fbfaf7]'
                } to-transparent`} />
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className={`absolute top-4 right-4 p-2 rounded-full border transition-colors focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:text-white' 
                      : 'bg-white/80 border-neutral-300 text-neutral-700 hover:text-neutral-900 shadow-sm'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-semibold rounded-full shadow">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 text-left select-text scrollbar-thin">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime}</span>
                </div>
                <h2 className={`text-xl md:text-2xl font-bold mt-3 leading-snug transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                }`}>
                  {selectedBlog.title}
                </h2>
                
                <div className={`h-px my-4 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-300'
                }`} />

                {/* Body */}
                <div className={`text-sm leading-relaxed space-y-4 font-normal transition-colors duration-300 ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  <p className={`text-sm font-semibold italic transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-950'
                  }`}>{selectedBlog.excerpt}</p>
                  <p>
                    Connecting discussions, courses, events, and member list databases natively inside a single system is crucial for user experience. Standard online groups typically suffer from fragmentation—meaning members are required to navigate separate Discord chat servers, Vimeo/Teachable course structures, and Eventbrite RSVPs.
                  </p>
                  <p>
                    Sylvan bridges this gap elegantly. When your community portal is fully white-labeled under your own domain name (such as <code className={`font-mono px-1.5 py-0.5 rounded transition-colors ${
                      theme === 'dark' ? 'bg-neutral-950 text-blue-400' : 'bg-neutral-200/50 text-blue-700'
                    }`}>community.yourdomain.com</code>), user confidence is dramatically elevated. Your members are protected from competing social media notifications and algorithms.
                  </p>
                  <h4 className={`text-sm font-semibold pt-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-900'
                  }`}>Building Visual Value and Confidence</h4>
                  <p>
                    By having courses and chats co-existing in the same browser tab, you can instantly award specific engagement badges, restrict circles based on completion schedules, and offer customized membership tiers without configuring complex webhook connections.
                  </p>
                  <p>
                    Start with 3 essential topics to spark engagement: an introduction thread, an announcements hub, and a casual coffee-shop lounge. This keeps your early members focused and builds high quality, long-term retention.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-4 shrink-0 flex items-center justify-between border-t transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#070708]/60 border-neutral-800' : 'bg-[#f4f2eb]/60 border-[#dfdbd0]'
              }`}>
                <span className="text-[10px] text-neutral-500">Press Esc or click out to close</span>
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className={`px-4 py-2 border rounded-full text-xs font-semibold transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-850' 
                      : 'bg-white border-[#dfdbd0] text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. JOIN/SIGN UP MODAL */}
      <AnimatePresence>
        {joinModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setJoinModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.96, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 25, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className={`border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative transition-all duration-300 ${
                theme === 'dark' ? 'bg-[#0c0c0e] border-white/[0.08]' : 'bg-[#fcfbf9] border-[#dfdbd0]'
              }`}
            >
              {/* Header */}
              <div className={`p-8 pb-4 border-b flex items-start justify-between transition-colors duration-300 ${
                theme === 'dark' ? 'border-white/[0.06]' : 'border-neutral-200'
              }`}>
                <div>
                  <h3 className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-neutral-950'
                  }`}>
                    {selectedPlan ? `Join Sylvan ${selectedPlan.name}` : 'Get Early Access'}
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {selectedPlan ? `Starting at ${selectedPlan.price} / month` : 'Experience a premium, unified creator portal.'}
                  </p>
                </div>
                <button 
                  onClick={() => setJoinModalOpen(false)}
                  className={`p-2 rounded-full transition-all active:scale-95 ${
                    theme === 'dark' 
                      ? 'hover:bg-white/[0.06] text-neutral-400 hover:text-white' 
                      : 'hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
 
              {/* Form Content */}
              <div className="p-8">
                {registrationSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-5 transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <h4 className={`text-base font-bold transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-neutral-950'
                    }`}>Registration Successful!</h4>
                    <p className={`text-xs mt-3 max-w-[280px] leading-relaxed font-normal transition-colors duration-300 ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      We have sent your invite coordinates. Check your email inbox to activate your custom community!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label htmlFor="name" className={`text-xs font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>Your Name</label>
                      <input 
                        id="name"
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ava Torres"
                        className={`border rounded-xl px-4 py-3 text-xs focus:outline-none transition-all duration-200 font-normal ${
                          theme === 'dark' 
                            ? 'bg-[#070708] border-white/[0.08] text-white placeholder-neutral-600 focus:border-white/[0.3]' 
                            : 'bg-white border-neutral-300 text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 shadow-inner'
                        }`}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-left">
                      <label htmlFor="email" className={`text-xs font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>Your Email Address</label>
                      <input 
                        id="email"
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="ava@yourdomain.com"
                        className={`border rounded-xl px-4 py-3 text-xs focus:outline-none transition-all duration-200 font-normal ${
                          theme === 'dark' 
                            ? 'bg-[#070708] border-white/[0.08] text-white placeholder-neutral-600 focus:border-white/[0.3]' 
                            : 'bg-white border-neutral-300 text-neutral-950 placeholder-neutral-400 focus:border-neutral-950 shadow-inner'
                        }`}
                      />
                    </div>
 
                    {selectedPlan && (
                      <div className={`p-4 rounded-2xl border text-left transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#eae7de]/30 border-neutral-200'
                      }`}>
                        <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Selected Tier</span>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className={`text-xs font-bold transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-950'
                          }`}>{selectedPlan.name} Plan</span>
                          <span className={`text-xs font-mono font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-neutral-950'
                          }`}>{selectedPlan.price}</span>
                        </div>
                      </div>
                    )}
 
                    <div className="text-[10px] text-neutral-500 flex items-center gap-2 py-1 text-left font-normal">
                      <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Complies with data protection guidelines. 0% platform fees.</span>
                    </div>
 
                    <button 
                      type="submit"
                      className={`w-full py-4 rounded-xl text-xs mt-2 ${getUnifiedButtonClass(theme, true)}`}
                    >
                      {selectedPlan ? 'Confirm Subscription' : 'Request Invitation'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACK TO TOP BUTTON & SCROLL PROGRESS INDICATOR */}
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
    </div>
    </>
  );
}
