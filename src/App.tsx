/**
 * @file App.tsx
 *
 * @description
 * The root component of the Sorting Visualizer application.
 */

import { Visualizer } from "./features/visualizer/Visualizer.tsx";

function App() {
  return (
    <main className="min-h-screen bg-slate-100 py-12 font-sans">
      <Visualizer />
    </main>
  );
}

export default App;
