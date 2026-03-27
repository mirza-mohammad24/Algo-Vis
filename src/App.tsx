/**
 * @file App.tsx
 *
 * @description
 * The root component of the application.
 */

import { Visualizer } from './features/visualizer/Visualizer';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function TempHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="p-4 flex justify-end max-w-6xl mx-auto">
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
        aria-label="Toggle Dark Mode"
      >
        {/* Sun Icon (Rotates and scales away in dark mode) */}
        <svg
          className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 ease-in-out ${
            theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
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

        {/* Moon Icon (Rotates and scales in for dark mode) */}
        <svg
          className={`absolute w-5 h-5 text-blue-400 transition-all duration-500 ease-in-out ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
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
    </header>
  );
}

function AppLayout() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-12 selection:bg-blue-500/30">
      <TempHeader />
      <Visualizer />
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

export default App;