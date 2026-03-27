/**
 * @file quickSort.ts
 *
 * @description
 * Implements the Quick Sort algorithm as an async generator.
 *
 * @architecture
 * DIVIDE AND CONQUER (IN-PLACE):
 * Unlike Merge Sort, Quick Sort does not require an auxiliary array. It sorts
 * in-place using the `swap` operation, making it highly memory efficient.
 *
 * THE LOMUTO PARTITION SCHEME:
 * This implementation selects the last element of the current sub-array as the 'pivot'.
 * It sweeps through the array, throwing elements smaller than the pivot to the left,
 * and finally swaps the pivot into its absolute correct sorted position.
 *
 * RECURSIVE DELEGATION (`yield*`):
 * The `sort` helper delegates to `partition`, which yields the actual visual frames.
 * The pivot index (`pi`) is returned from the `partition` generator back to the `sort`
 * generator to determine the next recursive bounds.
 */

import type { SortFrame, SortGenerator } from '../types/sort.ts';

/**
 * Executes the Quick Sort algorithm recursively, yielding state snapshots.
 * @param input - The initial read-only array to be sorted.
 * @returns A control object of type `SortGenerator`.
 */

export async function* quickSort(input: readonly number[]): SortGenerator {
  const arr = [...input];
  const n = arr.length;

  /**
   * Helper function: Partitions the array around a pivot.
   * Note: This returns an AsyncGenerator that yields SortFrames, but ultimately
   * resolves to a `number` (the final index of the pivot).
   */
  async function* partition(low: number, high: number): AsyncGenerator<SortFrame, number, unknown> {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      //COMPARISON FRAME
      yield {
        array: [...arr],
        activeIndices: [j, high],
        operation: 'compare',
      } satisfies SortFrame;

      if (arr[j] < pivot) {
        ++i;

        [arr[i], arr[j]] = [arr[j], arr[i]];

        //SWAP FRAME
        yield {
          array: [...arr],
          activeIndices: [i, j],
          operation: 'swap',
        } satisfies SortFrame;
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    //FINAL PIVOT SWAP FRAME
    yield {
      array: [...arr],
      activeIndices: [i + 1, high],
      operation: 'swap',
    } satisfies SortFrame;

    return i + 1;
  }

  async function* sort(low: number, high: number): SortGenerator {
    if (low < high) {
      // yield* delegates the frame yieldin to the partition function,
      // and captures the returned pivot index once partition finishes.
      const pi = yield* partition(low, high);

      //Recursively sort elements before and after partition
      yield* sort(low, pi - 1);
      yield* sort(pi + 1, high);
    }
  }

  //begin the sort process
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
export const quickSortAlgorithm = {
  name: 'Quick Sort',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n^2)',
  },
  generator: quickSort,
};