/**
 * @file RaceLane.tsx
 *
 * @description
 * An isolated execution context for a single sorting algorithm during a race.
 * Manages its own `useSortEngine` instance and canvas render cycle to ensure
 * high-performance concurrent rendering without blocking the main thread.
 * Includes an internal high-resolution stopwatch to report completion times.
 */

/**
 * forwardRef passes the ref
 * useImperativeHandle controls what the ref exposes
 */

import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSortEngine } from '../../hooks/useSortEngine.ts';
import { CanvasVisualizer } from '../visualizer/CanvasVisualizer.tsx';
import type { RaceAlgorithm } from '../../pages/RacePage.tsx';

// The API contract this component exposes to its parent via React refs
export interface RaceLaneHandle {
  play: () => void;
  reset: (newArray: number[]) => void;
  isCompleted: boolean;
}

interface RaceLaneProps {
  algorithm: RaceAlgorithm;
  initialArray: number[];
  speed: number;
  onRemove: () => void;
  onFinish: (id: string, timeMs: number) => void;
}


//forwardRef<HandleType, PropsType>  that means:
//RaceLaneHandle → what ref.current will be
//RaceLaneProps → normal props
export const RaceLane = forwardRef<RaceLaneHandle, RaceLaneProps>(

  //receives ref as second argument and the first argument is RaceLaneProps unpacked
  ({ algorithm, initialArray, speed, onRemove, onFinish }, ref) => {
    //High resolution time ref to track exact execution duration
    const startTimeRef = useRef<number | null>(null);

    // Isolated Engine Instance
    const { state, play, reset, setSpeed } = useSortEngine(algorithm, {
      array: initialArray,
      speed: speed,
    });

    //Sync local engine speed with the global race speed
    useEffect(() => {
      setSpeed(speed);
    }, [speed, setSpeed]);

    //Expose only what is required
    //Expose imperative controls to the orchestrator (Race Page)
    //play:, reset: is different from what we receive from the engine the same name is used do not get confused
    useImperativeHandle(ref, () => ({
      play: () => {
        startTimeRef.current = performance.now(); //Start the stopwatch
        play();
      },
      reset: (newArray: number[]) => {
        startTimeRef.current = null; //Reset the stopwatch
        reset(newArray);
      },
      isCompleted: state.status === 'completed',
    }));

    //Monitor engine status to stop the clock when finished
    useEffect(() => {
      if (state.status === 'completed' && startTimeRef.current !== null) {
        const elapsed = performance.now() - startTimeRef.current;
        onFinish(algorithm.id || algorithm.name, elapsed); //tell the parent this lane is done and pass id || name, elapsed time
        startTimeRef.current = null; //Clear ref to prevent duplicate triggers
      }
    }, [state.status, algorithm, onFinish]); //every time the status will change we will check

    return (
      <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Competitor Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {algorithm.name}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                state.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : state.status === 'running'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {state.status}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Remove competitor"
            aria-label={`Remove ${algorithm.name}`}
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
        </div>

        {/* Render Arena */}
        <div className="p-4 h-48 relative">
          <CanvasVisualizer
            array={state.array}
            activeIndices={state.activeIndices}
            operation={state.currentOperation}
            containerHeightOverride="h-full" //new height for smaller screen (it overrides the default values for large visualizer page)
          />
        </div>
      </div>
    );
  }
);

//helpful while debugging
RaceLane.displayName = 'RaceLane';
