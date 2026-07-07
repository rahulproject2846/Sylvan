import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Search, FileText, Printer, ArrowLeft, Check, Shield, ShieldCheck, Cookie } from 'lucide-react';

interface PolicyPageProps {
  activePolicy: 'terms' | 'privacy' | 'cookie';
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function PolicyPage({ activePolicy, onClose, theme }: PolicyPageProps) {
  const [currentTab, setCurrentTab] = useState<'terms' | 'privacy' | 'cookie'>(activePolicy);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'terms', label: 'Terms of Use', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'cookie', label: 'Cookie Policy', icon: Cookie },
  ] as const;

  const handlePrint = () => {
    window.print();
  };

  // Highly researched and professional Sylvan-centric policy contents
  const policies = useMemo(() => {
    return {
      terms: {
        title: 'Sylvan Terms of Use',
        lastUpdated: 'Last Updated: July 6, 2026',
        sections: [
          {
            title: '1. Agreement to Terms',
            content: `Welcome to Sylvan. Sylvan, Inc. ("Sylvan", "we", "us", or "our") provides an offline-first and cloud-synchronized modular community, course, and directory hosting service under custom-domain names for creators, educators, and coaches (collectively, "Creators") and their respective participants, students, or subscribers ("Members"). 

By accessing or using our websites, software, APIs, and online portal services (the "Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, you are prohibited from using the platform.`
          },
          {
            title: '2. Services and Account Setup',
            content: `Sylvan acts as a white-labeled service provider. 
- **Creator Accounts**: To offer a community platform, you must set up a Creator Account. You are responsible for maintaining the security of your account, API keys, custom domain DNS mappings, and server access. Sylvan holds zero liability for DNS hijacking or domain configuration failures.
- **Member Accounts**: Accessing a Sylvan-powered community requires Member registration. Creators are responsible for moderating and maintaining the privacy, registrations, and data deletion of their Members. Sylvan operates merely as a processor of that community data.`
          },
          {
            title: '3. Data Ownership & Content Licensing',
            content: `We strongly believe in the complete sovereignty of creators over their intellectual property.
- **Creator Sovereignty**: You retain 100% ownership of any data, curriculum material, discussions, branding assets, images, and user lists uploaded to your custom Sylvan domain. Sylvan claims no ownership over your intellectual property.
- **Licensing Grant to Sylvan**: You grant Sylvan a non-exclusive, worldwide, royalty-free license solely to host, cache, distribute, and display your content to your designated Members on your behalf. This license terminates automatically when you close your Sylvan account.
- **Member-Generated Content**: Any content posted by Members inside a Creator’s community is licensed to the Creator according to the Creator's own internal policies.`
          },
          {
            title: '4. Billing, Subscriptions, and Revenue Shares',
            content: `- **Platform Fees**: Sylvan does not charge any hidden transaction fees on subscriptions or ticket sales created through Sylvan. Sylvan operates under a flat annual or monthly subscription plan.
- **Stripe Connect**: Creators must connect their own Stripe merchant accounts. All financial transactions are directly routed between the Creator and the Member. Sylvan is not a party to, and holds no liability for, subscription cancellations, card chargebacks, or refunds.
- **Refund Policy**: Subscriptions to Sylvan's platform are non-refundable except where mandated by local consumer protection regulations.`
          },
          {
            title: '5. Acceptable Use Policy',
            content: `You and your Members are prohibited from:
- Hosting content that promotes violence, discrimination, illegal activities, or copyright infringement.
- Running automated screen-scraping bots, malicious crawling algorithms, or massive spam campaigns on Sylvan server clusters.
- Spoofing or impersonating other brands, systems, or Sylvan representatives.
- Interfering with the security features or attempting reverse engineering of the React/Vite/Express application structure of the Sylvan engine.`
          },
          {
            title: '6. Limitation of Liability',
            content: `Sylvan is provided on an "as-is" and "as-available" basis. In no event shall Sylvan, its directors, or its software engineers be liable for any indirect, incidental, special, or consequential damages resulting from platform downtime, data loss, DNS misconfigurations, or service interruptions. Your sole remedy for dissatisfaction is to stop using the platform.`
          }
        ]
      },
      privacy: {
        title: 'Sylvan Privacy Policy',
        lastUpdated: 'Last Updated: July 6, 2026',
        sections: [
          {
            title: '1. Introduction',
            content: `At Sylvan, we respect your privacy and are committed to safeguarding the personal data of our Creators and their Members. This Privacy Policy explains what personal information we collect, how it is handled, and your extensive rights under GDPR, CCPA, and global data sovereignty rules.`
          },
          {
            title: '2. Information We Collect',
            content: `We collect information necessary to provide a high-ticket, secure community hosting environment:
- **Creator Personal Data**: Email addresses, names, business locations, and custom domain connection mapping details.
- **Member Personal Data**: Collected on behalf of Creators, including email addresses, encrypted passwords, profiles, bios, community discussion responses, and completed course lessons.
- **Analytical & System Logging**: IP addresses, browser types, and access timestamps necessary to protect the platform from DDoS attacks and unauthorized logins.`
          },
          {
            title: '3. Data Ownership & Role Specifications',
            content: `Under modern data protection regulations (such as GDPR):
- **Sylvan as Data Processor**: Sylvan acts purely as a Data Processor for the data uploaded, created, or managed inside any custom-branded Sylvan community.
- **The Creator as Data Controller**: The Creator acts as the Data Controller. The Creator holds absolute legal responsibility for informing their Members about their data practices, processing consent, and handling Member deletion requests. Sylvan will assist Creators in fulfilling Member rights.`
          },
          {
            title: '4. How We Use and Share Information',
            content: `We abide by a strict zero-marketing-sharing policy:
- **No Third-Party Ad Networks**: We do NOT sell, license, or trade your personal data or community data to any advertising agencies, data brokers, or third parties.
- **Required Subprocessors**: We share data only with essential cloud infrastructure services (e.g. secure cloud database storage, secure hosting instances) required to deliver Sylvan.
- **Creator Access**: Since communities are fully white-labeled, Creators have complete, unfiltered read access to their community's list of registered Member emails, user activity, and progress records.`
          },
          {
            title: '5. Security Protocols and Data Transfer',
            content: `All Sylvan database transactions utilize 256-bit TLS encryption in transit and AES-256 encryption at rest. Member authentication sessions utilize industry-standard cryptographic signing algorithms. We do not store plain-text passwords—all credentials are high-entropy hashed before persistence.`
          },
          {
            title: '6. GDPR & CCPA Rights',
            content: `You possess the right to:
- Request access to all personal data Sylvan holds on your behalf.
- Request immediate, complete deletion of your user account and community data.
- Opt out of automated tracking. Sylvan fully respects "Do Not Track" browser signals by default.`
          }
        ]
      },
      cookie: {
        title: 'Sylvan Cookie Policy',
        lastUpdated: 'Last Updated: July 6, 2026',
        sections: [
          {
            title: '1. What Are Cookies?',
            content: `Cookies are small text files placed on your device when you browse websites. Sylvan uses functional cookies to operate secure user authentication systems and custom domain mappings. Because Sylvan hosts white-labeled communities, these cookies may be served directly from your custom domain (e.g., custom.yourdomain.com) to allow secure session management.`
          },
          {
            title: '2. Essential Authentication Cookies',
            content: `These cookies are strictly necessary to deliver the primary functionalities of Sylvan:
- **s_session_token**: An encrypted cryptographically-signed token stored to identify your authenticated login state. If blocked, members cannot log in or participate.
- **s_theme**: Remembers your preferred aesthetic selection (Dark Forest theme vs. Light Parchment theme) across sessions.
- **s_csrf**: Prevents Cross-Site Request Forgery attacks, guaranteeing secure form submissions.`
          },
          {
            title: '3. Functional and Analytics Cookies',
            content: `We do not use third-party tracking pixels (such as Meta pixel or Google Adsense cookies) by default. If a Creator wishes to integrate their own tracking or performance measuring cookies, they must explicitly declare it to their Members. Sylvan's core cookies are purely functional and telemetry-free.`
          },
          {
            title: '4. Scope on Custom Domains',
            content: `To provide a fully white-labeled experience, Sylvan maps cookies to the active Host Header of the connection. For instance, when a Member is navigating your custom domain, the cookie is securely isolated to that specific domain and is never broadcasted to any sylvan.com server, respecting sandboxed security architecture.`
          },
          {
            title: '5. How to Control Cookies',
            content: `Most web browsers permit cookie management through browser settings. You can delete existing cookies, block cookies entirely, or configure your browser to alert you when a cookie is proposed. Please note that blocking essential cookies will immediately break Sylvan's authentication, courses, and chat features.`
          }
        ]
      }
    };
  }, []);

  const activeData = policies[currentTab];

  // Search filter and highlight logic
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return activeData.sections;
    const query = searchQuery.toLowerCase();
    return activeData.sections.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
    );
  }, [searchQuery, activeData]);

  // Helper to highlight matches
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-500/30 text-yellow-100 rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto flex flex-col md:flex-row transition-all duration-500 text-left ${
      theme === 'dark' ? 'bg-[#070708] text-white' : 'bg-[#fbfaf7] text-neutral-900'
    }`}>
      
      {/* Policy Sidebar */}
      <div className={`w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r p-6 flex flex-col gap-8 select-none ${
        theme === 'dark' ? 'border-white/[0.08] bg-[#0c0c0e]' : 'border-neutral-200 bg-[#f7f5ed]'
      }`}>
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors py-2 px-3 rounded-lg ${
              theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/[0.04]' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </button>
          
          <button 
            onClick={onClose}
            className={`md:hidden p-2 rounded-full transition-colors ${
              theme === 'dark' ? 'text-neutral-400 hover:bg-white/[0.05]' : 'text-neutral-600 hover:bg-neutral-200/50'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1">Sylvan Legal</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Comprehensive terms, privacy guidelines, and compliance resources.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 shrink-0 select-none ${
                  isSelected 
                    ? theme === 'dark'
                      ? 'bg-white text-neutral-950 shadow-lg shadow-white/5'
                      : 'bg-neutral-950 text-white shadow-lg shadow-neutral-950/10'
                    : theme === 'dark'
                      ? 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/40'
                }`}
              >
                <TabIcon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Print Button */}
        <div className="mt-auto hidden md:block">
          <button
            onClick={handlePrint}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/[0.15] bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/[0.25] shadow-sm' 
                : 'border-neutral-300 bg-[#e9e6dc]/30 text-neutral-800 hover:text-neutral-950 hover:bg-neutral-200 hover:border-neutral-400 shadow-sm'
            }`}
          >
            <Printer className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white" />
            Print Document
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Document Search Header */}
        <div className={`p-6 border-b flex items-center justify-between gap-6 shrink-0 select-none ${
          theme === 'dark' ? 'border-white/[0.08] bg-[#070708]/80' : 'border-neutral-200 bg-white/80'
        } backdrop-blur-md`}>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search in ${activeData.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus:ring-1 ${
                theme === 'dark'
                  ? 'bg-white/[0.04] border-white/[0.08] text-white focus:bg-white/[0.06] focus:border-white/[0.2] focus:ring-white/[0.2]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-900 focus:bg-white focus:border-neutral-400 focus:ring-neutral-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-100"
              >
                Clear
              </button>
            )}
          </div>

          <button 
            onClick={onClose}
            className={`hidden md:flex p-2.5 rounded-full border transition-all ${
              theme === 'dark' 
                ? 'border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05]' 
                : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100'
            }`}
            title="Close Policy Reader"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Document Text */}
        <div className={`flex-1 p-8 md:p-12 overflow-y-auto ${
          theme === 'dark' ? 'bg-[#070708]' : 'bg-white'
        }`}>
          <div className="max-w-2xl mx-auto space-y-12">
            
            {/* Header Title */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                {currentTab === 'terms' && <FileText className="w-5 h-5 text-blue-500" />}
                {currentTab === 'privacy' && <Shield className="w-5 h-5 text-emerald-500" />}
                {currentTab === 'cookie' && <Cookie className="w-5 h-5 text-amber-500" />}
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-500">
                  Sylvan Security Compliance
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
                {activeData.title}
              </h1>
              <p className={`text-xs mt-3 font-medium ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {activeData.lastUpdated}
              </p>
            </div>

            {/* Document Sections */}
            <div className="space-y-10">
              {filteredSections.length > 0 ? (
                filteredSections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold tracking-tight">
                      {highlightText(section.title, searchQuery)}
                    </h3>
                    <p className={`text-sm leading-relaxed font-normal whitespace-pre-wrap ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      {highlightText(section.content, searchQuery)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 select-none">
                  <p className="text-sm font-semibold text-neutral-400 mb-1">No results found</p>
                  <p className="text-xs text-neutral-500">
                    We couldn't find any matches for "{searchQuery}" in this policy.
                  </p>
                </div>
              )}
            </div>

            {/* Print button for mobile */}
            <div className="md:hidden pt-8 border-t border-dashed border-neutral-300/30">
              <button
                onClick={handlePrint}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-white/[0.15] bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/[0.25] shadow-sm' 
                    : 'border-neutral-300 bg-[#e9e6dc]/30 text-neutral-800 hover:text-neutral-950 hover:bg-neutral-200 hover:border-neutral-400 shadow-sm'
                }`}
              >
                <Printer className="w-4 h-4 text-neutral-500" />
                Print Document
              </button>
            </div>

            {/* Verification Tag */}
            <div className={`pt-12 mt-12 border-t flex flex-col sm:flex-row items-center gap-4 transition-colors ${
              theme === 'dark' ? 'border-white/[0.06]' : 'border-neutral-200'
            }`}>
              <div className="p-3 bg-emerald-500/10 rounded-full shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-emerald-500">Verified Compliance Document</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Sylvan complies fully with General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) specifications as a white-labeled host controller.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
