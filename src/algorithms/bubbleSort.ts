/**
 * @file bubbleSort.ts
 *
 * @description
 * Implements the Bubble Sort algorithm as an async generator.
 *
 * This implementation emits SortFrame objects at each significant step,
 * enabling step-by-step visualization, pausing, and synchronization
 * with other system components.
 *
 * @remarks
 * - Pure algorithm (no side effects outside generator)
 * - Does not mutate input array
 * - Internal mutation is allowed but never leaked
 */

import type { SortFrame, SortGenerator } from "../types/sort.ts";


export async function* bubbleSort(
  input: readonly number[]
) : SortGenerator {


  //Internal mutable copy (it is necessary for react)
  const arr = [...input];
  const n = arr.length;

  for (let i = 0; i<n; ++i){
    let swapped = false;

    for (let j = 0; j < n-i-1; j++){
      //1. COMPARISON FRAME
      yield{
        array: [...arr],
        activeIndices: [j, j+1],
        operation: 'compare',
      } satisfies SortFrame;

      if (arr[j]>arr[j+1]){
        //Perform swap
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];

        swapped = true;

        //2. SWAP FRAME
        yield {
          array: [...arr],
          activeIndices: [j, j+1],
          operation: 'swap',
        } satisfies SortFrame;
      }
    }
    
    //stop early if sorted
    if (!swapped) break;
  }

  //3. FINAL FRAME
  yield {
    array: [...arr],
    activeIndices: [],
    operation: 'done',
  } satisfies SortFrame;
}

export const bubbleSortAlgorithm = {
  name: 'Bubble Sort',
  complexity: {
    best: 'O(n)',
    average: 'O(n^2)',
    worst: 'O(n^2)',
  },
  generator: bubbleSort,
};