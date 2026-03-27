/**
 * @file selectionSort.ts
 *
 * @description
 * Implements the Selection Sort algorithm using the Generator pattern.
 * Yields frames for both the scanning comparisons and the final swap per pass.
 */

import type { SortGenerator, SortFrame } from "../types/sort";

/**
 * Executes the Selection Sort algorithm iteratively, yielding state snapshots.
 * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */

export async function* selectionSort(input: readonly number[]): SortGenerator{
  
  const arr = [...input];
  const n = arr.length;

  for (let i = 0; i<n; ++i){
    let minIndex = i;

    for (let j = i+1; j<n; ++j) {
      //COMPARISON FRAME
      // Highlight the current minimum and the element being checked
      yield {
        array: [...arr],
        activeIndices: [minIndex, j],
        operation: 'compare'
      } satisfies SortFrame;

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    //SWAP FRAME
    // If we found a new minimum, swap it into its correct position
    if (minIndex !== i) {
      [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]];

      yield{
        array: [...arr],
        activeIndices: [i,minIndex],
        operation: 'swap'
      } satisfies SortFrame;
    }
  }

  //FINAL FRAME
  //Signals to the engine that the algorithm has completed its lifecycle
  yield{
    array: [...arr],
    activeIndices: [],
    operation: 'done'
  } satisfies SortFrame;
}

/**
 * Metadata wrapper for the algorithm.
 * Dynamically consumed by the UI for selection menus and complexity dashboards
 */

export const selectionSortAlgorithm = {
  name: 'Selection Sort',
  complexity: {
    best: 'O(n^2)',
    average: 'O(n^2)',
    worst: 'O(n^2)',
  },
  generator: selectionSort
};