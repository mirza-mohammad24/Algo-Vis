/**
 * @file countingSort.ts
 *
 * @description
 * Implements the Counting Sort algorithm as an async generator.
 *
 * @architecture
 * NON-COMPARISON SORTING:
 * Counting sort does not swap elements. It counts the frequency of each distinct
 * element, then sequentially overwrites the original array.
 * * THE VISUAL PHASES:
 * Phase 1 & 2 (Scanning): We yield 'compare' operations just to show the engine's
 * "read head" sweeping across the data to find the max value and tally frequencies.
 * Phase 3 (Overwriting): We yield 'overwrite' operations as we reconstruct the
 * sorted array from left to right.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Counting Sort algorithm, yielding state snapshots.
 * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */
export async function* countingSort(input: readonly number[]) : SortGenerator {
  const arr = [...input];
  const n = arr.length;

  if (n === 0) return;

  //Phase 1: Find the maximum value in the array to size our frequency buckets
  let max = arr[0];
  for (let i = 0; i<n; ++i) {
    //COMPARISON FRAME
    yield{
      array: [...arr],
      activeIndices: [i],
      operation: 'compare'
    } satisfies SortFrame;

    if (arr[i] > max) {
      max = arr[i];
    }
  }

  //Initialize the frequency/count array with zeros
  const count = new Array(max + 1).fill(0);

  //Phase 2: Count the occurrences of each exact value
  for (let i = 0; i<n; i++){
    //COMPARISON FRAME (Scanning to Count)
    yield {
      array: [...arr],
      activeIndices: [i],
      operation: 'compare'
    } satisfies SortFrame;

    count[arr[i]]++;
  }

  //Phase 3: Reconstruct the sorted array by overwriting from left to right
  let index = 0;
  for (let i = 0; i<=max; ++i){
    while (count[i] > 0) {
      arr[index] = i;

      //OVERWRITE FRAME (Printing the sorted values)
      yield {
        array: [...arr],
        activeIndices: [index],
        operation: 'overwrite'
      } satisfies SortFrame;
      index++;
      count[i]--;
    }
  }

  //FINAL FRAME signals the engine that the algorithm has completed
  yield {
    array: [...arr],
    activeIndices: [],
    operation: 'done'
  } satisfies SortFrame;
}

/**
 * Metadata wrapper for the algorithm.
 * Dynamically consumed by the UI for selection menus and complexity dashboards.
 */
export const countingSortAlgorithm = {
  name: 'Counting Sort',
  complexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
  },
  generator: countingSort,
};