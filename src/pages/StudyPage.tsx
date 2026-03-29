/**
 * @file StudyPage.tsx
 *
 * @description
 * The "Code Studio" page — an educational mode that locks the array size (N=24)
 * and speed (450ms) to provide a clear, step-by-step visualization of sorting
 * algorithms alongside live, multi-language code highlighting.
 *
 * Layout (top to bottom):
 *   1. Header row  — title, algorithm selector, play/pause/step/reset, status badge
 *   2. Split viewport — canvas (2/5) | CodePanel (3/5)
 *   3. Info strip  — live metrics, complexity badges, cross-link to /visualizer
 *   4. Educational module — ParticleCard bento grid with algorithm deep-dives
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSortEngine } from '../hooks/useSortEngine.ts';
import { CanvasVisualizer } from '../features/visualizer/CanvasVisualizer.tsx';
import { CodePanel } from '../features/study/CodePanel.tsx';
import { ParticleCard } from '../components/ReactBits/MagicBento.tsx';
import type { SortAlgorithm } from '../types/sort.ts';

// Import generators
import { bubbleSort } from '../algorithms/bubbleSort.ts';
import { insertionSort } from '../algorithms/insertionSort.ts';
import { selectionSort } from '../algorithms/selectionSort.ts';
import { mergeSort } from '../algorithms/mergeSort.ts';
import { quickSort } from '../algorithms/quickSort.ts';
import { heapSort } from '../algorithms/heapSort.ts';
import { countingSort } from '../algorithms/countingSort.ts';
import { radixSort } from '../algorithms/radixSort.ts';

// ─── Algorithm roster ─────────────────────────────────────────────────────────

interface StudyAlgorithm extends SortAlgorithm {
  id: string;
}

const STUDY_ALGORITHMS: StudyAlgorithm[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    generator: bubbleSort,
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    generator: quickSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    generator: mergeSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    generator: insertionSort,
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    generator: selectionSort,
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    generator: heapSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    generator: countingSort,
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    generator: radixSort,
    complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
  },
];

// ─── Educational content ──────────────────────────────────────────────────────

interface AlgorithmEducation {
  intuition: string;
  keyInsight: string;
  howItWorks: string[];
  stability: 'Stable' | 'Unstable';
  inPlace: boolean;
  spaceComplexity: string;
  useCases: string[];
}

const EDUCATION: Record<string, AlgorithmEducation> = {
  bubble: {
    intuition:
      'Imagine bubbles rising in water — large values "bubble up" to their final position with each pass through the array.',
    keyInsight:
      'After each full pass, the largest unsorted element is guaranteed to be in its correct position, so the inner loop can shrink by one each time.',
    howItWorks: [
      'Start at the beginning of the array.',
      'Compare each adjacent pair of elements.',
      'Swap them if the left is greater than the right.',
      'Repeat until a full pass produces zero swaps.',
    ],
    stability: 'Stable',
    inPlace: true,
    spaceComplexity: 'O(1)',
    useCases: [
      'Nearly sorted datasets',
      'Teaching and demonstration',
      'Tiny arrays (< 10 elements)',
    ],
  },
  quick: {
    intuition:
      'Choose a "pivot" element, partition everything smaller to the left and everything larger to the right, then recursively sort each side.',
    keyInsight:
      'Each partition step places the pivot in its exact final position. On average, partitions are balanced, giving O(n log n) despite an O(n²) worst case.',
    howItWorks: [
      'Pick a pivot (commonly the last element).',
      'Rearrange: elements < pivot go left, elements > pivot go right.',
      'The pivot is now in its sorted position.',
      'Recursively apply to the left and right sub-arrays.',
    ],
    stability: 'Unstable',
    inPlace: true,
    spaceComplexity: 'O(log n) stack',
    useCases: [
      'General-purpose sorting',
      'When average performance matters more than worst-case',
      'Cache-friendly in-memory sorts',
    ],
  },
  merge: {
    intuition:
      'Divide the array in half repeatedly until you have single elements, then merge pairs back together in sorted order.',
    keyInsight:
      'Merging two already-sorted arrays takes only O(n) time. This is the insight that makes divide-and-conquer work: easy to merge, hard to sort.',
    howItWorks: [
      'Recursively split the array into halves.',
      'Base case: a single element is already sorted.',
      'Merge two sorted halves by comparing front elements.',
      'Concatenate remaining elements from either half.',
    ],
    stability: 'Stable',
    inPlace: false,
    spaceComplexity: 'O(n)',
    useCases: [
      'Linked list sorting',
      'External sorting (disk data)',
      'When stability is required',
      'Guaranteed O(n log n)',
    ],
  },
  insertion: {
    intuition:
      'Think of sorting a hand of playing cards — pick up each card and slide it left until it is in the right position relative to those already held.',
    keyInsight:
      'The left portion of the array is always sorted. Each new element only needs to travel far enough left to find its correct slot.',
    howItWorks: [
      'Start with the second element (first is trivially sorted).',
      'Save the current element as "key".',
      'Shift all larger sorted elements one position right.',
      'Insert the key into the gap that opens up.',
    ],
    stability: 'Stable',
    inPlace: true,
    spaceComplexity: 'O(1)',
    useCases: [
      'Nearly sorted arrays (approaches O(n))',
      'Online algorithms (sort as data arrives)',
      'Small arrays as a base case in hybrid sorts',
    ],
  },
  selection: {
    intuition:
      'Scan the entire unsorted region to find the minimum, place it at the front, and repeat — always "selecting" the next smallest element.',
    keyInsight:
      'Selection Sort makes exactly n−1 swaps regardless of input — ideal when write operations are expensive (e.g., flash memory).',
    howItWorks: [
      'Find the minimum element in the unsorted portion.',
      'Swap it with the first unsorted element.',
      'Advance the sorted boundary by one.',
      'Repeat until the entire array is sorted.',
    ],
    stability: 'Unstable',
    inPlace: true,
    spaceComplexity: 'O(1)',
    useCases: [
      'When memory writes are costly',
      'Small arrays where simplicity matters',
      'Situations requiring minimal swaps',
    ],
  },
  heap: {
    intuition:
      'Build a max-heap (a tree where every parent is larger than its children), then repeatedly extract the root (the maximum) to build the sorted array.',
    keyInsight:
      'A heap gives O(log n) extraction of the maximum. Combined with O(n) heap construction, the total is O(n log n) with O(1) extra space.',
    howItWorks: [
      'Build a max-heap in-place using heapify.',
      'Swap the root (max) with the last element.',
      'Reduce the heap size by one.',
      'Heapify the root to restore the heap property.',
    ],
    stability: 'Unstable',
    inPlace: true,
    spaceComplexity: 'O(1)',
    useCases: [
      'When O(1) space and O(n log n) worst-case are both required',
      'Priority queue implementations',
      'Systems with strict memory constraints',
    ],
  },
  counting: {
    intuition:
      'Instead of comparing elements, count how many of each value exist, then reconstruct the sorted array from the counts.',
    keyInsight:
      'Counting Sort sidesteps the O(n log n) comparison lower bound entirely — when the value range k is small, it runs in O(n + k) linear time.',
    howItWorks: [
      'Find the maximum value k in the array.',
      'Create a count array of size k+1, initialised to zero.',
      'Count occurrences: count[value]++.',
      'Apply prefix sums so count[i] holds the output position.',
      'Place each element at its computed position.',
    ],
    stability: 'Stable',
    inPlace: false,
    spaceComplexity: 'O(k)',
    useCases: [
      'Integer arrays with small range',
      'Frequency counting problems',
      'As a sub-routine in Radix Sort',
    ],
  },
  radix: {
    intuition:
      'Sort numbers digit by digit — from the least significant to the most significant — using a stable sub-sort at each digit position.',
    keyInsight:
      'Because each pass uses a stable sort, the relative order of elements with the same digit is preserved, so earlier-pass orderings accumulate correctly.',
    howItWorks: [
      'Start with the ones digit (exp = 1).',
      'Apply a stable counting sort based on that digit.',
      'Move to the next digit (exp × 10).',
      'Repeat until all digits have been processed.',
    ],
    stability: 'Stable',
    inPlace: false,
    spaceComplexity: 'O(n + k)',
    useCases: [
      'Sorting large integers or fixed-length strings',
      'When key size d is bounded',
      'Telephone number or postcode sorting',
    ],
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STUDY_ARRAY_SIZE = 14;
const STUDY_SPEED_MS = 450;
const PARTICLE_GLOW = '59, 130, 246'; // blue-500

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StudyPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('bubble');
  const [baseArray, setBaseArray] = useState<number[]>(() => generateArray(STUDY_ARRAY_SIZE));

  const activeAlgorithm = useMemo(
    () => STUDY_ALGORITHMS.find((a) => a.id === selectedAlgoId) ?? STUDY_ALGORITHMS[0],
    [selectedAlgoId]
  );

  const { state, play, pause, step, reset, setSpeed } = useSortEngine(activeAlgorithm, {
    array: baseArray,
    speed: STUDY_SPEED_MS,
  });

  // Lock the speed so the code panel is always readable
  useEffect(() => {
    setSpeed(STUDY_SPEED_MS);
  }, [setSpeed]);

  const handleGenerateNew = () => {
    const newArr = generateArray(STUDY_ARRAY_SIZE);
    setBaseArray(newArr);
    reset(newArr);
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgoId(e.target.value);
    const newArr = generateArray(STUDY_ARRAY_SIZE);
    setBaseArray(newArr);
    reset(newArr);
  };

  const education = EDUCATION[selectedAlgoId];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* ── 1. HEADER ROW ──────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                Code Studio
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                Live execution · N={STUDY_ARRAY_SIZE}
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
            <select
              value={selectedAlgoId}
              onChange={handleAlgorithmChange}
              disabled={state.status === 'running'}
              className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base font-semibold disabled:opacity-50 outline-none focus:border-blue-500 transition-colors"
            >
              {STUDY_ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>

            {/* Status badge */}
            <span
              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${
                state.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : state.status === 'running'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : state.status === 'paused'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {state.status}
            </span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 w-full lg:w-auto">
          {state.status !== 'running' ? (
            <button
              onClick={play}
              disabled={state.status === 'completed'}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-base font-bold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-base font-bold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Pause
            </button>
          )}
          <button
            onClick={step}
            disabled={state.status === 'running' || state.status === 'completed'}
            className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-white text-xs sm:text-base font-bold rounded-lg transition-colors"
          >
            Step
          </button>
          <button
            onClick={handleGenerateNew}
            className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs sm:text-base font-bold rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── 2. SPLIT VIEWPORT ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[450px] md:h-[60vh] lg:h-[62vh]">
        {/* Canvas (2/5) */}
        <div className="w-full md:w-2/5 h-[250px] sm:h-[300px] md:h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-2 sm:p-4 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <CanvasVisualizer
              array={state.array}
              activeIndices={state.activeIndices}
              operation={state.currentOperation}
              containerHeightOverride="h-full absolute inset-0"
            />
          </div>
        </div>

        {/* Code Panel (3/5) */}
        <div className="w-full md:w-3/5 h-[350px] sm:h-[450px] md:h-full min-w-0">
          <CodePanel algorithmId={selectedAlgoId} activeOperation={state.currentOperation} />
        </div>
      </div>

      {/* ── 3. INFO STRIP ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Live metrics + complexity */}
        <div className="flex-1 bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 min-w-0">
          <div className="flex gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-start px-1 sm:px-0">
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Comparisons
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {state.metrics.comparisons}
              </div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Swaps / Writes
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {state.metrics.swaps + state.metrics.overwrites}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
            {[
              {
                label: 'Best',
                value: activeAlgorithm.complexity.best,
                colour: 'text-emerald-600 dark:text-emerald-400',
              },
              {
                label: 'Avg',
                value: activeAlgorithm.complexity.average,
                colour: 'text-blue-600 dark:text-blue-400',
              },
              {
                label: 'Worst',
                value: activeAlgorithm.complexity.worst,
                colour: 'text-red-600 dark:text-red-400',
              },
            ].map(({ label, value, colour }) => (
              <div
                key={label}
                className="px-1.5 sm:px-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-center flex-1 min-w-0"
              >
                <div
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider mb-1 ${colour}`}
                >
                  {label}
                </div>
                <div className={`text-[10px] sm:text-xs font-bold font-mono truncate ${colour}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to full Visualizer */}
        <Link
          to="/visualizer"
          className="w-full md:w-64 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-5 rounded-2xl text-white flex flex-col justify-center group hover:from-blue-500 hover:to-indigo-600 transition-all hover:-translate-y-0.5 shadow-sm shrink-0"
        >
          <div className="text-[9px] sm:text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">
            Scale up
          </div>
          <div className="text-sm sm:text-base font-black leading-tight flex items-center justify-between gap-2">
            Test with 1,000 items
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* ── 4. EDUCATIONAL MODULE (ParticleCard bento) ─────────────────────── */}
      {education && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white">
              {activeAlgorithm.name} — Deep Dive
            </h2>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <div className="hidden xs:flex gap-1 sm:gap-2">
              <span
                className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${
                  education.stability === 'Stable'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                }`}
              >
                {education.stability}
              </span>
              <span
                className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${
                  education.inPlace
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {education.inPlace ? 'In-place' : 'Extra space'}
              </span>
            </div>
          </div>

          <style>{`
            .edu-card {
              --glow-x: 50%; --glow-y: 50%;
              --glow-intensity: 0; --glow-radius: 200px;
            }
            .edu-card::after {
              content: '';
              position: absolute;
              inset: 0;
              padding: 6px;
              background: radial-gradient(
                var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${PARTICLE_GLOW}, calc(var(--glow-intensity) * 0.5)) 0%,
                rgba(${PARTICLE_GLOW}, calc(var(--glow-intensity) * 0.2)) 35%,
                transparent 65%
              );
              border-radius: inherit;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask-composite: exclude;
              pointer-events: none;
              z-index: 1;
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Intuition */}
            <ParticleCard
              glowColor={PARTICLE_GLOW}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              className="edu-card col-span-1 md:col-span-2 p-3.5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full min-w-0"
            >
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[7px] sm:text-[8px]">
                  💡
                </span>
                Intuition
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[10px] sm:text-sm leading-relaxed font-medium">
                {education.intuition}
              </p>
              <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1.5 sm:mb-2">
                  Key insight
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[10px] sm:text-sm leading-relaxed">
                  {education.keyInsight}
                </p>
              </div>
            </ParticleCard>

            {/* How it works */}
            <ParticleCard
              glowColor={PARTICLE_GLOW}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              className="edu-card p-3.5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full min-w-0"
            >
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 sm:mb-3">
                How it works
              </div>
              <ol className="space-y-1.5 sm:space-y-2.5">
                {education.howItWorks.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-2 sm:gap-3 text-[10px] sm:text-sm text-slate-600 dark:text-slate-400 leading-snug"
                  >
                    <span className="shrink-0 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[8px] sm:text-[10px] font-black mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </ParticleCard>

            {/* Use cases + space */}
            <ParticleCard
              glowColor={PARTICLE_GLOW}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              className="edu-card p-3.5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full min-w-0"
            >
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 sm:mb-3">
                Use cases
              </div>
              <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-5">
                {education.useCases.map((uc, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-slate-600 dark:text-slate-400"
                  >
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {uc}
                  </li>
                ))}
              </ul>
              <div className="pt-2.5 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 sm:mb-2">
                  Space complexity
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-[10px] sm:text-sm">
                  {education.spaceComplexity}
                </span>
              </div>
            </ParticleCard>
          </div>
        </div>
      )}
    </div>
  );
}
