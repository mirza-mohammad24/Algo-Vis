/**
 * @file Visualizer.tsx
 *
 * @description
 * Main feature component that connects the sorting engine to the UI.
 * Acts as the centralized state manager for the dashboard.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSortEngine } from '../../hooks/useSortEngine.ts';
import { useAudioEngine } from '../../hooks/useAudioEngine.ts';
import { CanvasVisualizer } from './CanvasVisualizer.tsx';
import { Controls } from './Controls.tsx';
import { AlgorithmInfo } from './AlgorithmInfo.tsx';
import type { SortAlgorithm } from '../../types/sort.ts';

//Import all 8 algorithms
import { bubbleSortAlgorithm } from '../../algorithms/bubbleSort.ts';
import { selectionSortAlgorithm } from '../../algorithms/selectionSort.ts';
import { insertionSortAlgorithm } from '../../algorithms/insertionSort.ts';
import { mergeSortAlgorithm } from '../../algorithms/mergeSort.ts';
import { quickSortAlgorithm } from '../../algorithms/quickSort.ts';
import { heapSortAlgorithm } from '../../algorithms/heapSort.ts';
import { countingSortAlgorithm } from '../../algorithms/countingSort.ts';
import { radixSortAlgorithm } from '../../algorithms/radixSort.ts';

const ALGORITHMS: SortAlgorithm[] = [
  bubbleSortAlgorithm,
  selectionSortAlgorithm,
  insertionSortAlgorithm,
  mergeSortAlgorithm,
  quickSortAlgorithm,
  heapSortAlgorithm,
  countingSortAlgorithm,
  radixSortAlgorithm,
];

/**
 * Utility to generate a random array.
 * The maximum possible value scales with the size of the array
 * to prevent massive visual repetition (the "staircase effect") at large N.
 */
function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1);
}

export function Visualizer() {
  //Dashboard State
  const [arraySize, setArraySize] = useState(150);

  //Track the currently selected algorithm (Default to Bubble sort)
  const [currentAlgorithm, setCurrentAlgorithm] = useState<SortAlgorithm>(ALGORITHMS[0]);

  //Generate initial array only when component mounts or size changes or when new algorithm is selected or reset is done
  //last three changes are implemented below in handleSizeChange and handleAlgorithmChange
  const initialArray = useMemo(() => generateArray(arraySize), [arraySize]);

  //Initialize Audio Engine
  const [playNote, isSoundEnabled, toggleSound] = useAudioEngine();

  //Initialize the Sort Engine
  const { state, play, pause, step, reset, setSpeed } = useSortEngine(currentAlgorithm, {
    array: initialArray,
    speed: 50,
  });

  // Calculate the max value of the current array for frequency mapping.
  const maxVal = useMemo(() => {
    if (state.array.length === 0) return 0;
    let m = -1;
    for (let i = 0; i < state.array.length; ++i) {
      m = Math.max(m, state.array[i]);
    }
    return m;
  }, [state.array]);

  // Fire audio synthesis on every frame update where there are active operations
  useEffect(() => {
    if (state.activeIndices.length > 0) {
      //We pass the actual value of the first active index to map it to a frequency
      playNote(state.array[state.activeIndices[0]], maxVal);
    }
  }, [state.activeIndices, state.array, maxVal, playNote]);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      setArraySize(newSize);
      //When size changes, instantly generate a new array and reset the engine
      reset(generateArray(newSize));
    },
    [reset]
  );

  const handleManualReset = useCallback(() => {
    // Generate a new random array of the current size
    reset(generateArray(arraySize));
  }, [arraySize, reset]);

  const handleAlgorithmChange = useCallback(
    (newAlgo: SortAlgorithm) => {
      setCurrentAlgorithm(newAlgo);
      reset(generateArray(arraySize));
    },
    [arraySize, reset]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header & Metrics */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Sorting Visualizer
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Currently executing: {`${currentAlgorithm.name}`}
          </p>
        </div>

        {/* Real-time Engine Metrics */}
        <div className="flex gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider text-xs">
              Comparisons
            </span>
            <span className="text-2xl font-mono font-semibold text-slate-700 dark:text-slate-200">
              {state.metrics.comparisons}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider text-xs">
              Swaps
            </span>
            <span className="text-2xl font-mono font-semibold text-slate-700 dark:text-slate-200">
              {state.metrics.swaps}
            </span>
          </div>
        </div>
      </div>

      {/* The Render Arena (Canvas) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <CanvasVisualizer
          array={state.array}
          activeIndices={state.activeIndices}
          operation={state.currentOperation}
        />
      </div>

      {/* Control Panel */}
      <Controls
        status={state.status}
        arraySize={arraySize}
        algorithms={ALGORITHMS}
        selectedAlgorithm={currentAlgorithm}
        isSoundEnabled={isSoundEnabled}
        onAlgorithmChange={handleAlgorithmChange}
        onPlay={play}
        onPause={pause}
        onStep={step}
        onReset={handleManualReset}
        onSpeedChange={setSpeed}
        onSizeChange={handleSizeChange}
        onToggleSound={toggleSound}
      />

      {/*The Info Panel */}
      <AlgorithmInfo algorithmName={currentAlgorithm.name} />

      {/* Code Studio CTA — links users to the educational split-view page */}
      <Link
        to="/study"
        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Want to watch the code execute line by line?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Code Studio shows live highlighting across Python, Java, C++, JS, C and C# at a fixed,
              readable pace.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0 group-hover:gap-3 transition-all">
          Open Code Studio
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
