/**
 * @file sort.ts
 *
 * @description
 * Defines the core contracts for the sorting visualizer engine.
 *
 * This file establishes a strict boundary between:
 * - Algorithm execution (pure logic)
 * - Engine control flow (state machine)
 * - UI rendering (React components)
 *
 * @architecture
 * The system follows a unidirectional data flow using Async Generators.
 * * WHY ASYNC GENERATORS (`async function*`)?
 * Standard algorithms execute synchronously, blocking the main thread
 * and preventing UI updates until completion. By yielding `SortFrame`
 * snapshots at each significant step (comparisons, swaps), the generator
 * hands control back to the React render cycle. This allows:
 * 1. Throttled execution for 60fps animations without freezing the browser.
 * 2. Deterministic pause/resume/step capabilities.
 * 3. Concurrent execution of multiple algorithms (Race Mode) safely.
 *
 * Full Pipeline:
 * Algorithm (pure logic)
 * ↓ yields
 * SortFrame (immutable snapshot of current state)
 * ↓ consumed by
 * Engine (React hook state machine)
 * ↓ produces
 * SortState (reactive React state)
 * ↓ rendered by
 * UI (React components)
 */

/**
 * Represents the semantic type of operation performed by the algorithm.
 *
 * @remarks
 * This is not just for visualization — it drives:
 * - UI highlighting (color coding)
 * - Sound synthesis (frequency mapping)
 * - Metrics tracking (comparisons, swaps)
 * - Code panel synchronization
 */
export type SortOperation = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'done';

/**
 * Represents a single step (frame) in the sorting process.
 *
 * @remarks
 * This is the fundamental unit of communication between:
 * - Algorithms → Engine → UI
 *
 * Every frame must be treated as immutable.
 *
 * @invariant
 * - `array` must always be a new snapshot (no shared references to trigger re render or else react will not consider it new if the reference is same)
 * - `activeIndices` must correspond to the current operation
 */
export interface SortFrame {
  /**
   * Snapshot of the array at this step.
   * Must be immutable (cloned before emitting).
   */
  readonly array: readonly number[]; //we can neither change the existing array or reassign this property with new array

  /**
   * Indices currently being operated on.
   * Used for highlighting bars.
   */
  readonly activeIndices: readonly number[]; //we can neither change the existing array or reassign this property with new array

  /**
   * Type of operation performed in this frame.
   */
  operation: SortOperation;

  /**
   * Optional metadata for advanced features.
   * Example: pivot index, recursion depth, etc.
   */
  metadata?: {
    pivotIndex?: number;
    leftIndex?: number;
    rightIndex?: number;
    [key: string]: unknown;
  };
}

/**
 * Async generator representing a sorting algorithm.
 *
 * @remarks
 * IMPORTANT TYPE DISTINCTION:
 * There is a strict separation between the function's evaluation type and its iteration type.
 *
 * 1. Evaluation (Return Type): Calling an algorithm function (e.g., `bubbleSort()`)
 * does NOT execute the sorting logic. It immediately returns a control object 
 * of type `SortGenerator`. (See specific algorithm documentation).
 * * 2. Iteration (Yield Type): When the consuming engine calls `.next()` on this 
 * control object, the algorithm executes until the next `yield` statement. 
 *
 * ASYNC GENERATOR TYPE PARAMETERS (`AsyncGenerator<YieldType, ReturnType, NextType>`):
 * The signature `AsyncGenerator<SortFrame, void, unknown>` enforces three strict contracts:
 * * - Yield Type (`SortFrame`): Guarantees that every `yield` statement emits a payload 
 * that strictly matches the `SortFrame` interface.
 * - Return Type (`void`): Indicates that the algorithm finishes execution naturally 
 * without returning a final computed value via the `return` keyword.
 * - Next Type (`unknown`): Enforces that the consuming engine cannot inject state 
 * back into the algorithm via `.next(injectedData)`. The data flow remains 
 * strictly unidirectional (Algorithm -> Engine -> UI).
 *
 * @example
 * // 1. Returns SortGenerator (execution has not started)
 * const engine = bubbleSort([3, 1, 2]);
 *
 * // 2. Yields SortFrame (runs up to the first yield and pauses)
 * const { value, done } = await engine.next();
 * // `value` satisfies SortFrame
 */
export type SortGenerator = AsyncGenerator<SortFrame, void, unknown>;

/**
 * Describes a pluggable sorting algorithm.
 * This is common for all algorithms it does not care if the selected algorithm is bubble merge or anything else.
 * It just guarantees that a selected algorithm will provide the following information to use.
 * @remarks
 * Allows algorithms to be dynamically selected and executed
 * without coupling to the UI or engine implementation.
 */
export interface SortAlgorithm {
  /**
   * Display name of the algorithm.
   */
  name: string;

  /**
   * Time complexity (best, average, worst).
   */
  complexity: {
    best: string;
    average: string;
    worst: string;
  };

  /**
   * Entry point for algorithm execution.
   */
  generator: (array: readonly number[]) =>   SortGenerator;
}

/**
 * Represents the lifecycle state of the sorting engine.
 *
 * @remarks
 * Used by the engine state machine to control execution flow.
 */
export type SortStatus = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Configuration for initializing the sorting engine.
 */
export interface SortConfig {
  /**
   * Delay between frames in milliseconds.
   */
  speed: number;

  /**
   * Initial array to sort.
   */
  array: readonly number[];
}

/**
 * Tracks operation counts during execution.
 *
 * @remarks
 * Used for:
 * - Complexity dashboard (charts)
 * - Empirical performance analysis
 */
export interface SortMetrics {
  readonly comparisons: number;
  readonly swaps: number;
  readonly overwrites: number;
}

/**
 * Represents the runtime state exposed by the sorting engine.
 *
 * @remarks
 * This is the single source of truth consumed by the UI.
 */
export interface SortState {
  /**
   * Current array snapshot.
   */
  array: readonly number[];

  /**
   * Tracks which bar to highlight
   */
  activeIndices: readonly number[];

  /**
   * Current execution status.
   */
  status: SortStatus;

  /**
   * Accumulated metrics.
   */
  metrics: SortMetrics;

  /**
   * Operation currently being executed.
   */
  currentOperation: SortOperation | null;
}
