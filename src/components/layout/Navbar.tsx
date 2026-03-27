/**
 * @file Navbar.tsx
 *
 * @description
 * The global navigation component for the application. It provides routing links,
 * brand identity, and houses the global theme toggle control.
 *
 * @architecture
 * MOBILE-FIRST RESPONSIVENESS:
 * The navigation bar employs Tailwind's breakpoint system (`md:`) to seamlessly
 * transition between a horizontal desktop layout and a collapsible mobile dropdown menu.
 * State management (`isMobileMenuOpen`) controls the visibility of the hamburger menu.
 * * ROUTE AWARENESS:
 * Utilizes `react-router-dom`'s `useLocation` hook to determine the current active
 * path, dynamically applying visual highlighting to the active navigational link
 * to orient the user.
 * * THEME INTEGRATION:
 * Acts as the primary UI consumer of the `ThemeContext`. It triggers the global
 * Dark/Light mode View Transition animation and swaps its own SVG icons based on
 * the current active theme.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  // Consume global theme state and routing location
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Local state for the mobile hamburger menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Helper to determine if a navigation link is the currently active page.
   * @param path - The route path to check against.
   * @returns boolean true if active
   */
  const isActive = (path: string) => location.pathname === path;

  /**
   * Closes the mobile menu. Fired when a user clicks a link inside the dropdown.
   */
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <div className="w-8 h-8 rounded bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              AlgoVis
            </span>
          </Link>

          {/* Desktop Navigation Links (Hidden on screens smaller than 'md') */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1 ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/visualizer"
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-1 ${
                isActive('/visualizer')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Visualizer
            </Link>
          </div>

          {/* Right-side Controls: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Animated Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Dark Mode"
            >
              {/* Sun Icon (Light Mode) */}
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
              {/* Moon Icon (Dark Mode) */}
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

            {/* Hamburger Menu Button (Visible only on mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Mobile Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> // X Icon
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /> // Menu Icon
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            onClick={closeMenu}
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/')
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            Home
          </Link>
          <Link
            onClick={closeMenu}
            to="/visualizer"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/visualizer')
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            Visualizer
          </Link>
        </div>
      )}
    </nav>
  );
}
