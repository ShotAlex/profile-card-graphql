import { LinkKind, SkillCategory } from '@prisma/client';

/**
 * Source of truth for the business card. Edit this file and restart the
 * container: the seed is idempotent and rewrites the profile in one transaction.
 */
export interface ProfileSeed {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location: string;
  links: { kind: LinkKind; label: string; url: string }[];
  skills: string[];
  experience: {
    company: string;
    position: string;
    context: string;
    start: string; // YYYY-MM
    end: string | null; // YYYY-MM, null = current job
    achievements: string[];
    stack: string[];
  }[];
  projects: { name: string; description: string; url?: string; repoUrl?: string }[];
}

export const SKILL_CATALOG: Record<string, SkillCategory> = {
  TypeScript: 'LANGUAGE',
  'JavaScript (ES6+)': 'LANGUAGE',
  HTML5: 'LANGUAGE',
  CSS3: 'LANGUAGE',
  React: 'FRAMEWORK',
  'Next.js': 'FRAMEWORK',
  Gatsby: 'FRAMEWORK',
  Preact: 'FRAMEWORK',
  'React Native': 'FRAMEWORK',
  MobX: 'STATE_AND_DATA',
  'Redux Toolkit': 'STATE_AND_DATA',
  'RTK Query': 'STATE_AND_DATA',
  Zustand: 'STATE_AND_DATA',
  Zod: 'STATE_AND_DATA',
  GraphQL: 'STATE_AND_DATA',
  'REST API': 'STATE_AND_DATA',
  'SCSS / CSS Modules': 'STYLING',
  'Styled Components': 'STYLING',
  'Tailwind CSS': 'STYLING',
  'Radix UI': 'STYLING',
  Jest: 'TESTING',
  Playwright: 'TESTING',
  ESLint: 'TESTING',
  'Node.js': 'BACKEND',
  NestJS: 'BACKEND',
  PostgreSQL: 'BACKEND',
  'Drizzle ORM': 'BACKEND',
  Prisma: 'BACKEND',
  Docker: 'DEVOPS',
  'GitHub Actions': 'DEVOPS',
  Webpack: 'DEVOPS',
  Vite: 'DEVOPS',
  'Claude Code': 'AI',
  MCP: 'AI',
};

export const OWNER_PROFILE: ProfileSeed = {
  slug: 'aleksandr-shot',
  name: 'Aleksandr Shot',
  headline: 'Senior Frontend / Fullstack Developer · React, TypeScript, Next.js, NestJS',
  description:
    '6 years of commercial development on React and TypeScript, 10+ years in IT, 4 years in fintech building ' +
    'web portals for bank clients, employees and agents. Currently building my own SaaS CRM ucrm.by end to end: ' +
    'Next.js + NestJS + PostgreSQL, from architecture and UI to CI/CD and production.',
  location: 'Minsk, Belarus · remote, open to relocation',
  links: [
    { kind: 'GITHUB', label: 'GitHub', url: 'https://github.com/ShotAlex' },
    { kind: 'TELEGRAM', label: 'Telegram', url: 'https://t.me/AlexandrShot' },
    { kind: 'WEBSITE', label: 'ucrm.by — my SaaS product', url: 'https://ucrm.by' },
  ],
  skills: [
    'TypeScript', 'JavaScript (ES6+)', 'React', 'Next.js', 'NestJS', 'Node.js', 'PostgreSQL', 'Prisma',
    'Drizzle ORM', 'GraphQL', 'REST API', 'MobX', 'Redux Toolkit', 'RTK Query', 'Zustand', 'Zod',
    'SCSS / CSS Modules', 'Tailwind CSS', 'Radix UI', 'Jest', 'Playwright', 'Docker', 'GitHub Actions',
    'Webpack', 'Vite', 'Claude Code', 'MCP',
  ],
  experience: [
    {
      company: 'ucrm.by',
      position: 'Lead Frontend Developer, Product Founder',
      context: 'SaaS CRM for beauty salons, clinics and children centers in Belarus; pilot stage with first clients',
      start: '2026-01',
      end: null,
      achievements: [
        'Designed a ~150,000-line TypeScript monorepo: Next.js 16 + React 19 frontend, NestJS API, shared Zod schemas',
        'Multi-tenant architecture with per-clinic data isolation via PostgreSQL Row Level Security',
        'Found and fixed a production crash: Next.js prefetch fired 52 server renders per screen and exhausted the API rate limit; reduced to 2',
        'CI/CD on GitHub Actions with auto-deploy: types, lint, 515 automated tests, migrations from scratch, Docker images',
        '2FA, roles and permissions, audit log, encrypted backups; bePaid payments, Telegram bot, imports from Excel, YCLIENTS and 1C',
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Drizzle ORM', 'Zod', 'Radix UI', 'Playwright', 'Docker', 'GitHub Actions'],
    },
    {
      company: 'Selecty (outstaffing)',
      position: 'Senior Frontend Developer',
      context: 'Top-10 bank: web application for retail customers and bank employees; team of 8–12 developers',
      start: '2024-09',
      end: '2025-12',
      achievements: [
        'Delivered 14+ customer-facing sections, took part in feature architecture design',
        'Performance: bundle size control, lazy-loaded sections, fewer re-renders and duplicate requests, RTK Query caching, list virtualization',
        'Reduced cyclomatic and cognitive complexity of key components and hooks by up to 60% in some modules',
        'Cross-team code review (50+ PRs per quarter) and shared code standards; upgraded Node.js 16 → 20',
        'Covered 60+ components and hooks with unit tests',
      ],
      stack: ['React', 'TypeScript', 'MobX', 'RTK Query', 'SCSS / CSS Modules', 'Jest'],
    },
    {
      company: 'SSP SOFT',
      position: 'Senior Frontend Developer',
      context: 'Fintech platform: agent and banking portals; team of 6–8 developers',
      start: '2021-12',
      end: '2024-08',
      achievements: [
        'Delivered 16+ customer-facing sections, including full rewrites of legacy modules',
        'Carried out 3 major migrations: React 17 → 18, TypeScript 4 → 5, webpack 4 → 5',
        'Introduced 5+ libraries into a ~120,000-line codebase with architecture rules and docs for each',
        'Reduced complexity of key components and hooks by ~35%',
      ],
      stack: ['React', 'TypeScript', 'MobX', 'RTK Query', 'SCSS / CSS Modules', 'Jest', 'Webpack'],
    },
    {
      company: 'SOLVD',
      position: 'Frontend Developer (lead role)',
      context: 'International gamedev project; sole frontend developer',
      start: '2021-01',
      end: '2021-12',
      achievements: [
        'Chose the stack and designed the architecture',
        'Built and launched 3 products from scratch in 12 months: public website, blog and user account modules',
        'Bi-weekly client demos; cut the change approval cycle to 1–2 days',
      ],
      stack: ['React', 'Gatsby', 'TypeScript', 'MobX', 'GraphQL', 'SCSS / CSS Modules'],
    },
    {
      company: 'TAQTILE',
      position: 'JavaScript Developer',
      context: 'EdTech: web application and browser extension for language learning',
      start: '2020-09',
      end: '2021-01',
      achievements: [
        'Built features and refactored a ~40,000-line codebase; set up CI/CD from scratch',
        'Mentored 2 junior developers and 2 interns',
      ],
      stack: ['React', 'Preact', 'TypeScript', 'MobX', 'Redux Toolkit', 'SCSS / CSS Modules', 'Tailwind CSS'],
    },
  ],
  projects: [
    {
      name: 'ucrm.by',
      description: 'SaaS CRM for salons, clinics and education centers: bookings, clients, cash desk, inventory, payroll, reports',
      url: 'https://ucrm.by',
    },
    {
      name: 'profile-card-graphql',
      description: 'This API: digital business card on NestJS, Prisma, GraphQL and Docker',
      repoUrl: 'https://github.com/ShotAlex/profile-card-graphql',
    },
  ],
};
