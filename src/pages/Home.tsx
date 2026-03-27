import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in zoom-in-95 duration-700">
      {/* Badge */}
      <div className="mb-6 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide border border-blue-200 dark:border-blue-800/50">
        v1.0.0 GPU-Accelerated
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
        Sorting <span className="text-blue-600 dark:text-blue-500">Visualized.</span>
      </h1>

      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
        A high-performance engine rendering 8 distinct sorting algorithms at 60 frames per second.
        Built to demonstrate advanced data structures and modern React architecture.
      </p>

      <div className="flex gap-4">
        <Link
          to="/visualizer"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-900/50"
        >
          Launch Engine
        </Link>
      </div>
    </div>
  );
}
