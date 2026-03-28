/**
 * @file algorithmCode.ts
 *
 * @description
 * Multi-language dictionary for the Code Studio.
 * Maps sorting algorithms to their exact implementations in 6 popular languages.
 * * The `lineMapping` object ties the visualizer's `currentOperation` state
 * directly to the 1-indexed line numbers of the code snippet, allowing for
 * real-time syntax highlighting during execution.
 */

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp';

export interface CodeSnippet {
  code: string;
  // Maps an operation string (e.g., 'compare', 'swap') to an array of line numbers
  lineMapping: Record<string, number[]>;
}

export type AlgorithmCodeMap = Record<SupportedLanguage, CodeSnippet>;

// ============================================================================
// ALGORITHM DICTIONARY
// ============================================================================

export const algorithmCodes: Record<string, AlgorithmCodeMap> = {
  // --------------------------------------------------------------------------
  // BUBBLE SORT
  // --------------------------------------------------------------------------
  bubble: {
    javascript: {
      lineMapping: { compare: [5], swap: [6, 7, 8] },
      code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    },
    python: {
      lineMapping: { compare: [5], swap: [6] },
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    },
    java: {
      lineMapping: { compare: [5], swap: [6, 7, 8] },
      code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    },
    cpp: {
      lineMapping: { compare: [5], swap: [6] },
      code: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    },
    c: {
      lineMapping: { compare: [5], swap: [6, 7, 8] },
      code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    },
    csharp: {
      lineMapping: { compare: [5], swap: [6, 7, 8] },
      code: `public static void BubbleSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    },
  },

  // --------------------------------------------------------------------------
  // QUICK SORT
  // --------------------------------------------------------------------------
  quick: {
    javascript: {
      lineMapping: { compare: [11], swap: [13, 14, 15, 18, 19, 20] },
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}`,
    },
    python: {
      lineMapping: { compare: [10], swap: [12, 14] },
      code: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
            
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    },
    java: {
      lineMapping: { compare: [11], swap: [13, 14, 15, 18, 19, 20] },
      code: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
    },
    cpp: {
      lineMapping: { compare: [11], swap: [13, 16] },
      code: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
    },
    c: {
      lineMapping: { compare: [11], swap: [13, 14, 15, 18, 19, 20] },
      code: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}`,
    },
    csharp: {
      lineMapping: { compare: [11], swap: [13, 14, 15, 18, 19, 20] },
      code: `public static void QuickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = Partition(arr, low, high);
        QuickSort(arr, low, pi - 1);
        QuickSort(arr, pi + 1, high);
    }
}

private static int Partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp1 = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp1;
    return i + 1;
}`,
    },
  },

  // --------------------------------------------------------------------------
  // MERGE SORT
  // --------------------------------------------------------------------------
  merge: {
    javascript: {
      lineMapping: { compare: [10], swap: [11] },
      code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    },
    python: {
      lineMapping: { compare: [9], swap: [10] },
      code: `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr)//2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(l, r):
    res=[]; i=j=0
    while i<len(l) and j<len(r):
        if l[i]<r[j]: res.append(l[i]); i+=1
        else: res.append(r[j]); j+=1
    return res+l[i:]+r[j:]`,
    },
    java: {
      lineMapping: { compare: [14], swap: [15] },
      code: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length/2;
    int[] left = Arrays.copyOfRange(arr,0,mid);
    int[] right = Arrays.copyOfRange(arr,mid,arr.length);
    return merge(mergeSort(left), mergeSort(right));
}
static int[] merge(int[] l,int[] r){
    int[] res=new int[l.length+r.length];
    int i=0,j=0,k=0;
    while(i<l.length&&j<r.length){
        if(l[i]<r[j]) res[k++]=l[i++];
        else res[k++]=r[j++];
    }
    while(i<l.length) res[k++]=l[i++];
    while(j<r.length) res[k++]=r[j++];
    return res;
}`,
    },
    cpp: {
      lineMapping: { compare: [13], swap: [14] },
      code: `vector<int> mergeSort(vector<int> arr){
    if(arr.size()<=1) return arr;
    int mid=arr.size()/2;
    vector<int> l(arr.begin(),arr.begin()+mid);
    vector<int> r(arr.begin()+mid,arr.end());
    l=mergeSort(l); r=mergeSort(r);
    vector<int> res;
    int i=0,j=0;
    while(i<l.size()&&j<r.size()){
        if(l[i]<r[j]) res.push_back(l[i++]);
        else res.push_back(r[j++]);
    }
    while(i<l.size()) res.push_back(l[i++]);
    while(j<r.size()) res.push_back(r[j++]);
    return res;
}`,
    },
    c: {
      lineMapping: { compare: [13], swap: [14] },
      code: `void merge(int arr[],int l,int m,int r){
    int n1=m-l+1,n2=r-m;
    int L[n1],R[n2];
    for(int i=0;i<n1;i++)L[i]=arr[l+i];
    for(int j=0;j<n2;j++)R[j]=arr[m+1+j];
    int i=0,j=0,k=l;
    while(i<n1&&j<n2){
        if(L[i]<R[j]) arr[k++]=L[i++];
        else arr[k++]=R[j++];
    }
    while(i<n1) arr[k++]=L[i++];
    while(j<n2) arr[k++]=R[j++];
}
void mergeSort(int arr[],int l,int r){
    if(l<r){
        int m=(l+r)/2;
        mergeSort(arr,l,m);
        mergeSort(arr,m+1,r);
        merge(arr,l,m,r);
    }
}`,
    },
    csharp: {
      lineMapping: { compare: [14], swap: [15] },
      code: `public static int[] MergeSort(int[] arr){
    if(arr.Length<=1) return arr;
    int mid=arr.Length/2;
    int[] l=arr.Take(mid).ToArray();
    int[] r=arr.Skip(mid).ToArray();
    return Merge(MergeSort(l),MergeSort(r));
}
static int[] Merge(int[] l,int[] r){
    List<int> res=new List<int>();
    int i=0,j=0;
    while(i<l.Length&&j<r.Length){
        if(l[i]<r[j]) res.Add(l[i++]);
        else res.Add(r[j++]);
    }
    while(i<l.Length) res.Add(l[i++]);
    while(j<r.Length) res.Add(r[j++]);
    return res.ToArray();
}`,
    },
  },

  // --------------------------------------------------------------------------
  // INSERTION SORT
  // --------------------------------------------------------------------------
  insertion: {
    javascript: {
      lineMapping: { compare: [5], swap: [6] },
      code: `function insertionSort(arr){
  for(let i=1;i<arr.length;i++){
    let key=arr[i],j=i-1;
    while(j>=0&&arr[j]>key){
      arr[j+1]=arr[j]; j--;
    }
    arr[j+1]=key;
  }
  return arr;
}`,
    },
    python: {
      lineMapping: { compare: [5], swap: [6] },
      code: `def insertion_sort(arr):
    for i in range(1,len(arr)):
        key=arr[i]; j=i-1
        while j>=0 and arr[j]>key:
            arr[j+1]=arr[j]; j-=1
        arr[j+1]=key
    return arr`,
    },
    java: {
      lineMapping: { compare: [6], swap: [7] },
      code: `public static void insertionSort(int[] arr){
    for(int i=1;i<arr.length;i++){
        int key=arr[i],j=i-1;
        while(j>=0&&arr[j]>key){
            arr[j+1]=arr[j]; j--;
        }
        arr[j+1]=key;
    }
}`,
    },
    cpp: {
      lineMapping: { compare: [6], swap: [7] },
      code: `void insertionSort(vector<int>& arr){
    for(int i=1;i<arr.size();i++){
        int key=arr[i],j=i-1;
        while(j>=0&&arr[j]>key){
            arr[j+1]=arr[j]; j--;
        }
        arr[j+1]=key;
    }
}`,
    },
    c: {
      lineMapping: { compare: [6], swap: [7] },
      code: `void insertionSort(int arr[],int n){
    for(int i=1;i<n;i++){
        int key=arr[i],j=i-1;
        while(j>=0&&arr[j]>key){
            arr[j+1]=arr[j]; j--;
        }
        arr[j+1]=key;
    }
}`,
    },
    csharp: {
      lineMapping: { compare: [6], swap: [7] },
      code: `public static void InsertionSort(int[] arr){
    for(int i=1;i<arr.Length;i++){
        int key=arr[i],j=i-1;
        while(j>=0&&arr[j]>key){
            arr[j+1]=arr[j]; j--;
        }
        arr[j+1]=key;
    }
}`,
    },
  },

  // --------------------------------------------------------------------------
  // SELECTION SORT
  // --------------------------------------------------------------------------
  selection: {
    javascript: {
      lineMapping: { compare: [6], swap: [9] },
      code: `function selectionSort(arr){
  for(let i=0;i<arr.length;i++){
    let min=i;
    for(let j=i+1;j<arr.length;j++){
      if(arr[j]<arr[min]) min=j;
    }
    [arr[i],arr[min]]=[arr[min],arr[i]];
  }
  return arr;
}`,
    },
    python: {
      lineMapping: { compare: [6], swap: [8] },
      code: `def selection_sort(arr):
    for i in range(len(arr)):
        min_i=i
        for j in range(i+1,len(arr)):
            if arr[j]<arr[min_i]: min_i=j
        arr[i],arr[min_i]=arr[min_i],arr[i]
    return arr`,
    },
    java: {
      lineMapping: { compare: [7], swap: [10] },
      code: `public static void selectionSort(int[] arr){
    for(int i=0;i<arr.length;i++){
        int min=i;
        for(int j=i+1;j<arr.length;j++){
            if(arr[j]<arr[min]) min=j;
        }
        int t=arr[i]; arr[i]=arr[min]; arr[min]=t;
    }
}`,
    },
    cpp: {
      lineMapping: { compare: [7], swap: [10] },
      code: `void selectionSort(vector<int>& arr){
    for(int i=0;i<arr.size();i++){
        int min=i;
        for(int j=i+1;j<arr.size();j++){
            if(arr[j]<arr[min]) min=j;
        }
        swap(arr[i],arr[min]);
    }
}`,
    },
    c: {
      lineMapping: { compare: [7], swap: [10] },
      code: `void selectionSort(int arr[],int n){
    for(int i=0;i<n;i++){
        int min=i;
        for(int j=i+1;j<n;j++){
            if(arr[j]<arr[min]) min=j;
        }
        int t=arr[i]; arr[i]=arr[min]; arr[min]=t;
    }
}`,
    },
    csharp: {
      lineMapping: { compare: [7], swap: [10] },
      code: `public static void SelectionSort(int[] arr){
    for(int i=0;i<arr.Length;i++){
        int min=i;
        for(int j=i+1;j<arr.Length;j++){
            if(arr[j]<arr[min]) min=j;
        }
        int t=arr[i]; arr[i]=arr[min]; arr[min]=t;
    }
}`,
    },
  },

  // --------------------------------------------------------------------------
  // HEAP SORT
  // --------------------------------------------------------------------------
  heap: {
    javascript: {
      lineMapping: { compare: [11, 12], swap: [5, 14] },
      code: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    },
    python: {
      lineMapping: { compare: [10, 12], swap: [5, 14] },
      code: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1): heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i; l = 2 * i + 1; r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    },
    java: {
      lineMapping: { compare: [11, 12], swap: [6, 15] },
      code: `public static void heapSort(int arr[]) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}
void heapify(int arr[], int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`,
    },
    cpp: {
      lineMapping: { compare: [11, 12], swap: [6, 14] },
      code: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
void heapify(vector<int>& arr, int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`,
    },
    c: {
      lineMapping: { compare: [11, 12], swap: [6, 15] },
      code: `void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}
void heapify(int arr[], int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`,
    },
    csharp: {
      lineMapping: { compare: [11, 12], swap: [6, 15] },
      code: `public static void HeapSort(int[] arr) {
    int n = arr.Length;
    for (int i = n / 2 - 1; i >= 0; i--) Heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        Heapify(arr, i, 0);
    }
}
static void Heapify(int[] arr, int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        Heapify(arr, n, largest);
    }
}`,
    },
  },

  // --------------------------------------------------------------------------
  // COUNTING SORT
  // --------------------------------------------------------------------------
  counting: {
    javascript: {
      lineMapping: { overwrite: [8] },
      code: `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  let output = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) count[arr[i]]++;
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  return arr;
}`,
    },
    python: {
      lineMapping: { overwrite: [8] },
      code: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    output = [0] * len(arr)
    for i in range(len(arr)): count[arr[i]] += 1
    for i in range(1, len(count)): count[i] += count[i - 1]
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1
    for i in range(len(arr)): arr[i] = output[i]
    return arr`,
    },
    java: {
      lineMapping: { overwrite: [9] },
      code: `public static void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    int[] output = new int[arr.length];
    for (int i = 0; i < arr.length; i++) count[arr[i]]++;
    for (int i = 1; i <= max; i++) count[i] += count[i - 1];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    },
    cpp: {
      lineMapping: { overwrite: [9] },
      code: `void countingSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    vector<int> count(max + 1, 0);
    vector<int> output(arr.size());
    for (int i = 0; i < arr.size(); i++) count[arr[i]]++;
    for (int i = 1; i <= max; i++) count[i] += count[i - 1];
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < arr.size(); i++) arr[i] = output[i];
}`,
    },
    c: {
      lineMapping: { overwrite: [15] },
      code: `void countingSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    int* count = (int*)calloc(max + 1, sizeof(int));
    int* output = (int*)malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) count[arr[i]]++;
    for (int i = 1; i <= max; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
    free(count); free(output);
}`,
    },
    csharp: {
      lineMapping: { overwrite: [9] },
      code: `public static void CountingSort(int[] arr) {
    int max = arr.Max();
    int[] count = new int[max + 1];
    int[] output = new int[arr.Length];
    for (int i = 0; i < arr.Length; i++) count[arr[i]]++;
    for (int i = 1; i <= max; i++) count[i] += count[i - 1];
    for (int i = arr.Length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < arr.Length; i++) arr[i] = output[i];
}`,
    },
  },

  // --------------------------------------------------------------------------
  // RADIX SORT
  // --------------------------------------------------------------------------
  radix: {
    javascript: {
      lineMapping: { overwrite: [12] },
      code: `function radixSort(arr) {
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
    countSort(arr, exp);
  return arr;
}
function countSort(arr, exp) {
  let output = new Array(arr.length), count = new Array(10).fill(0);
  for (let i = 0; i < arr.length; i++) count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    },
    python: {
      lineMapping: { overwrite: [12] },
      code: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_radix(arr, exp)
        exp *= 10
    return arr

def counting_sort_radix(arr, exp):
    n = len(arr); output = [0] * n; count = [0] * 10
    for i in range(n): index = arr[i] // exp; count[index % 10] += 1
    for i in range(1, 10): count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
    for i in range(n): arr[i] = output[i]`,
    },
    java: {
      lineMapping: { overwrite: [14] },
      code: `public static void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10)
        countSort(arr, exp);
}
static void countSort(int[] arr, int exp) {
    int[] output = new int[arr.length];
    int[] count = new int[10];
    for (int i = 0; i < arr.length; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (int i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    },
    cpp: {
      lineMapping: { overwrite: [14] },
      code: `void countSort(vector<int>& arr, int exp) {
    vector<int> output(arr.size());
    vector<int> count(10, 0);
    for (int i = 0; i < arr.size(); i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (int i = 0; i < arr.size(); i++) arr[i] = output[i];
}
void radixSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    for (int exp = 1; max / exp > 0; exp *= 10)
        countSort(arr, exp);
}`,
    },
    c: {
      lineMapping: { overwrite: [14] },
      code: `void countSort(int arr[], int n, int exp) {
    int* output = (int*)malloc(n * sizeof(int));
    int count[10] = { 0 };
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
    free(output);
}
void radixSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) if (arr[i] > max) max = arr[i];
    for (int exp = 1; max / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
    },
    csharp: {
      lineMapping: { overwrite: [14] },
      code: `public static void RadixSort(int[] arr) {
    int max = arr.Max();
    for (int exp = 1; max / exp > 0; exp *= 10)
        CountSort(arr, exp);
}
static void CountSort(int[] arr, int exp) {
    int[] output = new int[arr.Length];
    int[] count = new int[10];
    for (int i = 0; i < arr.Length; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = arr.Length - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (int i = 0; i < arr.Length; i++) arr[i] = output[i];
}`,
    },
  },
};
