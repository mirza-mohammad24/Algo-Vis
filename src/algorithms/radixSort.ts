/**
 * @file radixSort.ts
 *
 * @description
 * Implements the Radix Sort algorithm as an async generator.
 *
 * @architecture
 * LEAST SIGNIFICANT DIGIT (LSD) SORTING:
 * Radix sort processes elements digit by digit. It uses a stable sub-sort
 * (in this case, a base-10 Counting Sort) to sort the array based on the 1s place,
 * then the 10s place, then the 100s place, and so on.
 *
 * VISUALIZING THE CHAOS:
 * Because it sorts by digits rather than total value, the intermediate frames
 * will often look completely unsorted to the human eye. The array only locks into
 * perfect visual order during the very last pass (the most significant digit).
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

export async function* radixSort(input: readonly number[]): SortGenerator {
  const arr = [...input];
  const n = arr.length;

  if (n === 0) return;

  // Phase 1: Find the maximum number to know how many digits we have to process
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    // COMPARISON FRAME: Sweeping to find the max
    yield {
      array: [...arr],
      activeIndices: [i],
      operation: 'compare',
    } satisfies SortFrame;

    if (arr[i] > max) {
      max = arr[i];
    }
  }

  // Phase 2: Perform Counting Sort for every digit place (exp is 1, 10, 100, etc.)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0); // Base 10 buckets (0-9)

    // Count occurrences of the current digit
    for (let i = 0; i < n; i++) {
      yield {
        array: [...arr],
        activeIndices: [i],
        operation: 'compare',
      } satisfies SortFrame;

      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    // Change count[i] so that it contains the actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array
    // Note: We loop backwards to maintain the STABILITY of the sort.
    // Stability is strictly required for Radix Sort to work!
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // Overwrite the original array with the sorted output of this digit pass
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];

      yield {
        array: [...arr],
        activeIndices: [i],
        operation: 'overwrite',
      } satisfies SortFrame;
    }
  }

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
export const radixSortAlgorithm = {
  name: 'Radix Sort',
  complexity: {
    best: 'O(nk)', // Where k is the number of digits
    average: 'O(nk)',
    worst: 'O(nk)',
  },
  generator: radixSort,
};
