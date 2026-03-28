/**
 * @file useSortEngine.ts
 *
 * @description
 * Implements the core execution engine (State Machine) for sorting algorithms.
 *
 * This custom hook acts as the orchestrator between the pure mathematical logic
 * of the sorting algorithms and the reactive UI layer of React. It manages time,
 * asynchronous pauses, and state accumulation.
 *
 * @architecture
 * 1. STATE SEPARATION (REACT PIPELINE):
 * - `useState` is used STRICTLY for data that the UI must render (array, metrics).
 * - `useRef` is used for internal engine controls (generator instance, run flag, background math).
 * Mutating refs does not trigger re-renders, preventing the execution loop from collapsing.
 *
 * 2. THE TIME LOOP:
 * - React cannot natively "pause" rendering midway through a function.
 * - The `run` function solves this by using a `while` loop combined with `await sleep()`.
 * - It pulls a frame -> updates React -> sleeps -> repeats, creating an animation loop.
 *
 * 3. HIGH-THROUGHPUT FRAME SAMPLING (N=1000 SCALE):
 * - To support massive datasets, computation is decoupled from rendering.
 * - The engine computes thousands of operations instantly in the background.
 * - It uses `metricsRef` to silently count operations without triggering React.
 * - It only forces a React render (and a sleep pause) every Nth frame, allowing
 * massive arrays to sort smoothly without freezing the browser's DOM thread.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  SortAlgorithm,
  SortConfig,
  SortMetrics,
  SortOperation,
  SortState,
} from '../types/sort.js';

/**
 * Utility: delay execution for given milliseconds.
 * Forces the async loop to yield control back to the browser's main thread,
 * allowing React to actually paint the DOM updates before continuing.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pure function to calculate new metrics based on the incoming operation.
 */
function updateMetrics(metrics: SortMetrics, operation: SortOperation): SortMetrics {
  switch (operation) {
    case 'compare':
      return { ...metrics, comparisons: metrics.comparisons + 1 };
    case 'swap':
      return { ...metrics, swaps: metrics.swaps + 1 };
    case 'overwrite':
      return { ...metrics, overwrites: metrics.overwrites + 1 };
    default:
      return metrics;
  }
}

/**
 * The primary controller hook for the sorting visualizer.
 *
 * @param algorithm - The specific sorting algorithm object containing the respective generator.
 * @param config - Initial setup parameters (speed, starting array).
 */

export function useSortEngine(algorithm: SortAlgorithm, config: SortConfig) {
  // REACTIVE STATE (Triggers UI Renders)
  const [state, setState] = useState<SortState>({
    array: config.array,
    activeIndices: [],
    status: 'idle',
    metrics: {
      comparisons: 0,
      swaps: 0,
      overwrites: 0,
    },
    currentOperation: null,
  });

  /**Speed Control (ms delay between frames)*/
  const [speed, setSpeedState] = useState(config.speed);

  // INTERNAL MUTABLE STATE (Does NOT Trigger Renders)
  /** Holds the active generator instance. Preserved across renders. */
  const generatorRef = useRef<ReturnType<SortAlgorithm['generator']> | null>(null);
  /** Master kill-switch for the execution loop. */
  const isRunningRef = useRef(false);

  /**
   * Background metrics tracking.
   * Tracks accurate math during skipped frames so the UI doesn't lose count.
   */
  const metricsRef = useRef<SortMetrics>({
    comparisons: 0,
    swaps: 0,
    overwrites: 0,
  });

  /** Tracks total operations to calculate when to trigger a render. */
  const frameCounterRef = useRef(0);

  // CORE ENGINE LOGIC
  /**
   * Initializes a fresh generator object using the provided array.
   */
  const initGenerator = useCallback(
    (array: readonly number[]) => {
      generatorRef.current = algorithm.generator(array);
    },
    [algorithm]
  );

  /**
   * The primary animation loop. Continually pulls frames from the generator
   * until paused or completed.
   */
  const run = useCallback(async () => {
    if (!generatorRef.current) return;

    isRunningRef.current = true;

    setState((prev) => ({
      ...prev,
      status: 'running',
    }));

    while (isRunningRef.current && generatorRef.current) {
      /**
       * THE ITERATOR RESULT PAYLOAD
       *
       * Calling `.next()` on an AsyncGenerator does not return the yielded `SortFrame` directly.
       * It wraps the payload in an `IteratorResult` container to communicate lifecycle status.
       *
       * Expected Shape: { done: boolean, value: SortFrame | undefined } (done is js inbuilt flag)
       *
       * - State 1 (Yielding): { done: false, value: { array: [...], operation: 'compare' } }
       * (Here the value is of type SortFrame)
       * - State 2 (Returned): { done: true, value: undefined }
       *
       * The `done` boolean is the engine's primary kill-switch. Without this wrapper,
       * the engine would have no way of knowing when the algorithm's internal loops
       * have finished executing.
       */
      const result = await generatorRef.current.next();

      if (result.done) {
        setState((prev) => ({
          ...prev,
          status: 'completed',
          currentOperation: 'done',
        }));
        break;
      }

      // Extract the single frame since we know it is not done yet
      const frame = result.value;
      frameCounterRef.current++;

      // Silently update the true mathematical metrics in the background memory
      metricsRef.current = updateMetrics(metricsRef.current, frame.operation);

      //DYNAMIC SAMPLING: Calculate how many frames to skip based on array size
      //If n = 1000, skip ~40 frames. If n = 10 skip 0 frames.
      const SAMPLE_RATE = Math.max(1, Math.floor(config.array.length / 25));

      const shouldRender =
        frame.operation === 'swap' || //Always show swaps
        frame.operation === 'overwrite' || //Always show overwrites
        frame.operation === 'done' || //Always show the final frame
        frameCounterRef.current % SAMPLE_RATE === 0; //Otherwise, only show every nth frame

      if (shouldRender) {
        //Sync the background metrics to React and update the UI
        setState((prev) => ({
          ...prev,
          array: frame.array,
          activeIndices: frame.activeIndices,
          currentOperation: frame.operation,
          metrics: metricsRef.current,
        }));

        // ONLY sleep if we actually painted the screen.
        // Un-rendered frames are processed instantly.
        await sleep(speed);
      }
    }
  }, [speed, config.array.length]); // Rebuild loop if array length changes to recalculate SAMPLE_RATE or the speed changes

  // PUBLIC CONTROL METHODS
  /**Start / resume execution*/
  const play = useCallback(() => {
    if (!generatorRef.current) return;

    run();
  }, [run]);

  /**Pause Execution*/
  const pause = useCallback(() => {
    isRunningRef.current = false;

    setState((prev) => ({
      ...prev,
      status: 'paused',
    }));
  }, []);

  /**Execute a single step
   * Exactly the same extraction logic as run(), but it deliberately
   * lacks the while loop and the sleep() throttle. It pulls exactly one frame and stops.
   */
  const step = useCallback(async () => {
    if (!generatorRef.current) return;

    const result = await generatorRef.current.next();

    if (result.done) {
      setState((prev) => ({
        ...prev,
        status: 'completed',
        currentOperation: 'done',
      }));
      return;
    }

    const frame = result.value;
    // Update background metrics for the single step
    metricsRef.current = updateMetrics(metricsRef.current, frame.operation);

    setState((prev) => ({
      ...prev,
      array: frame.array,
      activeIndices: frame.activeIndices,
      currentOperation: frame.operation,
      metrics: metricsRef.current, // Pass the synchronized ref directly
    }));
  }, []);

  /**Reset engine with new array*/
  const reset = useCallback(
    (array: number[]) => {
      isRunningRef.current = false;
      frameCounterRef.current = 0;
      metricsRef.current = {
        comparisons: 0,
        swaps: 0,
        overwrites: 0,
      };

      initGenerator(array);
      setState({
        array,
        activeIndices: [],
        status: 'idle',
        metrics: {
          comparisons: 0,
          swaps: 0,
          overwrites: 0,
        },
        currentOperation: null,
      });
    },
    [initGenerator]
  );

  /**Update speed dynamically*/
  const setSpeed = useCallback((value: number) => {
    setSpeedState(value);
  }, []);

  /**Boot strapper: Prepare generator on initial mount or array change*/
  useEffect(() => {
    initGenerator(config.array);
  }, [config.array, initGenerator]);

  return {
    state,
    play,
    pause,
    step,
    reset,
    setSpeed,
  };
}
