/**
 * @file Home.tsx
 * @description The landing page featuring a full-screen hero and a smooth-scrolling feature grid.
 */
import { Link } from 'react-router-dom';
import DecryptedText from '../components/ReactBits/DecryptedText';
import ScrollFloat from '../components/ReactBits/ScrollFloat';
import MagicBento from '../components/ReactBits/MagicBento';

export function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION*/}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden -mt-16 pt-16">
        {/* Subtle CSS Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="mb-6 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide border border-blue-200 dark:border-blue-800/50 shadow-sm backdrop-blur-sm z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          v1.0.0 GPU-Accelerated
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 z-10">
          <DecryptedText
            text="Sorting Visualized."
            animateOn="inViewHover"
            sequential={true}
            speed={75}
            maxIterations={25}
            parentClassName="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 pb-2 cursor-default"
          />
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
          A high-performance engine rendering 8 distinct algorithms at 60 frames per second. Watch
          arrays organize themselves in real-time.
        </p>

        <div className="z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards flex gap-4">
          <Link
            to="/visualizer"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg transition-all shadow-xl hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Engine
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-500 dark:to-indigo-500" />
          </Link>
        </div>

        <a
          href="#features"
          aria-label="Scroll to features"
          className="absolute bottom-8 z-20 animate-bounce p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/*FEATURES SECTION*/}
      <section
        id="features"
        className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="text-center mb-16">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top bottom-=10%"
            scrollEnd="bottom center"
            stagger={0.03}
            containerClassName="mb-4"
            textClassName="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Under the Hood
          </ScrollFloat>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore the architecture powering the visualizer, from GPU rendering to experimental
            audio synthesis modules.
          </p>
        </div>

        {/* Dark surface wraps MagicBento so the dark cards sit on a matching bg */}
        <div className="rounded-3xl bg-[#06000f] p-6 sm:p-8 shadow-2xl ring-1 ring-white/5">
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableMagnetism={true}
            clickEffect={true}
            enableTilt={false}
            textAutoHide={false}
          />
        </div>
      </section>
    </div>
  );
}
