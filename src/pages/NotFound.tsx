/**
 * @file NotFound.tsx
 * * @description
 * Global 404 Error Page / Catch-All Route component.
 * * WHY THIS EXISTS:
 * When a user navigates to a URL that does not match any defined routes in App.tsx
 * (e.g., /random-gibberish), React Router will still render the AppLayout (Navbar & Footer),
 * but the main content area will be completely empty.
 * * This component acts as the safety net. By placing it at the very bottom of the <Routes>
 * list with the path="*", it catches any unrecognized URLs and displays a friendly,
 * on-theme error message rather than a broken, empty screen.
 */

import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
      <div className="text-blue-500 font-mono font-bold tracking-widest mb-2">ERROR 404</div>
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        Page Not Found
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, or the URL might be
        incorrect.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}
