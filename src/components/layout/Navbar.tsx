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
  ];

  const pillColors =
    theme === 'dark'
      ? { base: '#1e293b', pill: '#020617', hoverText: '#ffffff', pillText: '#94a3b8' } // slate
      : { base: '#cbd5e1', pill: '#ffffff', hoverText: '#ffffff', pillText: '#475569' };

  // Pass the actual SVG directly
  const NativeLogo = (
    <div className="flex items-center gap-2">
      {/* The Gradient Icon Box */}
      <div className="w-6 h-6 rounded bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
      </div>
      {/* The Brand Name (Dynamically colored to match the GSAP theme) */}
      <span className="font-bold text-[16px] tracking-tight" style={{ color: pillColors.pillText }}>
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
