/**
 * @file Controls.tsx
 *
 * @description
 * Provides interactive controls for the sorting execution.
 * Maps user input directly to the engine's exposed API methods.
 */

import { useState, useEffect } from 'react';
import type { SortAlgorithm } from '../../types/sort.ts';
interface ControlProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  arraySize: number;
  algorithms: SortAlgorithm[];
  selectedAlgorithm: SortAlgorithm;
  onAlgorithmChange: (algo: SortAlgorithm) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
  onSizeChange: (value: number) => void;
}

export function Controls({
  status,
  arraySize,
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onSizeChange,
}: ControlProps) {
  const isRunning = status === 'running';
  const isDone = status === 'completed';

  //Local state for text inputs so typing doesn't instantly crash the app
  const [localSpeed, setLocalSpeed] = useState('50');
  const [localSize, setLocalSize] = useState(arraySize.toString());

  // Keep local text boxes synced if the app changes the size externally (e.g., clicking Reset)
  useEffect(() => {
    setLocalSize(arraySize.toString());
  }, [arraySize]);

  //The Clamping and commit functions
  const commitSize = () => {
    let parsed = parseInt(localSize, 10);
    if (isNaN(parsed)) parsed = 150; // default fallback

    //Hard Clamp: Minimum 10, Maximum 1000
    const clamped = Math.max(10, Math.min(parsed, 1000));

    setLocalSize(clamped.toString()); //Updating the text box
    onSizeChange(clamped); //Send the safe value to the engine
  };

  const commitSpeed = () => {
    let parsed = parseInt(localSpeed, 10);
    if (isNaN(parsed)) parsed = 50; //default fallback

    //Hard Clamp: Minimum 0, Maximum 200
    const clamped = Math.max(0, Math.min(parsed, 200));

    setLocalSpeed(clamped.toString());
    onSpeedChange(clamped);
  };

  //Allow user to press Enter to commit their typed values
  const handleKeyDown = (e: React.KeyboardEvent, commitFn: () => void) => {
    if (e.key === 'Enter') {
      commitFn();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Top Row: Playback Buttons (Grid on mobile, flex on desktop) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 items-center">
        <button
          onClick={onPlay}
          disabled={isRunning || isDone}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Play
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-600 dark:bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Pause
        </button>
        <button
          onClick={onStep}
          disabled={isRunning || isDone}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent dark:border-slate-700"
        >
          Step
        </button>
        {/* Generates new array spans full width on mobile, aligns right on desktop */}
        <button
          onClick={onReset}
          className="col-span-2 sm:col-span-1 w-full sm:w-auto px-6 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors sm:ml-auto"
        >
          Generate New Array
        </button>
      </div>

      {/* Bottom Row: Controls (Stacked vertically on mobile, row on desktop) */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-6 items-start lg:items-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
        {/* Algorithm Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          <label htmlFor="algo-select" className="w-24 shrink-0 text-slate-500 dark:text-slate-400">
            Algorithm
          </label>
          <select
            id="algo-select"
            value={selectedAlgorithm.name}
            disabled={isRunning}
            onChange={(e) => {
              const selected = algorithms.find((a) => a.name === e.target.value);
              if (selected) onAlgorithmChange(selected);
            }}
            className="w-full sm:w-48 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors shadow-sm"
          >
            {algorithms.map((algo) => (
              <option key={algo.name} value={algo.name}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          <label htmlFor="size-slider" className="w-24 shrink-0 text-slate-500 dark:text-slate-400">
            Size
          </label>
          <div className="flex items-center gap-3 w-full">
            <input
              id="size-slider"
              type="range"
              min="10"
              max="1000"
              value={localSize}
              disabled={isRunning}
              onChange={(e) => {
                setLocalSize(e.target.value);
                onSizeChange(Number(e.target.value));
              }}
              className="flex-1 sm:w-32 cursor-pointer disabled:opacity-50 accent-blue-600 dark:accent-blue-500"
            />
            <input
              type="number"
              min="10"
              max="1000"
              value={localSize}
              disabled={isRunning}
              onChange={(e) => setLocalSize(e.target.value)}
              onBlur={commitSize}
              onKeyDown={(e) => handleKeyDown(e, commitSize)}
              className="w-20 px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-center shadow-sm"
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          <label
            htmlFor="speed-slider"
            className="w-24 shrink-0 text-slate-500 dark:text-slate-400"
          >
            Delay (ms)
          </label>
          <div className="flex items-center gap-3 w-full">
            <input
              id="speed-slider"
              type="range"
              min="0"
              max="200"
              value={localSpeed}
              disabled={isRunning}
              onChange={(e) => {
                setLocalSpeed(e.target.value);
                onSpeedChange(Number(e.target.value));
              }}
              className="flex-1 sm:w-32 cursor-pointer disabled:opacity-50 accent-blue-600 dark:accent-blue-500"
            />
            <input
              type="number"
              min="0"
              max="200"
              value={localSpeed}
              disabled={isRunning}
              onChange={(e) => setLocalSpeed(e.target.value)}
              onBlur={commitSpeed}
              onKeyDown={(e) => handleKeyDown(e, commitSpeed)}
              className="w-20 px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-center shadow-sm"
            />
          </div>
        </div>

        {/* Status Badge (Pushed to end on large screens, sits at bottom on mobile) */}
        <div className="lg:ml-auto w-full lg:w-auto flex justify-end mt-2 lg:mt-0">
          <div className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs font-bold transition-colors">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
