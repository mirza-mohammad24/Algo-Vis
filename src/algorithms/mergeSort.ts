/**
 * @file mergeSort.ts
 *
 * @description
 * Implements the Merge Sort algorithm as an async generator.
 *
 * @architecture
 * DIVIDE AND CONQUER:
 * This algorithm recursively splits the array into smaller halves until each sub-array
 * contains a single element, then meticulously merges them back together in sorted order.
 *
 * OUT-OF-PLACE MERGING (THE AUXILIARY ARRAY):
 * Unlike Bubble or Insertion sort, Merge Sort is not an in-place algorithm. It requires
 * additional memory (the `aux` array) to temporarily hold values while comparing.
 * Visually, this means we do not `swap` elements. Instead, we pull elements from the
 * `aux` array and `overwrite` the original array. This creates a cascading visual effect
 * on the canvas.
 *
 * RECURSIVE DELEGATION (`yield*`):
 * Because the algorithm is recursive, we use the `yield*` keyword. This allows the nested
 * `sort` and `merge` helper functions to delegate their `SortFrame` yields all the way up
 * the call stack to the master execution engine.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Merge Sort algorithm recursively, yielding state snapshots.
 * * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */
export async function* mergeSort(input: readonly number[]): SortGenerator {
  // Create a local, mutable copy of the input.
  const arr = [...input];
  const n = arr.length;

  // Initialize the auxiliary array used for the merging process
  const aux = new Array(n);

  /**
   * Helper function: Merges two sorted sub-arrays back into the main array.
   */
  async function* merge(low: number, mid: number, high: number): SortGenerator {
    // Copy the current state of the segment into the auxiliary array
    for (let k = low; k <= high; k++) {
      aux[k] = arr[k];
    }

    let i = low;
    let j = mid + 1;

    // Merge the two halves back into the main array
    for (let k = low; k <= high; k++) {
      if (i > mid) {
        // Left half exhausted, take from right
        arr[k] = aux[j++];
        yield {
          array: [...arr],
          activeIndices: [k],
          operation: 'overwrite',
        } satisfies SortFrame;
      } else if (j > high) {
        // Right half exhausted, take from left
        arr[k] = aux[i++];
        yield {
          array: [...arr],
          activeIndices: [k],
          operation: 'overwrite',
        } satisfies SortFrame;
      } else {
        // Highlight the two elements we are currently comparing in the auxiliary array
        yield {
          array: [...arr],
          activeIndices: [i, j],
          operation: 'compare',
        } satisfies SortFrame;

        if (aux[i] <= aux[j]) {
          arr[k] = aux[i++];
          yield {
            array: [...arr],
            activeIndices: [k],
            operation: 'overwrite',
          } satisfies SortFrame;
        } else {
          arr[k] = aux[j++];
          yield {
            array: [...arr],
            activeIndices: [k],
            operation: 'overwrite',
          } satisfies SortFrame;
        }
      }
    }
  }

  /**
   * Helper function: Recursively splits the array into halves.
   */
  async function* sort(low: number, high: number): SortGenerator {
    // Base case: sub-array has 1 or 0 elements
    if (high <= low) return;

    const mid = low + Math.floor((high - low) / 2);

    // Recursively sort the left and right halves
    yield* sort(low, mid);
    yield* sort(mid + 1, high);

    // Merge the newly sorted halves
    yield* merge(low, mid, high);
  }

  // Begin the sorting process covering the entire array
  yield* sort(0, n - 1);

  // Final frame signals to the engine that the algorithm has completed
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
export const mergeSortAlgorithm = {
  name: 'Merge Sort',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  generator: mergeSort,
};
