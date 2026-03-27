/**
 * @file heapSort.ts
 *
 * @description
 * Implements the Heap Sort algorithm as an async generator.
 *
 * @architecture
 * IN-PLACE TREE TRAVERSAL:
 * Heap Sort visualizes a binary tree mapped directly onto a flat array.
 * The parent-child relationships are calculated purely using indices.
 *
 * TWO-PHASE EXECUTION:
 * 1. Build Max Heap: We rearrange the array into a valid max-heap structure.
 * 2. Extract Elements: We repeatedly swap the largest element (the root at index 0)
 * to the end of the array, then restore the heap property for the remaining elements.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Heap Sort algorithm iteratively and recursively, yielding state snapshots.
 * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */

export async function* heapSort(input: readonly number[]): SortGenerator {
  const arr = [...input];
  const n = arr.length;

  /**
   * Helper function: Maintains the max-heap property for a given subtree.
   * @param size - The current boundary of the unsorted heap.
   * @param i - The root index of the subtree to heapify.
   */
  async function* heapify(size: number, i: number): SortGenerator {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Check if left child exists and is greater than root
    if (left < size) {
      //COMPARISON FRAME
      yield {
        array: [...arr],
        activeIndices: [left, largest],
        operation: 'compare',
      } satisfies SortFrame;
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    //Check if right child exists and is greater than the current largest
    if (right < size) {
      //COMPARISON FRAME
      yield {
        array: [...arr],
        activeIndices: [right, largest],
        operation: 'compare',
      } satisfies SortFrame;

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    //If the largest is not the root, swap and continue heapifying down the tree
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      //SWAP FRAME
      yield {
        array: [...arr],
        activeIndices: [i, largest],
        operation: 'swap',
      } satisfies SortFrame;

      //Recursively heapify the affected sub-tree
      yield* heapify(size, largest);
    }
  }

  //Phase 1: Build the max heap(start from the last non-leaf node and go up)
  for (let i = Math.floor(n / 2) - 1; i >= 0; --i) {
    yield* heapify(n, i);
  }

  //Phase 2: Extract elements one by one from the heap
  for (let i = n - 1; i >= 0; --i) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    yield {
      array: [...arr],
      activeIndices: [0, i],
      operation: 'swap',
    } satisfies SortFrame;

    //Call max heapify on the reduced heap to restore the root
    yield* heapify(i, 0);
  }

  //Final frame signals to the engine that the algorithm has completed
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
export const heapSortAlgorithm = {
  name: 'Heap Sort',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  generator: heapSort,
};
