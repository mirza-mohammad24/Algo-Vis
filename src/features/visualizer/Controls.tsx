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
    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-sm border-slate-200">
      {/*Top Row: Playback buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={onPlay}
          disabled={isRunning || isDone}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Play
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning}
          className="px-6 py-2 bg-slate-600 text-white font-medium rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Pause
        </button>
        <button
          onClick={onStep}
          disabled={isRunning || isDone}
          className="px-6 py-2 bg-slate-200 text-slate-800 font-medium rounded hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Step
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 transition-colors ml-auto"
        >
          Generate New Array
        </button>
      </div>

      {/* Bottom Row: Sliders & Number Inputs */}
      <div className="flex flex-wrap gap-8 items-center text-sm font-medium text-slate-700">
        {/*Algorithm Selector*/}
        <div className="flex items-center gap-3">
          <label htmlFor="algo-select" className="w-20">
            Algorithm
          </label>
          <select
            id="algo-select"
            value={selectedAlgorithm.name}
            disabled={isRunning}
            onChange={(e) => {
              const selected = algorithms.find((a) => a.name == e.target.value);
              if (selected) onAlgorithmChange(selected);
            }}
            className="w-40 px-2 py-1.5 text-sm border border-slate-300 rounded bg-slate-50 text-slate-700 focus:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {algorithms.map((algo) => (
              <option key={algo.name} value={algo.name}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size Control Group */}
        <div className="flex items-center gap-3">
          <label htmlFor="size-slider" className="w-12">
            Size
          </label>
          <input
            id="size-slider"
            type="range"
            min="10"
            max="1000"
            value={localSize}
            disabled={isRunning} // Locked while running to prevent stale closure confusion
            onChange={(e) => {
              setLocalSize(e.target.value);
              onSizeChange(Number(e.target.value));
            }}
            className="w-32 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="number"
            min="10"
            max="1000"
            value={localSize}
            disabled={isRunning} // Locked while running
            //Update the local text state only
            onChange={(e) => setLocalSize(e.target.value)}
            //Commit to the engine when user clicks enter
            onBlur={commitSize}
            onKeyDown={(e) => handleKeyDown(e, commitSize)}
            className="w-20 px-2 py-1 text-sm border border-slate-300 rounded bg-slate-50 text-slate-700 focus:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Speed Control Group */}
        <div className="flex items-center gap-3">
          <label htmlFor="speed-slider" className="w-20">
            Delay (ms)
          </label>
          <input
            id="speed-slider"
            type="range"
            min="0"
            max="200"
            value={localSpeed}
            disabled={isRunning} // Locked while running to prevent stale closure confusion
            onChange={(e) => {
              setLocalSpeed(e.target.value);
              onSpeedChange(Number(e.target.value));
            }}
            className="w-32 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="number"
            min="0"
            max="200"
            value={localSpeed}
            disabled={isRunning} // Locked while running
            onChange={(e) => setLocalSpeed(e.target.value)}
            onBlur={commitSpeed}
            onKeyDown={(e) => handleKeyDown(e, commitSpeed)}
            className="w-20 px-2 py-1 text-sm border border-slate-300 rounded bg-slate-50 text-slate-700 focus:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="ml-auto px-4 py-1 bg-slate-100 rounded-full text-slate-600 uppercase tracking-wider text-xs font-bold">
          {status}
        </div>
      </div>
    </div>
  );
}
