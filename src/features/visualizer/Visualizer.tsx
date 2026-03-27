/**
 * @file Visualizer.tsx
 *
 * @description
 * Main feature component that connects the sorting engine to the UI.
 * Acts as the centralized state manager for the dashboard.
 */

import { useState, useMemo, useCallback } from 'react';
import { useSortEngine } from '../../hooks/useSortEngine.ts';
import { bubbleSortAlgorithm } from '../../algorithms/bubbleSort.ts';
import { selectionSortAlgorithm } from '../../algorithms/selectionSort.ts';
import { insertionSortAlgorithm } from '../../algorithms/insertionSort.ts';
import { mergeSortAlgorithm } from '../../algorithms/mergeSort.ts';
import { CanvasVisualizer } from './CanvasVisualizer.tsx';
import { Controls } from './Controls.tsx';

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

  //Generate initial array only when component mounts or size changes
  const initialArray = useMemo(() => generateArray(arraySize), [arraySize]);

  //Initialize the Engine
  const { state, play, pause, step, reset, setSpeed } = useSortEngine(mergeSortAlgorithm, {
    array: initialArray,
    speed: 50,
  });

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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header & Metrics */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sorting Visualizer</h1>
          {/* <p className="text-slate-500">Currently executing: Bubble Sort</p> */}
        </div>

        {/* Real-time Engine Metrics */}
        <div className="flex gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">
              Comparisons
            </span>
            <span className="text-2xl font-mono font-semibold text-slate-700">
              {state.metrics.comparisons}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">
              Swaps
            </span>
            <span className="text-2xl font-mono font-semibold text-slate-700">
              {state.metrics.swaps}
            </span>
          </div>
        </div>
      </div>

      {/* The Render Arena (Canvas) */}
      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
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
        onPlay={play}
        onPause={pause}
        onStep={step}
        onReset={handleManualReset}
        onSpeedChange={setSpeed}
        onSizeChange={handleSizeChange}
      />
    </div>
  );
}
