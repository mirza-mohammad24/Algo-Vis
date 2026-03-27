/**
 * @file CanvasVisualizer.tsx
 *
 * @description
 * High-performance presentation layer for the sorting visualizer.
 * Renders the current state of the sorting engine as a dynamic bar chart.
 *
 * @architecture
 * THE DOM BYPASS (GPU ACCELERATION):
 * Rendering N=1000 standard React <div> elements 60 times a second causes
 * severe layout thrashing and chokes the browser's main thread.
 * To achieve smooth 60fps at massive scale, this component abandons the React DOM
 * for the individual bars. Instead, it renders a single <canvas> node and uses
 * imperative JavaScript to paint the array directly using the native Canvas2D API.
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. O(N) Caching: `maxVal` is computed exactly once per newly generated array,
 * rather than recalculating it inside the 60fps render loop.
 * 2. O(1) Lookups: `activeIndices` is converted to a Hash Set inside the loop,
 * reducing the color-check time from O(N) to O(1) for every single painted bar.
 */

import { useEffect, useRef, useMemo } from 'react';
import type { SortOperation } from '../../types/sort.ts';

/**
 * Props for the CanvasVisualizer component.
 * This component is strictly decoupled from the engine logic; it only receives pure data.
 */
interface CanvasVisualizerProps {
  /** The current immutable snapshot of the sorting array. */
  array: readonly number[];
  /** Array of indices currently being compared or swapped. */
  activeIndices: readonly number[];
  /** The current semantic operation (used to determine highlight color). */
  operation: SortOperation | null;
}

/**
 * Renders the sorting visualization on an HTML5 Canvas.
 */
export function CanvasVisualizer({ array, activeIndices, operation }: CanvasVisualizerProps) {
  // Reference to the actual DOM node for the Canvas API
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // OPTIMIZATION: Calculate the maximum value only once per array, not at 60fps
  const maxVal = useMemo(() => {
    let max = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > max) max = array[i];
    }
    return max;
  }, [array]);

  /**
   * THE PAINT CYCLE
   * This effect triggers every time the engine yields a new frame.
   * It handles all the imperative drawing logic.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-resolution (Retina) displays so the canvas isn't blurry
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Match internal coordinate system to physical device pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Wipe the previous frame clean
    ctx.clearRect(0, 0, rect.width, rect.height);

    const n = array.length;
    if (n === 0) return;

    const barWidth = rect.width / n;

    // OPTIMIZATION 2: Convert active array to a Set for instant O(1) lookup
    const activeSet = new Set(activeIndices);

    // Paint the current array state
    for (let i = 0; i < n; ++i) {
      const value = array[i];
      const barHeight = (value / maxVal) * rect.height;

      // Determine bar color based on engine's current operation
      if (activeSet.has(i)) {
        ctx.fillStyle =
          operation === 'swap'
            ? '#ef4444' // Red (Visually heaviest)
            : operation === 'compare'
              ? '#eab308' // Yellow (Visually lighter)
              : '#3b82f6'; // Blue (Fallback active state)
      } else {
        ctx.fillStyle = '#64748b'; // Slate Gray (Inactive default)
      }

      // Draw the rectangle: (x, y, width, height)
      // Note: y is calculated from the top down, so we subtract barHeight from rect.height
      ctx.fillRect(i * barWidth, rect.height - barHeight, barWidth, barHeight);
    }
  }, [array, activeIndices, operation, maxVal]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden bg-slate-50">
      {/* CSS controls the container size, JavaScript scales the internal drawing resolution */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
