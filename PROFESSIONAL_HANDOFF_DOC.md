# Sylvan SaaS Landing Page — Main Architecture + Animation Handoff

(টিম/হ্যান্ডঅফ ডকুমেন্ট)

## 0) প্রজেক্ট ওভারভিউ
- **Stack**: React + TypeScript + Vite + TailwindCSS + `motion/react` (Framer Motion ফ্যামিলি)
- **মেইন এন্ট্রি**: `index.html` → `/src/main.tsx` → `src/App.tsx`
- **UI কম্পোনেন্টস**: `src/components/*`
- **স্টাইলিং**: Tailwind + `src/index.css`
- **ডেটা**: `src/data.ts`

### ফ্লো (High-level)
1. `index.html` এ base HTML skeleton থাকে, তারপর Vite React render করে
2. `src/main.tsx` এ `App` রেন্ডার হয়
3. `src/App.tsx` পুরো পেজ UI/স্টেট/অ্যানিমেশন অর্কেস্ট্রেট করে
4. `Header`, `Footer`, `MouseFollower`, `Typewriter`, ইত্যাদি কম্পোনেন্ট UI সাবসেকশনে ব্যবহৃত হয়

---

## 1) Favicon — Location & কোড
- **Favicon ফাইল**: `src/assets/images/favicon-48x48.png`
- **কোড ইনসার্টেড ফাইল**: `index.html`
- **Link ট্যাগ**:
```html
<link rel="icon" type="image/png" sizes="48x48" href="/src/assets/images/favicon-48x48.png" />
```

---

## 2) গুরুত্বপূর্ণ ডিরেক্টরি/ফাইলসমূহ

### Root
- `index.html`
- `vite.config.ts`
- `package.json`

### App/Rendering
- `src/main.tsx` — React root bootstrap
- `src/App.tsx` — পেজের প্রধান স্টেট + UI + অ্যানিমেশন হাব

### Components
- `src/components/Header.tsx` — sticky header + navigation + mobile drawer
- `src/components/Footer.tsx` — footer layout + policies/open modal hooks
- `src/components/MouseFollower.tsx` — cursor-follow ambient glow (motion)
- `src/components/Typewriter.tsx` — word-by-word typing animation
- `src/components/PolicyPage.tsx`, `StyleGuidePage.tsx`

### Data
- `src/data.ts` — blog posts, FAQ, pricing plans, leaderboard, modules

### Utilities
- `src/lib/scroll.ts` — smooth scroll helpers

---

## 3) App.tsx — Core Architecture

### 3.1 App State (UI Logic Central)
`src/App.tsx` এ multiple interactive স্টেট ম্যানেজ করা হয়:
- **Theme**: `'dark' | 'light'`
  - `localStorage` এ persist করা
  - `document.documentElement` এ class swap
- **Routing/Pages**: `currentPage` (`landing` | `behance`)
- **Mobile Menu**: `mobileMenuOpen`
- **Join Modal**: `joinModalOpen`, `selectedPlan`, `registrationSuccess`, `userEmail`, `userName`
- **Interactive Hero Mockups**:
  - `activeHeroTab` এবং `prevHeroTab` (slide direction)
  - hero chat text/messages
  - hero course module expansion
  - hero events RSVP map
- **Core Features Tabs**:
  - `activeCoreTab`, `prevCoreTab`, `autoPlayDashboard`
  - autoplay cycle effect
- **FAQ Accordion**:
  - `activeFaqCategory`
  - `openFaqId`

### 3.2 Motion/Animation Patterns
App এ animation নিয়মাবলি বারবার ব্যবহার করা হয়:
- **Stagger variants** (hero/blog/pricing/faq)
- **Slide variants**:
  - `enter`: direction অনুযায়ী x offset + opacity 0
  - `center`: x=0 + opacity 1 (spring)
  - `exit`: direction অনুযায়ী reverse offset + opacity 0

### 3.3 Performance Considerations (যেভাবে করা হয়েছে)
- `useEffect` দিয়ে section ভিত্তিক scroll tracking
- `requestAnimationFrame` দিয়ে scroll updates batch করার চেষ্টা
- `pointer-events-none` / `select-none` দিয়ে decorative layer-এর cost কমানো
- `AnimatePresence mode="wait"` ব্যবহার করে transitions নিয়ন্ত্রিত করা

---

## 4) Component-level Architecture

### 4.1 `Header.tsx`
- **Sticky**: `fixed top-0` + `backdrop-blur` + border transition
- **Props-driven**:
  - `theme`, `toggleTheme`, `isScrolled`, `activeSection`
  - `mobileMenuOpen`, `setMobileMenuOpen`
  - `handleOpenJoinModal`
  - `currentPage`, `setCurrentPage`
- **Navigation**:
  - `handleNavClick(id)` এ section scroll করার আগে mobile drawer close করা
  - `smoothScrollTo` ব্যবহৃত

### 4.2 `Footer.tsx`
- **Policies/Links**: buttons থেকে parent handler কল
- **Scroll to sections**: `scrollToSection(id)`

### 4.3 `MouseFollower.tsx`
- `useMotionValue` + `useSpring` দিয়ে cursor smoothing
- 3-layer glow:
  - 80px / 160px / 240px ambient blobs
- `theme` অনুযায়ী text/currentColor টোন

### 4.4 `Typewriter.tsx`
- props ভিত্তিতে typing/deleting/pause
- hero headline + অন্যান্য জায়গায় reused

---

## 5) Animation Map (কোথায় কী ধরনের animation)

### 5.1 Hero
- **FloatingDecoration**: icons গুলো ধীরে rotate + float loop
- **Typewriter headline**: word cycling
- **Glass + UI cards**: `motion.div` hover scale/spring

### 5.2 Core Features Dashboard (Mockup)
- Tab change এ **slide in/out direction**:
  - `prevCoreTab` vs `activeCoreTab` দিয়ে direction set
- Tabs autoplay effect:
  - interval 5500ms
  - user interaction হলে `autoPlayDashboard=false`

### 5.3 FAQ Accordion
- `AnimatePresence` + height auto expand/collapse
- category switch এ accordion reset pattern

### 5.4 Footer/Global
- Cursor-follow ambient glow

---

## 6) How To Add New Feature / Animation (Guidelines)

### 6.1 New Interactive Section যোগ করতে চাইলে
1. `App.tsx` এ নতুন state তৈরি করুন
2. নতুন motion variants/handlers লিখুন (যদি reuse দরকার হয়, helper হিসেবে ভেঙে দিন)
3. Child components তৈরি করলে props দিয়ে state pass করুন
4. Ensure transitions `AnimatePresence` দিয়ে stable থাকে

### 6.2 Animation best practices
- decorative element এ `pointer-events-none` দিন
- opacity/transform animate করুন (layout thrash কম)
- `useEffect` interval/timeout পরিষ্কার করুন (cleanup)
- heavy animations এ `once: true` বা viewport-based trigger ব্যবহার করুন

---

## 7) Handoff Checklist (ডেভ-টু-ডিজাইন)

### Must verify after edits
- Theme switch এ সব section class আপডেট হচ্ছে কি না
- Header/Scroll active state ঠিক আছে কি না
- Modal open/close flow (Escape key সহ) ঠিক কাজ করছে কি না
- Favicon cache refresh হয়েছে কি না

### Quick QA steps
1. Dark→Light টগল
2. Hero tabs cycle + user override
3. FAQ category change
4. Blog card open modal

---

## 8) English “Architecture Notes” (Design/Dev Handoff)
- `App.tsx` acts as the main orchestrator: owns UI state, routing, and animation direction logic.
- `Header` and `Footer` are controlled components driven by props from `App`.
- Animations are centralized through local `variants` objects and reusable helpers like slide variants.
- Performance is managed via `requestAnimationFrame` scroll updates, `viewport.once` triggers, and avoiding pointer interaction on decorative layers.

---

## Appendix — Key Files
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/MouseFollower.tsx`
- `src/components/Typewriter.tsx`
- `src/data.ts`
- `src/lib/scroll.ts`

