/**
 * @file RacePage.tsx
 *
 * @description
 * Global State Orchestration.
 * Manages the shared dataset, environment variables (speed, size), and the
 * active roster of competitors. Ensures all algorithms receive identical data
 * to guarantee a scientifically fair comparison.
 * Includes Leaderboard logic to rank algorithms by exact completion time.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SortAlgorithm } from '../types/sort.ts';
import ElasticSlider from '../components/ReactBits/ElasticSlider.tsx';

// Import the modularized RaceLane component and its handle interface
import { RaceLane } from '../features/race/RaceLane.tsx';
import type { RaceLaneHandle } from '../features/race/RaceLane.tsx';

//Import all algorithm generators directly
import { bubbleSort } from '../algorithms/bubbleSort.ts';
import { insertionSort } from '../algorithms/insertionSort';
import { selectionSort } from '../algorithms/selectionSort';
import { mergeSort } from '../algorithms/mergeSort.ts';
import { quickSort } from '../algorithms/quickSort.ts';
import { heapSort } from '../algorithms/heapSort';
import { countingSort } from '../algorithms/countingSort';
import { radixSort } from '../algorithms/radixSort';

// Extend the core type locally for the Race environment and Race Lane
export interface RaceAlgorithm extends SortAlgorithm {
  id: string;
}
const ALGORITHMS: RaceAlgorithm[] = [
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
// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generates a randomized array of a given size.
 * Centralized here so the parent can push the EXACT same array to all children.
 */

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1);
}

// Leaderboard Result Type
interface RaceResult {
  id: string;
  name: string;
  timeMs: number;
}

// ============================================================================
// MAIN ORCHESTRATOR COMPONENT
// ============================================================================

export function RacePage() {
  //Environment State
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(30);

  //Execution State
  const [isRacing, setIsRacing] = useState(false);

  // Results State
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  //Competitor State (Start with a default 1v1 matchup)
  const [activeAlgorithms, setActiveAlgorithms] = useState<RaceAlgorithm[]>([
    ALGORITHMS[0], //bubble sort
    ALGORITHMS[1], //quick sort
  ]);

  //UI state for the dropdown selector
  const [selectedAlgoToAdd, setSelectedAlgoToAdd] = useState<string>(ALGORITHMS[2]?.id || '');

  //The master array that acts as the single source of truth for all lanes
  const masterArray = useMemo(() => generateArray(arraySize), [arraySize]);
  const laneRefs = useRef<(RaceLaneHandle | null)[]>([]);

  //Sync the refs array to match the active competitors
  useEffect(() => {
    laneRefs.current = laneRefs.current.slice(0, activeAlgorithms.length);
  }, [activeAlgorithms]);

  const handleStartRace = () => {
    setRaceResults([]); // Clear previous leaderboard
    setShowLeaderboard(false);
    setIsRacing(true);
    laneRefs.current.forEach((lane) => lane?.play());
  };

  const handleResetRace = () => {
    setIsRacing(false);
    setShowLeaderboard(false);
    setRaceResults([]);
    const newMasterArray = generateArray(arraySize);
    laneRefs.current.forEach((lane) => lane?.reset(newMasterArray));
  };

  // Callback passed to RaceLane. Pushes naturally in order of finish (1st, 2nd, etc.)
  const handleLaneFinish = useCallback(
    (id: string, timeMs: number) => {
      setRaceResults((prev) => {
        if (prev.some((r) => r.id === id)) return prev; // Prevent duplicate entries
        const algo = activeAlgorithms.find((a) => a.id === id);
        if (!algo) return prev;
        return [...prev, { id, name: algo.name, timeMs }];
      });
    },
    [activeAlgorithms]
  );

  const handleAddAlgorithm = () => {
    if (activeAlgorithms.length >= 4) return;

    const algo = ALGORITHMS.find((a) => a.id === selectedAlgoToAdd);
    if (algo && !activeAlgorithms.find((a) => a.id === algo.id)) {
      setActiveAlgorithms((prev) => [...prev, algo]);
      handleResetRace();
    }
  };

  const handleRemoveAlgorithm = (idToRemove: string) => {
    setActiveAlgorithms((prev) => prev.filter((a) => a.id !== idToRemove));
    handleResetRace();
  };

  const availableToAdd = ALGORITHMS.filter(
    (algo) => !activeAlgorithms.find((active) => active.id === algo.id)
  );

  // Check if all active algorithms have reported back
  const isRaceFinished =
    isRacing && raceResults.length === activeAlgorithms.length && activeAlgorithms.length > 0;

  //Add a dramatic pause before showing the leaderboard
  useEffect(() => {
    if (isRaceFinished) {
      const timer = setTimeout(() => setShowLeaderboard(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isRaceFinished]);

  // Styling helper for the podium hierarchy
  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-100 via-yellow-50 to-white dark:from-yellow-900/60 dark:via-yellow-800/30 dark:to-slate-900 border-yellow-400 dark:border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] z-10';
      case 1:
        return 'bg-gradient-to-r from-slate-200 via-slate-100 to-white dark:from-slate-700/60 dark:via-slate-800/30 dark:to-slate-900 border-slate-400 dark:border-slate-500 shadow-[0_0_15px_rgba(148,163,184,0.2)]';
      case 2:
        return 'bg-gradient-to-r from-orange-200 via-orange-100 to-white dark:from-orange-900/60 dark:via-orange-800/30 dark:to-slate-900 border-orange-500 dark:border-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-[90vh]">
      {/* Configuration Panel */}
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Algorithm Race
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure your matchup. Max 4 competitors.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleStartRace}
              disabled={isRacing || activeAlgorithms.length === 0}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              Start Race
            </button>
            <button
              onClick={handleResetRace}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-lg transition-colors"
            >
              New Dataset
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

        {/* Controls Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end">
          {/* Add Competitor */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Add Competitor ({activeAlgorithms.length}/4)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedAlgoToAdd}
                onChange={(e) => setSelectedAlgoToAdd(e.target.value)}
                disabled={activeAlgorithms.length >= 4 || isRacing}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2 disabled:opacity-50 outline-none focus:border-blue-500 transition-colors"
              >
                {availableToAdd.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name}
                  </option>
                ))}
                {availableToAdd.length === 0 && <option value="">All algorithms active</option>}
              </select>
              <button
                onClick={handleAddAlgorithm}
                disabled={
                  activeAlgorithms.length >= 4 ||
                  isRacing ||
                  !selectedAlgoToAdd ||
                  availableToAdd.length === 0
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Environment Sliders */}
          <div className="flex-1 w-full flex gap-6">
            <div className="flex-1 space-y-2">
              <label className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>Array Size</span>
                <span className="text-blue-600 dark:text-blue-400">{arraySize}</span>
              </label>
              <ElasticSlider
                startingValue={10}
                maxValue={300}
                defaultValue={arraySize}
                isStepped={true}
                stepSize={1}
                disabled={isRacing}
                className="w-full max-w-none" // Overrides the default w-48 to fill the flex container
                onChange={(value) => {
                  setArraySize(value);
                  if (!isRacing) handleResetRace();
                }}
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>Speed Delay</span>
                <span className="text-blue-600 dark:text-blue-400">{speed}ms</span>
              </label>
              <ElasticSlider
                startingValue={0}
                maxValue={100}
                defaultValue={speed}
                isStepped={true}
                stepSize={1}
                disabled={isRacing}
                className="w-full max-w-none"
                onChange={(value) => setSpeed(value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Race Track Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${activeAlgorithms.length === 1 ? 'max-w-3xl mx-auto' : ''}`}
      >
        {activeAlgorithms.map((algo, index) => (
          <RaceLane
            key={`${algo.id}-${masterArray.length}`}
            ref={(el) => {
              laneRefs.current[index] = el;
            }}
            algorithm={algo}
            initialArray={masterArray}
            speed={speed}
            onRemove={() => handleRemoveAlgorithm(algo.id)}
            onFinish={handleLaneFinish}
          />
        ))}
        {activeAlgorithms.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            Add an algorithm to begin the race.
          </div>
        )}
      </div>

      {/* Leaderboard Overlay Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 p-1 overflow-hidden"
            >
              {/* Decorative Header Glow */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500/20 to-transparent dark:from-yellow-500/10 pointer-events-none" />

              <div className="relative p-8">
                {/* Close Button */}
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
                    Race Results
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  {raceResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      // Scale up the 1st place row slightly so it literally stands out
                      animate={{ opacity: 1, x: 0, scale: index === 0 ? 1.03 : 1 }}
                      transition={{ delay: index * 0.15 + 0.2 }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 ${getRankStyles(index)}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 flex justify-center">
                          <span
                            className={`text-2xl font-black italic ${
                              index === 0
                                ? 'text-yellow-600 dark:text-yellow-500 drop-shadow-sm'
                                : index === 1
                                  ? 'text-slate-500 dark:text-slate-400 drop-shadow-sm'
                                  : index === 2
                                    ? 'text-orange-600 dark:text-orange-500 drop-shadow-sm'
                                    : 'text-slate-400'
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </div>

                        <span
                          className={`font-bold ${index === 0 ? 'text-slate-900 dark:text-white text-lg' : 'text-slate-700 dark:text-slate-200'}`}
                        >
                          {result.name}
                        </span>
                      </div>

                      <div
                        className={`text-sm font-mono font-bold px-3 py-1.5 rounded-md shadow-inner border ${
                          index === 0
                            ? 'bg-white/80 dark:bg-slate-900/80 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50'
                            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50'
                        }`}
                      >
                        {(result.timeMs / 1000).toFixed(3)}s
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
                  >
                    View Arrays
                  </button>
                  <button
                    onClick={handleResetRace}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Race Again
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
