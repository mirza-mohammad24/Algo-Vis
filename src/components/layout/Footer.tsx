/**
 * @file Footer.tsx
 * @description The global footer for the application.
 */

import { Link } from 'react-router-dom';
import LogoLoop from '../ReactBits/LogoLoop.tsx';
import type { LogoItem } from '../ReactBits/LogoLoop.tsx';

const TECH_LOGOS: LogoItem[] = [
  {
    node: <span className="text-xl font-black tracking-tighter text-blue-400">React</span>,
    title: 'React',
  },
  {
    node: <span className="text-xl font-bold tracking-tight text-sky-400">Tailwind CSS</span>,
    title: 'Tailwind',
  },
  {
    node: <span className="text-xl font-bold tracking-tight text-blue-500">TypeScript</span>,
    title: 'TypeScript',
  },
  { node: <span className="text-xl font-black italic text-purple-500">Vite</span>, title: 'Vite' },
  {
    node: <span className="text-xl font-black tracking-widest text-emerald-500">GSAP</span>,
    title: 'GSAP',
  },
  {
    node: <span className="text-xl font-bold tracking-tighter text-indigo-400">Framer Motion</span>,
    title: 'Framer',
  },
  {
    node: <span className="text-xl font-medium tracking-tight text-orange-500">Recharts</span>,
    title: 'Recharts',
  },
];

export function Footer() {
  return (
    <footer className="w-full relative bg-white dark:bg-[#06000f] mt-auto">
      {/* Cinematic Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand & Status Column */}
          <div className="space-y-6">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mb-2">
                <svg
                  className="w-8 h-8 rounded-lg shadow-sm"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="7" fill="#0f172a" />
                  <rect x="3" y="21" width="5" height="8" rx="1.5" fill="#3b82f6" />
                  <rect x="10" y="15" width="5" height="14" rx="1.5" fill="#6366f1" />
                  <rect x="17" y="9" width="5" height="20" rx="1.5" fill="#818cf8" />
                  <rect x="24" y="3" width="5" height="26" rx="1.5" fill="#a5b4fc" />
                  <rect x="3" y="28" width="26" height="1.5" rx="0.75" fill="#334155" />
                </svg>
                AlgoVis
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                A high-performance algorithm visualization engine built to make computer science
                intuitive, interactive, and beautifully chaotic.
              </p>
            </div>

            {/* SaaS Style System Status Pulse */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 w-fit cursor-default"
              title="Engine is running smoothly"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                Engine Online
              </span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <li>
                <Link
                  to="/visualizer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Visualizer
                </Link>
              </li>
              <li>
                <Link
                  to="/race"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Race Mode
                </Link>
              </li>
              <li>
                <Link
                  to="/study"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Code Studio
                </Link>
              </li>
              <li>
                <Link
                  to="/complexity"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Big O Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo Loop Column */}
          <div className="overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                Powered By
              </h3>
              <LogoLoop
                logos={TECH_LOGOS}
                speed={40}
                gap={32}
                fadeOut={true}
                className="opacity-60 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Versioning, and Socials */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-4">
            <p className="hover:text-slate-300 cursor-default transition-colors">
              © {new Date().getFullYear()} Mirza Mohammad Abbas.
            </p>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="hover:text-slate-300 cursor-default transition-colors">
              MIT License
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="hover:text-slate-300 cursor-default transition-colors tracking-widest font-mono">
              v1.0.0
            </span>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/mirza-mohammad24/Algo-Vis#"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Source Code</span>
            </a>
            <a
              href="https://linkedin.com/in/mirza-mohammad-abbas"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Developer</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
