/**
 * @file Navbar.tsx
 * @description The global navigation wrapper that cleanly integrates the GSAP PillNav and our Theme Toggle.
 */
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import PillNav from '../ReactBits/PillNav';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Visualizer', href: '/visualizer' },
    { label: 'Race Mode', href: '/race' },
    { label: 'Code Studio', href: '/study' },
    { label: 'Big O Dashboard', href: '/complexity' },
  ];

  const pillColors =
    theme === 'dark'
      ? { base: '#1e293b', pill: '#020617', hoverText: '#ffffff', pillText: '#94a3b8' } // slate
      : { base: '#cbd5e1', pill: '#ffffff', hoverText: '#ffffff', pillText: '#475569' };

  // Pass the actual SVG directly
  const NativeLogo = (
    <div className="flex items-center gap-3">
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
      {/* The Brand Name (Dynamically colored to match the GSAP theme) */}
      <span className="font-bold text-[18px] tracking-tight" style={{ color: pillColors.pillText }}>
        AlgoVis
      </span>
    </div>
  );

  return (
    <div className="w-full flex justify-center pt-4 px-4 relative z-50">
      <div className="w-full max-w-7xl">
        <PillNav
          logo={NativeLogo}
          items={navItems}
          activeHref={location.pathname}
          baseColor={pillColors.base}
          pillColor={pillColors.pill}
          hoveredPillTextColor={pillColors.hoverText}
          pillTextColor={pillColors.pillText}
        >
          {/*Inject the Theme Toggle natively into the PillNav's flexbox container */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center w-10.5 h-10.5 rounded-full bg-slate-200 dark:bg-slate-800 shadow-sm hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            aria-label="Toggle Dark Mode"
          >
            <svg
              className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 ease-in-out ${theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg
              className={`absolute w-5 h-5 text-blue-400 transition-all duration-500 ease-in-out ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </PillNav>
      </div>
    </div>
  );
}
