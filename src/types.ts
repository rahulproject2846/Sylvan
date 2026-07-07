export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'features' | 'privacy';
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

export interface LeaderboardMember {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  role: string;
  change: 'up' | 'down' | 'stable';
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: string[];
}
