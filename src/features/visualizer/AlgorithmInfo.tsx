/**
 * @file AlgorithmInfo.tsx
 * @description Displays the educational theory, complexities, and pseudocode for the selected algorithm.
 */

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
      'Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items. It proceeds by finding the smallest element in the unsorted sublist, exchanging it with the leftmost unsorted element, and moving the sublist boundaries.',
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
      'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, it performs incredibly well for very small or nearly sorted datasets.',
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
      'Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm. It divides the unsorted list into n sublists, each containing one element, and then repeatedly merges sublists to produce new sorted sublists until there is only one sorted list remaining.',
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
      'Quick Sort is an in-place, divide-and-conquer, massively recursive algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. While it has a worst-case time complexity of O(n²), it is usually significantly faster in practice than other O(n log n) algorithms.',
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
      'Heap Sort can be thought of as an improved selection sort. It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region. It utilizes a max-heap data structure to find the maximum efficiently.',
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
      'Counting Sort is a non-comparison sorting algorithm. It operates by counting the number of objects that possess distinct key values, and applying prefix sums on those counts to determine the positions of each key value in the output sequence. It is incredibly fast but bounded by the maximum value in the array.',
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
      'Radix Sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value. It relies on a stable sorting subroutine (like Counting Sort) to sort the digits iteratively from least significant to most significant.',
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

export function AlgorithmInfo({ algorithmName }: AlgorithmInfoProps) {
  const data = ALGORITHM_DATA[algorithmName];

  if (!data) return null;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Theory & Table */}
      <div className="flex flex-col gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
            About {algorithmName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {data.description}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">
            Complexity Profile
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Best Case
                  </th>
                  <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Average Case
                  </th>
                  <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Worst Case
                  </th>
                  <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Space Complexity
                  </th>
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
        </div>
      </div>

      {/* Right Column: Pseudocode */}
      <div className="p-6 bg-slate-900 dark:bg-black rounded-xl shadow-sm border border-slate-800 flex flex-col h-full">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
          Pseudocode
        </h3>
        <pre className="text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap flex-1 leading-relaxed selection:bg-blue-500/30">
          {data.pseudocode}
        </pre>
      </div>
    </div>
  );
}
