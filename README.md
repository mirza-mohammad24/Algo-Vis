# AlgoVis ⚡

A high-performance, multi-mode sorting algorithm visualizer and interactive code learning platform built entirely on a GPU-accelerated async generator engine.

---

## 📖 Overview

**What the project does:** AlgoVis renders 8 distinct sorting algorithms at 60 frames per second using a custom-built HTML5 Canvas engine, decoupled entirely from React's reconciliation cycle. It pairs this with a multi-language Code Studio that highlights the exact line of code executing in real time, an Algorithm Race Mode for head-to-head empirical comparison, and a Big O Complexity Dashboard that converts abstract notation into human-readable hardware execution times.

**Why it exists:** Most sorting visualizers are static demos. AlgoVis treats the visualizer as a full-stack engineering problem — the rendering layer, the execution engine, the code synchronization system, and the audio synthesis module are each independently architected and connected through a strict unidirectional data contract. The goal was to build something genuinely useful for learning, not just impressive to look at.

**Who it is for:** Computer science students, developers learning algorithms, and anyone who learns better by watching and hearing a system work than by reading pseudocode on a whiteboard.

---

## ✨ Features

### Core Engine

- **Async Generator Architecture** — Every algorithm is implemented as an `async function*` that yields `SortFrame` snapshots at each comparison, swap, and overwrite. This is what enables pause, step, and race mode without any architectural hacks.
- **Dynamic Frame Sampling** — At N=1000, the engine samples every 40th frame for rendering while tracking metrics on every single frame. At N=10, every frame renders. The SAMPLE_RATE scales as `Math.floor(N / 25)`, keeping both small and large arrays smooth.
- **State Machine Control** — `play`, `pause`, `step`, and `reset` are deterministic transitions. Refs manage engine internals; `useState` manages only what the UI renders. This prevents the render cycle from ever interfering with the execution loop.

### Sorting Visualizer (`/visualizer`)

- Real-time GPU-accelerated bar chart via HTML5 Canvas API (bypasses React DOM entirely)
- Retina DPR-aware rendering — no blurry bars on HiDPI displays
- Theme-aware colour palettes — compare/swap/active bars change colour in both light and dark mode
- Bar glow effect and opacity depth on inactive bars
- ElasticSlider (Motion/React) for array size (10–1000) and delay (0–200ms) controls
- Algorithm dropdown — switching algorithms kills the old generator and initialises a fresh one immediately
- Live comparisons and swaps counters backed by `metricsRef` (never loses count even at N=1000)
- Web Audio API sound synthesis — bar height mapped to oscillator frequency (200–1200Hz), triangle wave, exponential gain envelope to prevent clicks
- Educational info panel (description, complexity table, pseudocode) with GSAP ParticleCard hover effect

### Code Studio (`/study`)

- Fixed array size (N=24) and delay (450ms) — constraints that make the feature actually readable
- **Zero-dependency syntax highlighter** — tokenizes code character-by-character with priority-ordered rules for comments, strings, keywords, types, function calls, numbers, and operators. VS Code dark theme colours. No Prism, no Shiki.
- Operation-specific line highlights that mirror the canvas colours exactly: amber for compare, rose for swap, blue for overwrite, violet for pivot, emerald for done
- 6 programming languages: Python, Java, C++, JavaScript, C, C# — language tabs with coloured dot badges
- Auto-scroll keeps the active line centred in the viewport
- Mac-style window chrome with status bar showing line count and active language
- Educational deep-dive module for each algorithm: intuition, key insight, step-by-step walkthrough, stability, in-place status, space complexity, and real-world use cases
- Cross-linked bidirectionally with the Visualizer page

### Algorithm Race Mode (`/race`)

- Up to 4 algorithms competing simultaneously on the exact same starting array
- Independent `useSortEngine` instances — scientifically fair comparison
- Real-time finish detection with millisecond-precision timing
- Animated leaderboard modal (Motion/React) with gold/silver/bronze podium styling
- ElasticSlider controls for array size and speed delay
- Add/remove competitors mid-session; reset regenerates a fresh shared dataset

### Big O Complexity Dashboard (`/complexity`)

- Recharts AreaChart with gradient fills plotting O(N), O(N log N), and O(N²) curves
- Slider scales from N=10 to N=1,000,000 — watch quadratic complexity detach from the axis
- Custom tooltip with hardware time estimation: translates raw operation counts to milliseconds, seconds, minutes, hours, days, or years at 10⁸ ops/sec
- Y-axis auto-scales from raw values to K/M/B/T notation

### Application Shell

- React Router v7 with 5 routes, `ScrollToTop` utility resets scroll position on navigation
- `ThemeContext` with dark/light/system preference detection, localStorage persistence, and a circular reveal animation via the View Transitions API (ripples from exact click coordinates)
- `ErrorBoundary` class component — catches rendering errors in any page, displays graceful fallback UI with "Reboot Engine" reload action
- GSAP PillNav with active route highlighting via `useLocation`
- `DecryptedText`, `ScrollFloat`, and `MagicBento` ReactBits components on the landing page
- Rising Bars SVG logo icon used in both the browser tab favicon and the navbar

---

## 🛠️ Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| UI Framework    | React 19                  |
| Language        | TypeScript 5.9            |
| Styling         | Tailwind CSS v4           |
| Routing         | React Router v7           |
| Bundler         | Vite 8                    |
| Animation       | GSAP 3 + Motion/React 12  |
| Charts          | Recharts 3                |
| Audio           | Web Audio API (native)    |
| Rendering       | HTML5 Canvas API (native) |
| Package Manager | Bun                       |

---

## 🖼️ Preview

> Screenshots — add your own after running the project locally.

| Page          | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `/`           | Landing page with DecryptedText hero and MagicBento architecture grid   |
| `/visualizer` | Full-screen canvas with ElasticSlider controls and algorithm info panel |
| `/study`      | Split canvas + IDE-style code panel with live line highlighting         |
| `/race`       | Head-to-head algorithm race with animated leaderboard                   |
| `/complexity` | Interactive Big O area chart with hardware time estimation              |

---

## 🧠 How It Works

### The Engine Pipeline

```
Algorithm (async function*)
  ↓  yields SortFrame on every significant operation
useSortEngine (React hook / state machine)
  ↓  pulls frames via .next(), sleeps between renders
SortState (React useState — only what the UI renders)
  ↓  passed as props
UI Components (CanvasVisualizer, CodePanel, RaceLane…)
```

Every algorithm is a pure async generator. Calling `bubbleSort([3, 1, 2])` does not execute any sorting logic — it returns a generator control object. The engine calls `.next()` on that object inside a `while` loop, sleeping between frames using `await setTimeout`. This is what makes pause, step, and concurrent race execution trivially correct: pausing flips `isRunningRef` to false, which exits the `while` loop at the next iteration without disrupting the generator's internal cursor.

### Code-to-Animation Synchronisation

The Code Studio maps the engine's `currentOperation` (`'compare' | 'swap' | 'overwrite' | 'pivot' | 'done'`) to line numbers via a `lineMapping` object defined per algorithm per language in `algorithmCode.ts`. When the engine emits `operation: 'swap'`, the CodePanel looks up `lineMapping['swap']` and highlights those lines. Because the study page fixes N=24 and delay=450ms, each operation is visible for nearly half a second — enough to read the highlighted line before the next frame arrives.

### Canvas Rendering

`CanvasVisualizer` renders nothing through React's virtual DOM. Each frame, it calls `clearRect` and repaints all N bars in a single synchronous `for` loop. Active indices are stored in a `Set` for O(1) lookup during painting. The canvas dimensions are multiplied by `window.devicePixelRatio` and the transform matrix is set accordingly, ensuring crisp rendering on Retina displays.

### Audio Synthesis

`useAudioEngine` creates an `OscillatorNode + GainNode` pair on every frame where `activeIndices` is non-empty. The array value at `activeIndices[0]` is mapped to a frequency between 200Hz and 1200Hz. An exponential gain ramp decays to near-zero in 80ms to avoid the click artefact that occurs when oscillators are stopped abruptly at non-zero amplitude.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ or Bun v1+
- A Chromium-based browser for best Web Audio API support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/algovis.git
cd algovis

# Install dependencies (Bun recommended)
bun install
# or
npm install
```

### Running locally

```bash
# Start the development server
bun dev
# or
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
bun run build
# or
npm run build
```

The output is in `dist/`. Preview it with:

```bash
bun run preview
```

### Linting and formatting

```bash
bun run lint          # ESLint
bun run lint:fix      # ESLint with auto-fix
bun run format        # Prettier
bun run format:check  # Prettier dry-run
```

---

## 📂 Project Structure

```
src/
├── algorithms/                   # 8 sorting algorithms as async generators
│   ├── bubbleSort.ts
│   ├── selectionSort.ts
│   ├── insertionSort.ts
│   ├── mergeSort.ts
│   ├── quickSort.ts
│   ├── heapSort.ts
│   ├── countingSort.ts
│   └── radixSort.ts
│
├── types/
│   └── sort.ts                   # Core contracts: SortFrame, SortGenerator, SortAlgorithm, SortState, SortMetrics
│
├── hooks/
│   ├── useSortEngine.ts          # State machine engine: play/pause/step/reset + dynamic frame sampling
│   └── useAudioEngine.ts         # Web Audio API wrapper: oscillator frequency mapping + gain envelope
│
├── context/
│   └── ThemeContext.tsx          # Light/dark theme: localStorage + OS detection + View Transitions API
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # GSAP PillNav + Rising Bars logo + theme toggle
│   │   ├── Footer.tsx            # Navigation links, tech stack, social links
│   │   └── ErrorBoundary.tsx     # Class component: getDerivedStateFromError + componentDidCatch
│   └── ReactBits/
│       ├── DecryptedText.tsx     # Scramble animation on hero headline
│       ├── ScrollFloat.tsx       # GSAP scroll-triggered letter animation
│       ├── PillNav.tsx           # GSAP animated navigation pill
│       ├── ElasticSlider.tsx     # Spring/elastic slider via Motion/React
│       └── MagicBento.tsx        # GSAP particle cards + global radial spotlight
│
├── features/
│   ├── visualizer/
│   │   ├── Visualizer.tsx        # Main dashboard: engine → canvas → controls → info
│   │   ├── CanvasVisualizer.tsx  # HTML5 Canvas renderer (DPR-aware, theme-aware, glow effects)
│   │   ├── Controls.tsx          # ElasticSlider controls, algorithm dropdown, sound toggle
│   │   └── AlgorithmInfo.tsx     # Complexity table, pseudocode, ParticleCard glow
│   ├── study/
│   │   ├── CodePanel.tsx         # IDE-style viewer: syntax highlight + operation line sync + auto-scroll
│   │   ├── SyntaxHighlighter.tsx # Zero-dependency tokenizer: keywords, strings, numbers, operators
│   │   └── algorithmCode.ts      # 8 algorithms × 6 languages × lineMapping dictionary
│   ├── race/
│   │   └── RaceLane.tsx          # Single race competitor: independent engine + canvas + finish callback
│   └── complexity/
│       └── ComplexityChart.tsx   # Recharts AreaChart: O(N)/O(N log N)/O(N²) with hardware time tooltip
│
├── pages/
│   ├── Home.tsx                  # Landing: hero + MagicBento feature grid
│   ├── VisualizerPage.tsx        # Wraps Visualizer in ErrorBoundary
│   ├── RacePage.tsx              # Race orchestrator: shared array + leaderboard + competitor management
│   ├── StudyPage.tsx             # Code Studio: fixed N=24/450ms + CodePanel + educational module
│   └── ComplexityPage.tsx        # Big O Dashboard: slider + chart
│
├── utils/
│   └── ScrollToTop.tsx           # Resets scroll on route change
│
├── App.tsx                       # Router + ThemeProvider + AppLayout
├── main.tsx                      # ReactDOM.createRoot entry point
└── index.css                     # Tailwind import + spinner removal + View Transitions keyframes

public/
└── favicon.svg                   # Rising Bars icon (inline SVG, no external dependency)
```

---

## 🎓 Educational Value

### Why this project teaches algorithms better than a textbook

**Watching is understanding.** When you set array size to 50 and delay to 100ms, you can see exactly why Bubble Sort is O(n²) — the inner loop churns through the same elements repeatedly, and the bars barely move in the early passes. Switch to Merge Sort and the divide-and-conquer structure is immediately visible in how the highlighted bars jump between distant positions.

**The Step button is a study tool.** On the Code Studio page at N=24 with a 450ms delay, pressing Step once advances the engine by exactly one operation and highlights the corresponding line in the language of your choice. You can manually step through all 576 comparisons of Bubble Sort on a 24-element array and watch the pseudocode change on every single press.

**Race Mode proves Big O empirically.** Set N=200 and race Bubble Sort against Quick Sort. The leaderboard will show Quick Sort finishing in seconds while Bubble Sort is still churning. This is not a textbook graph — it's the algorithm's actual behaviour on your machine, timed to the millisecond.

**The Complexity Dashboard makes O(n²) visceral.** At N=1000, the tooltip shows Bubble Sort would need ~10ms. At N=1,000,000, it says "2.78 hours." These are not theoretical numbers — they are computed from a real operations estimate at 10⁸ ops/sec. Students who have memorised "quadratic is bad" finally understand _why_ when they see the number change from milliseconds to hours by moving a slider.

---

## 🔮 Future Improvements

- **More algorithms** — Shell Sort, Tim Sort, Cocktail Shaker Sort, Bitonic Sort
- **Hexagonal grid layout** — Alternative canvas renderer for the Visualizer
- **Custom input** — Allow users to paste their own array (comma-separated values) instead of only random generation
- **Shareable state** — URL-encoded algorithm + array size so a specific configuration can be linked
- **Complexity Dashboard: empirical mode** — Run each algorithm silently at multiple N values and plot actual measured operation counts alongside theoretical curves
- **Mobile touch controls** — The ElasticSlider and Race Mode currently work best on desktop; a dedicated mobile layout would improve accessibility
- **Battery-aware throttling** — Detect `navigator.getBattery()` and reduce `requestAnimationFrame` rate when on low battery

---

## 📄 License

This project is distributed under the MIT License.
