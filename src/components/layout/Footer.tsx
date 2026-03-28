/**
 * @file Footer.tsx
 * @description The global footer for the application.
 */

import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
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
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                AlgoVis
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              A high-performance algorithm visualization engine built to demonstrate modern web
              architecture and data structures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:pl-8">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Navigation
            </h3>
            <Link
              to="/"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/visualizer"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Visualizer Engine
            </Link>
            <Link
              to="/race"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Race Mode
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Built With
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
                React 18
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
                TypeScript
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-800">
                Canvas API
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-500 font-medium">
            &copy; {currentYear} Mirza Mohammad Abbas.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/mirza-mohammad24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/mirza-mohammad-abbas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
