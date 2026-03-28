/**
 * @file Controls.tsx
 *
 * @description
 * Provides interactive controls for the sorting execution.
 * Maps user input directly to the engine's exposed API methods.
 *
 * Changes from v1:
 *  - ElasticSlider replaces the native <input type="range"> for Size and Delay
 *  - Number inputs have spinners (up/down arrows) removed via Tailwind's
 *    [appearance:textfield] and pseudo-element utilities
 *  - Label + control groups use a tight flex row so nothing spreads apart
 */

import { useState, useEffect } from 'react';
import ElasticSlider from '../../components/ReactBits/ElasticSlider.tsx';
import type { SortAlgorithm } from '../../types/sort.ts';

interface ControlProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  arraySize: number;
  algorithms: SortAlgorithm[];
  selectedAlgorithm: SortAlgorithm;
  isSoundEnabled: boolean;
  onAlgorithmChange: (algo: SortAlgorithm) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
  onSizeChange: (value: number) => void;
  onToggleSound: () => void;
}

/** Shared className for the no-spinner number inputs */
const numberInputClass =
  'w-16 px-2 py-1.5 text-sm text-center border border-slate-300 dark:border-slate-700 rounded-md ' +
  'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm ' +
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

/** Shared label className — fixed width keeps everything in column */
const labelClass =
  'text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 w-20';

export function Controls({
  status,
  arraySize,
  algorithms,
  selectedAlgorithm,
  isSoundEnabled,
  onAlgorithmChange,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onSizeChange,
  onToggleSound,
}: ControlProps) {
  const isRunning = status === 'running';
  const isDone = status === 'completed';

  const [localSpeed, setLocalSpeed] = useState('50');
  const [localSize, setLocalSize] = useState(arraySize.toString());

  useEffect(() => {
    setLocalSize(arraySize.toString());
  }, [arraySize]);

  const commitSize = () => {
    let parsed = parseInt(localSize, 10);
    if (isNaN(parsed)) parsed = 150;
    const clamped = Math.max(10, Math.min(parsed, 1000));
    setLocalSize(clamped.toString());
    onSizeChange(clamped);
  };

  const commitSpeed = () => {
    let parsed = parseInt(localSpeed, 10);
    if (isNaN(parsed)) parsed = 50;
    const clamped = Math.max(0, Math.min(parsed, 200));
    setLocalSpeed(clamped.toString());
    onSpeedChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent, commitFn: () => void) => {
    if (e.key === 'Enter') commitFn();
  };

  const handleSizeSliderChange = (value: number) => {
    setLocalSize(value.toString());
    onSizeChange(value);
  };

  const handleSpeedSliderChange = (value: number) => {
    setLocalSpeed(value.toString());
    onSpeedChange(value);
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Row 1: Playback buttons */}
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
        <button
          onClick={onReset}
          className="col-span-2 sm:col-span-1 w-full sm:w-auto px-6 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors sm:ml-auto"
        >
          New Array
        </button>
      </div>

      {/* Row 2: Sliders + algorithm selector */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
        {/* Algorithm selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="algo-select" className={labelClass}>
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
            className="w-44 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors shadow-sm"
          >
            {algorithms.map((algo) => (
              <option key={algo.name} value={algo.name}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* Array size */}
        <div className="flex items-center gap-3">
          <label className={labelClass}>Array size</label>
          <ElasticSlider
            startingValue={10}
            maxValue={1000}
            defaultValue={arraySize}
            isStepped
            stepSize={1}
            onChange={handleSizeSliderChange}
            disabled={isRunning}
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
            className={numberInputClass}
          />
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* Delay */}
        <div className="flex items-center gap-3">
          <label className={labelClass}>Delay (ms)</label>
          <ElasticSlider
            startingValue={0}
            maxValue={200}
            defaultValue={50}
            isStepped
            stepSize={1}
            onChange={handleSpeedSliderChange}
            disabled={isRunning}
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
            className={numberInputClass}
          />
        </div>

        {/*Sound Toggle */}
        <div className="flex items-center">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-300 ${
              isSoundEnabled
                ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 opacity-70 hover:opacity-100'
            }`}
          >
            {isSoundEnabled ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
                Sound On
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
                Sound Off
              </>
            )}
          </button>
        </div>

        {/* Status badge */}
        <div className="sm:ml-auto">
          <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs font-bold">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
