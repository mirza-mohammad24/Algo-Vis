/**
 * @file AlgorithmInfo.tsx
 * @description Displays the educational theory, complexities, and pseudocode for the selected algorithm.
 * Each card uses ParticleCard for the same hover particle + border-glow effect as the landing page bento.
 */

import { ParticleCard } from '../../components/ReactBits/MagicBento';
import PropTypes from 'prop-types';

interface AlgorithmInfoProps {
  algorithmName: string;
}

const ALGORITHM_DATA: Record<
  string,
  {
    description: string;
    complexities: { best: string; avg: string; worst: string; space: string };
    pseudocode: string;
  }
> = {
  'Bubble Sort': {
    description:
      'Bubble Sort is a simple comparison-based algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. It is highly inefficient for large datasets.',
    complexities: { best: 'Ω(n)', avg: 'Θ(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: `procedure bubbleSort(A : list of sortable items)
  n = length(A)
  repeat
    swapped = false
    for i = 1 to n-1 inclusive do
      if A[i-1] > A[i] then
        swap(A[i-1], A[i])
        swapped = true
      end if
    end for
    n = n - 1
  until not swapped
end procedure`,
  },
  'Selection Sort': {
    description:
      'Selection Sort divides the input list into two parts: a sorted sublist built from left to right, and a sublist of remaining unsorted items. It proceeds by finding the smallest element in the unsorted sublist, exchanging it with the leftmost unsorted element, and moving the sublist boundaries.',
    complexities: { best: 'Ω(n²)', avg: 'Θ(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: `procedure selectionSort(A : list of sortable items)
  n = length(A)
  for i = 0 to n-1 inclusive do
    min_idx = i
    for j = i+1 to n inclusive do
      if A[j] < A[min_idx] then
        min_idx = j
      end if
    end for
    swap(A[i], A[min_idx])
  end for
end procedure`,
  },
  'Insertion Sort': {
    description:
      'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort or merge sort. However, it performs incredibly well for very small or nearly sorted datasets.',
    complexities: { best: 'Ω(n)', avg: 'Θ(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudocode: `procedure insertionSort(A : list of sortable items)
  n = length(A)
  for i = 1 to n-1 inclusive do
    key = A[i]
    j = i - 1
    while j >= 0 and A[j] > key do
      A[j+1] = A[j]
      j = j - 1
    end while
    A[j+1] = key
  end for
end procedure`,
  },
  'Merge Sort': {
    description:
      'Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm. It divides the unsorted list into n sublists each containing one element, then repeatedly merges sublists to produce sorted sublists until there is only one sorted list remaining.',
    complexities: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    pseudocode: `procedure mergeSort(var A as array)
  if (n == 1) return A

  mid = length(A) / 2
  l1 = A[0...mid]
  l2 = A[mid...end]

  l1 = mergeSort(l1)
  l2 = mergeSort(l2)

  return merge(l1, l2)
end procedure`,
  },
  'Quick Sort': {
    description:
      'Quick Sort is an in-place, divide-and-conquer, massively recursive algorithm. It picks an element as a pivot and partitions the array around it. While it has a worst-case time complexity of O(n²), it is usually significantly faster in practice than other O(n log n) algorithms.',
    complexities: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    pseudocode: `procedure quickSort(A, low, high)
  if low < high then
    pi = partition(A, low, high)
    quickSort(A, low, pi - 1)
    quickSort(A, pi + 1, high)
  end if
end procedure

procedure partition(A, low, high)
  pivot = A[high]
  i = low - 1
  for j = low to high - 1 do
    if A[j] < pivot then
      i = i + 1
      swap A[i] with A[j]
  swap A[i + 1] with A[high]
  return i + 1`,
  },
  'Heap Sort': {
    description:
      'Heap Sort can be thought of as an improved selection sort. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element. It utilizes a max-heap data structure to find the maximum efficiently.',
    complexities: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    pseudocode: `procedure heapSort(A)
  buildMaxHeap(A)
  for i = length(A) down to 1 do
    swap(A[0], A[i])
    heapSize = heapSize - 1
    maxHeapify(A, 0)
  end for
end procedure`,
  },
  'Counting Sort': {
    description:
      'Counting Sort is a non-comparison sorting algorithm. It operates by counting objects with distinct key values and applying prefix sums to determine positions in the output. It is incredibly fast but bounded by the maximum value in the array.',
    complexities: { best: 'Ω(n+k)', avg: 'Θ(n+k)', worst: 'O(n+k)', space: 'O(k)' },
    pseudocode: `procedure countingSort(A, k)
  count = array of k+1 zeros
  output = array of same length as A

  for x in A do
    count[x] = count[x] + 1

  for i = 1 to k do
    count[i] = count[i] + count[i-1]

  for i = length(A) down to 0 do
    output[count[A[i]]] = A[i]
    count[A[i]] = count[A[i]] - 1

  return output`,
  },
  'Radix Sort': {
    description:
      'Radix Sort is a non-comparative integer sorting algorithm that groups keys by individual digits sharing the same significant position. It relies on a stable subroutine (like Counting Sort) to sort digits iteratively from least significant to most significant.',
    complexities: { best: 'Ω(nk)', avg: 'Θ(nk)', worst: 'O(nk)', space: 'O(n+k)' },
    pseudocode: `procedure radixSort(A)
  max_val = maximum value in A
  exp = 1

  while max_val / exp > 0 do
    countingSortByDigit(A, exp)
    exp = exp * 10
  end while
end procedure`,
  },
};

/** Glow color (blue-500) — works on both the light and dark cards */
const GLOW = '59, 130, 246';

export function AlgorithmInfo({ algorithmName }: AlgorithmInfoProps) {
  const data = ALGORITHM_DATA[algorithmName];
  if (!data) return null;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {/* Left column: description + complexity table */}
      <div className="flex flex-col gap-6">
        {/* About card */}
        <ParticleCard
          glowColor={GLOW}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={true}
          className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 algo-glow-card"
        >
          {/* Inject the CSS variables the border-glow pseudo-element reads */}
          <style>{`
            .algo-glow-card {
              --glow-x: 50%; --glow-y: 50%;
              --glow-intensity: 0; --glow-radius: 220px;
            }
            .algo-glow-card::after {
              content: '';
              position: absolute;
              inset: 0;
              padding: 6px;
              background: radial-gradient(
                var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${GLOW}, calc(var(--glow-intensity) * 0.55)) 0%,
                rgba(${GLOW}, calc(var(--glow-intensity) * 0.25)) 35%,
                transparent 65%
              );
              border-radius: inherit;
              -webkit-mask: linear-gradient(#fff 0 0) content-box,
                            linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask: linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
              mask-composite: exclude;
              pointer-events: none;
              z-index: 1;
            }
          `}</style>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
            About {algorithmName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {data.description}
          </p>
        </ParticleCard>

        {/* Complexity table card */}
        <ParticleCard
          glowColor={GLOW}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={true}
          className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 algo-glow-card overflow-hidden"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">
            Complexity Profile
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  {['Best Case', 'Average Case', 'Worst Case', 'Space'].map((h) => (
                    <th
                      key={h}
                      className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 font-mono text-sm text-green-600 dark:text-green-400">
                    {data.complexities.best}
                  </td>
                  <td className="py-3 font-mono text-sm text-amber-600 dark:text-amber-400">
                    {data.complexities.avg}
                  </td>
                  <td className="py-3 font-mono text-sm text-red-600 dark:text-red-400">
                    {data.complexities.worst}
                  </td>
                  <td className="py-3 font-mono text-sm text-blue-600 dark:text-blue-400">
                    {data.complexities.space}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ParticleCard>
      </div>

      {/* Right column: pseudocode — dark card, indigo glow looks better here */}
      <ParticleCard
        glowColor="99, 102, 241"
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={true}
        className="p-6 bg-slate-900 dark:bg-black rounded-xl shadow-sm border border-slate-800 flex flex-col h-full algo-glow-card-dark"
      >
        <style>{`
          .algo-glow-card-dark {
            --glow-x: 50%; --glow-y: 50%;
            --glow-intensity: 0; --glow-radius: 220px;
          }
          .algo-glow-card-dark::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(
              var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(99,102,241, calc(var(--glow-intensity) * 0.7)) 0%,
              rgba(99,102,241, calc(var(--glow-intensity) * 0.3)) 35%,
              transparent 65%
            );
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box,
                          linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box,
                  linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 1;
          }
        `}</style>
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
          Pseudocode
        </h3>
        <pre className="text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap flex-1 leading-relaxed selection:bg-blue-500/30">
          {data.pseudocode}
        </pre>
      </ParticleCard>
    </div>
  );
}

/**
 * Runtime prop type validation using the prop-types library.
 * Ensures `algorithmName` is always a required string at runtime,
 * complementing the compile-time TypeScript interface above.
 */
AlgorithmInfo.propTypes = {
  algorithmName: PropTypes.string.isRequired,
};
