/**
 * @file ComplexityPage.tsx
 *
 * @description
 * An interactive data visualization dashboard mapping Big O Time Complexities.
 * Orchestrates the ElasticSlider state and the ComplexityChart feature component.
 */

import { useState } from 'react';
import ElasticSlider from '../components/ReactBits/ElasticSlider';
import { ComplexityChart } from '../features/complexity/ComplexityChart';

export function ComplexityPage() {
  // Slider state for Maximum N. Default to 10.
  const [maxElements, setMaxElements] = useState(10);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Configuration Header */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <svg
              className="w-8 h-8 text-indigo-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Complexity Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Visualize why algorithmic efficiency matters. Scrub the slider to increase the dataset
            size and watch how quadratic scaling exponentially degrades performance compared to
            linear or log-linear algorithms.
          </p>
        </div>

        <div className="w-full lg:w-72 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <label className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            <span>Max Array Size (N)</span>
            <span className="text-indigo-500 font-mono text-sm sm:text-base">
              {maxElements >= 1000 ? `${(maxElements / 1000).toFixed(0)}k` : maxElements}
            </span>
          </label>
          <div className="px-3 pb-2">
            <ElasticSlider
              startingValue={10}
              maxValue={1000000} // Allows scaling up to 1 Million items
              defaultValue={maxElements}
              isStepped={true}
              stepSize={1000} // Jumps by 1,000 for smooth scrubbing at scale
              className="w-full max-w-none"
              onChange={(value) => setMaxElements(Math.max(10, value))} // Prevent dropping to 0
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <ComplexityChart maxElements={maxElements} />
      </div>
    </div>
  );
}
