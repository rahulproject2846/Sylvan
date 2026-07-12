import { BlogPost, FAQItem, PricingPlan, LeaderboardMember, CourseModule } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'sylvan-vs-platforms',
    title: 'Fora vs Mighty Networks: Full Comparison for Creators & Educators...',
    category: 'Comparisons',
    date: 'Jun 3, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Traditional community tools scatter your audience. Here is why uniting discussions, courses, and events in a beautifully branded home transforms user engagement.',
    content: `
# Fora vs Mighty Networks: Full Comparison for Creators & Educators

As a creator, educator, or coach, your most valuable asset is your community. Yet most creators scatter their community across multiple disconnected platforms:
- **Discussions** on a noisy Discord or Slack server.
- **Courses** on Teachable or Kajabi.
- **Events** on Zoom, Eventbrite, or Google Calendar.
- **Subscriptions** handled on Patreon.

This fragmentation creates a disjointed experience for your members and a massive administrative headache for you.

## Why Scattering Kills Community
When your members have to log into three different websites to read a post, watch a lesson, and attend a live session, **friction skyrockets**. Engagement drops off, members feel overwhelmed, and retention suffers. Sylvan solves this by combining all these utilities into a single, cohesive, premium interface under your own domain name.

### 1. Unified Identity and Single Sign-On (SSO)
On Sylvan, members log in once. They can instantly browse discussion feeds, complete course chapters, and RSVP to upcoming calendar events. No switching tabs, no forgotten passwords.

### 2. Deep Visual Customization
Unlike Discord or Facebook groups, Sylvan doesn't feel like someone else's playground. The visual identity is completely yours. There are no competing brand marks or notifications to distract your audience.

### 3. Integrated Member Economics
By having courses and discussions in the same portal, you can effortlessly lock/unlock specific discussion spaces based on course progression, custom roles, or monthly membership tiers.
    `
  },
  {
    id: 'launch-community-playbook',
    title: 'How to Launch an Online Community in 2026: A Step-by-Step Guide',
    category: 'Guides',
    date: 'Jun 3, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1758521540165-b7e99f9a98ce?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Building a space is only half the battle. Here is a week-by-week guide to welcoming your initial members, structuring discussion circles, and keeping the momentum alive.',
    content: `
# How to Launch an Online Community in 2026: A Step-by-Step Guide

The biggest mistake creators make when launching a community is launching to crickets. A successful community launch requires structured anticipation, direct onboarding, and a warm initial spark.

## Week 1: Define the Purpose and Circle Structure
Before inviting anyone, outline the core circles (channels) in your Sylvan space. Less is more. Start with 3 to 4 essential channels:
- **#announcements** - The single source of truth.
- **#introductions** - Where new members share their background and goals.
- **#general-chat** - Casual day-to-day conversation.
- **#help-and-feedback** - Where members ask for support.

## Week 2: Invite the "Founding 50"
Do not launch to your entire audience at once. Hand-select 10 to 50 highly engaged individuals to be your "Founding Members." 
- Send them a personalized video invitation.
- Explain that they are getting exclusive early access to shape the culture.
- Encourage them to start conversations and answer other members' questions.

## Week 3: Host a Kickoff Event
Leverage Sylvan's built-in Events module to schedule an exclusive "Founding Members Circle" live meetup.
- Keep the event interactive.
- Ask members what challenges they are currently facing.
- Walk them through your upcoming course schedule and circles.

## Week 4: Public Launch & Onboarding Loops
Now, open the floodgates to your broader audience. Ensure your "front door" landing page clearly states the value of joining. As members sign up, direct them straight to the introductions circle to start building momentum.
    `
  },
  {
    id: 'art-of-white-labeling',
    title: 'Best White-Label Community Platform for Coaches & Educators',
    category: 'Community Building',
    date: 'Jun 3, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Why showing another platform\'s logo to your paying members dilutes your authority. Learn how Sylvan\'s custom domains and hidden platform branding elevate your business.',
    content: `
# Best White-Label Community Platform for Coaches & Educators

When you invite a high-paying coaching client or student into your program, the digital atmosphere should scream *your brand*, not someone else's.

## The Cognitive Cost of Third-Party Branding
When your community space is hosted on a platform covered in their logos, your members are subtly reminded that they are renting space. It lowers the perceived value of your program.

### 1. Elevated Perceived Value
A custom portal running on \`community.yourbrand.com\` with your bespoke warm color schemes and styling feels like a custom-coded proprietary platform. This justifies higher ticket membership tiers.

### 2. Distraction-Free Spaces
Social networks are engineered to steal attention. When your community lives in a dedicated, clean, focused white-labeled environment, member interaction is centered purely on your content and events.

### 3. Full Data Ownership
With Sylvan, you own your member database, activity logs, and analytics. You aren't subject to the algorithmic whim of third-party networks.
    `
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Sylvan?',
    answer: 'Sylvan is an all-in-one community platform for creators, educators, and coaches. It allows you to combine custom discussions, rich multimedia courses, interactive live events, and detailed member lists into a single, fully branded portal under your own custom domain.'
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'How does the custom domain system work?',
    answer: 'Every Sylvan space comes with a free sylvan-saas.vercel.app subdomain (e.g., yourname.sylvan-saas.vercel.app). If you are on our Pro or Enterprise plans, you can map your own completely custom domain (e.g., community.yourname.com) in just a few clicks. Sylvan handles all SSL certificates and routing automatically.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Can I migrate my existing community from Discord, Slack, or Facebook?',
    answer: 'Absolutely! Sylvan offers seamless import tools for member databases, roles, and historical discussions. Our support team can also guide you through migrating course materials from legacy tools like Kajabi or Teachable without any downtime.'
  },
  {
    id: 'faq-4',
    category: 'features',
    question: 'How are courses structured inside Sylvan?',
    answer: 'Our course builder supports rich text, video hosting, audio tracks, and PDF attachments. You can easily drag and drop lessons, split them into sections/chapters, set drip schedules, and restrict course access based on custom user roles or active subscription tiers.'
  },
  {
    id: 'faq-5',
    category: 'features',
    question: 'Are there interactive tools like leaderboards and analytics?',
    answer: 'Yes! Sylvan has a native Gamification and Leaderboard system that ranks members based on posts, replies, course completions, and event RSVPs. You also get detailed insights into daily active members, course completion rates, and event attendance.'
  },
  {
    id: 'faq-6',
    category: 'privacy',
    question: 'How secure is member data?',
    answer: 'We take data privacy and security extremely seriously. All data is encrypted in transit and at rest. Sylvan complies fully with GDPR, CCPA, and standard security guidelines. You retain 100% ownership of your member database and can export it at any time.'
  },
  {
    id: 'faq-7',
    category: 'privacy',
    question: 'What payment processors do you support for memberships?',
    answer: 'We integrate natively with Stripe, PayPal, and Apple Pay. You can charge one-time fees, recurring monthly/annual subscriptions, or set up flexible installment plans. Sylvan charges 0% transaction fees on all plans—you only pay the standard processor fees.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'STARTER',
    price: '$9',
    period: '/month',
    description: 'Everything you need to launch your community.',
    buttonText: 'Get Started',
    features: [
      'Up to 200 members',
      'Sylvan subdomain',
      'Community feed & chat',
      'Courses & events',
      'Member profiles',
      'Analytics'
    ]
  },
  {
    name: 'PRO',
    price: '$19',
    period: '/month',
    description: 'For creators serious about their brand.',
    buttonText: 'Get Started',
    isPopular: true,
    features: [
      'Up to 5000 members',
      'Custom domain',
      'Community feed & chat',
      'Courses & events',
      'Member profiles',
      'Analytics'
    ]
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom price',
    period: '',
    description: 'For teams that need more control.',
    buttonText: 'Contact us',
    features: [
      'Unlimited members',
      'Everything in Pro',
      'Priority support',
      'Dedicated onboarding',
      'SLA & uptime guarantee',
      'Custom contract'
    ]
  }
];

export const LEADERBOARD_MEMBERS: LeaderboardMember[] = [
  {
    rank: 1,
    name: 'Alex Kim',
    points: 3842,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'Product',
    change: 'up'
  },
  {
    rank: 2,
    name: 'Morgan Reed',
    points: 3120,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'Writing',
    change: 'up'
  },
  {
    rank: 3,
    name: 'Sam Jordan',
    points: 2905,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'Design',
    change: 'stable'
  },
  {
    rank: 4,
    name: 'Taylor Chen',
    points: 1200,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    role: 'Design',
    change: 'down'
  }
];

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'm-1',
    title: 'The Product Mindset',
    duration: '2 min',
    lessons: [
      'Welcome & Core Philosophies',
      'Defining Your Ideal User Persona',
      'Mapping the Solution Space',
      'Design Fidelity vs. Delivery Speed'
    ]
  },
  {
    id: 'm-2',
    title: 'Visual Hierarchy & Space',
    duration: '5 min',
    lessons: [
      'The Power of Negative Space',
      'Sizing & Scale Relationships',
      'Developing a Consistent Color System',
      'Typography Selection and Contrast'
    ]
  },
  {
    id: 'm-3',
    title: 'UX Flow and Interactivity',
    duration: '4 min',
    lessons: [
      'Designing Purposeful Micro-interactions',
      'Smooth Page & Module Transitions',
      'Ensuring High Usability & Accessibility',
      'Feedback Loops & User Motivation'
    ]
  }
];
