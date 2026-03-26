/**
 * @file bubbleSort.ts
 *
 * @description
 * Implements the Bubble Sort algorithm as an async generator.
 *
 * @architecture
 * GENERATOR VS. STANDARD FUNCTION BEHAVIOR:
 * 1. Standard Function: Executes synchronously from start to finish, blocking the
 * main thread and returning the final sorted array.
 * 2. Generator Function (This Implementation): Calling `bubbleSort(arr)` does NOT
 * execute the sorting logic. Instead, it instantly returns a `SortGenerator`
 * control object. The code inside this function only runs when the consumer
 * (the execution engine) explicitly calls `.next()` on that control object.
 *
 * IMMUTABILITY & REACT PIPELINE:
 * At every step, the internal array is cloned (`[...arr]`) before yielding.
 * This is a strict architectural requirement. React utilizes referential equality (`===`)
 * to detect state changes. If the generator mutated the array in place and yielded
 * the exact same memory reference, React would ignore the update and the UI would freeze.
 *
 * @remarks
 * - Pure algorithm (no side effects outside the generator).
 * - Internal mutation is utilized for algorithmic efficiency but is never leaked.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Bubble Sort algorithm iteratively, yielding state snapshots.
 *
 * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`. Note: This is NOT the sorted array.
 * It is an iterator interface used by the engine to pull `SortFrame` payloads.
 *
 * @yields {SortFrame} An immutable snapshot of the sorting state containing the cloned array,
 * the active indices, and the semantic operation type.
 */
export async function* bubbleSort(input: readonly number[]): SortGenerator {
  // Create a local, mutable copy of the input.
  // The original input must remain untouched to preserve functional purity.
  const arr = [...input];
  const n = arr.length;

  for (let i = 0; i < n; ++i) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // 1. COMPARISON FRAME
      // Execution pauses here and hands control back to the engine.
      yield {
        array: [...arr],
        activeIndices: [j, j + 1],
        operation: 'compare',
      } satisfies SortFrame;

      if (arr[j] > arr[j + 1]) {
        // Perform the swap in local memory
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        swapped = true;

        // 2. SWAP FRAME
        // Execution pauses here to reflect the completed swap in the UI.
        yield {
          array: [...arr],
          activeIndices: [j, j + 1],
          operation: 'swap',
        } satisfies SortFrame;
      }
    }

    // Optimization: Stop early if the array is already sorted
    if (!swapped) break;
  }

  // 3. FINAL FRAME
  // Signals to the engine that the algorithm has completed its lifecycle.
  yield {
    array: [...arr],
    activeIndices: [],
    operation: 'done',
  } satisfies SortFrame;
}

/**
 * Metadata wrapper for the algorithm.
 * Dynamically consumed by the UI for selection menus and complexity dashboards.
 */
export const bubbleSortAlgorithm = {
  name: 'Bubble Sort',
  complexity: {
    best: 'O(n)',
    average: 'O(n^2)',
    worst: 'O(n^2)',
  },
  generator: bubbleSort,
};
