/**
 * @file insertionSort.ts
 *
 * @description
 * Implements the Insertion Sort algorithm as an async generator.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Insertion Sort algorithm iteratively, yielding state snapshots.
 * * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */

export async function* insertionSort(input: readonly number[]): SortGenerator {
  //Create a local, mutable copy of the input

  const arr = [...input];
  const n = arr.length;

  for (let i = 1; i < n; ++i) {
    let j = i;

    while (j > 0) {
      //COMPARISON FRAME
      //Highlight the current element and its left neighbor
      yield {
        array: [...arr],
        activeIndices: [j - 1, j],
        operation: 'compare',
      } satisfies SortFrame;

      if (arr[j - 1] > arr[j]) {
        //Perform the swap in local memory
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];

        //SWAP FRAME
        //Execution pauses here to show the element sliding left

        yield {
          array: [...arr],
          activeIndices: [j - 1, j],
          operation: 'swap',
        } satisfies SortFrame;

        j--;
      } else {
        break;
      }
    }
  }

  //FINAL FRAME
  //Signals to the engine that the algorithm has completed its lifecyle
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
export const insertionSortAlgorithm = {
  name: 'Insertion Sort',
  complexity: {
    best: 'O(n)',
    average: 'O(n^2)',
    worst: 'O(n^2)',
  },
  generator: insertionSort,
};
