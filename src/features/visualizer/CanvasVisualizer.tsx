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
 * THEME SYNCHRONIZATION (THE CANVAS LIMITATION):
 * Standard Tailwind CSS `dark:` classes cannot penetrate the <canvas> element
 * to style the mathematically drawn shapes inside it. Therefore, this component
 * directly consumes the global `ThemeContext` to monitor state and imperatively
 * swaps the hex codes during the paint cycle, ensuring the canvas perfectly
 * synchronizes with the application's Dark Mode shell.
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. O(N) Caching: `maxVal` is computed exactly once per newly generated array,
 * rather than recalculating it inside the 60fps render loop.
 * 2. O(1) Lookups: `activeIndices` is converted to a Hash Set inside the loop,
 * reducing the color-check time from O(N) to O(1) for every single painted bar.
 */

import { useEffect, useRef, useMemo } from 'react';
import type { SortOperation } from '../../types/sort.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

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

  // Consume the global theme state
  const { theme } = useTheme();

  // OPTIMIZATION: Calculate the maximum value only once per array, not at 60fps
  const maxVal = useMemo(() => {
    let max = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > max) max = array[i];
    }
    return max;
  }, [array]);

  // DYNAMIC THEME COLORS: Memoize the hex codes so the canvas knows what to paint
  const colors = useMemo(() => {
    return theme === 'dark'
      ? {
          default: '#86efac', // Default bars (soft green - base state)
          compare: '#fde047', // Comparing elements (bright yellow highlight)
          swap: '#fb7185', // Swapping elements (strong red/pink signal)
          active: '#22c55e', // Active/selected elements (vivid green - main focus)
        }
      : {
          default: '#1e293b', // Default bars (dark slate for light background)
          compare: '#f59e0b', // Comparing elements (amber/orange highlight)
          swap: '#ef4444', // Swapping elements (clear red signal)
          active: '#16a34a', // Active/selected elements (rich green accent)
        };
  }, [theme]);

  //Another color palette 
  /*
  const colors = useMemo(() => {
    return theme === 'dark'
      ? {
          default: '#334155', // slate-700 (Dark, sleek bars)
          compare: '#fbbf24', // amber-400 (Vibrant yellow/orange)
          swap: '#f43f5e', // rose-500 (Punchy neon red)
          active: '#60a5fa', // blue-400 (Fallback active state)
        }
      : {
          default: '#64748b', // slate-500
          compare: '#eab308', // yellow-500
          swap: '#ef4444', // red-500
          active: '#3b82f6', // blue-500
        };
  }, [theme]);
  */

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

    // OPTIMIZATION: Convert active array to a Set for instant O(1) lookup
    const activeSet = new Set(activeIndices);

    // Paint the current array state
    for (let i = 0; i < n; ++i) {
      const value = array[i];
      const barHeight = (value / maxVal) * rect.height;

      // Opacity (depth effect)
      ctx.globalAlpha = activeSet.has(i) ? 1 : 0.65;

      // Glow (only for active bars)
      if (activeSet.has(i)) {
        ctx.shadowColor = colors.active;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }

      // Determine bar color based on engine's current operation AND current theme
      if (activeSet.has(i)) {
        ctx.fillStyle =
          operation === 'swap' || operation === 'overwrite'
            ? colors.swap
            : operation === 'compare'
              ? colors.compare
              : colors.active;
      } else {
        ctx.fillStyle = colors.default;
      }

      // Draw the rectangle: (x, y, width, height)
      // Note: y is calculated from the top down, so we subtract barHeight from rect.height
      ctx.fillRect(i * barWidth, rect.height - barHeight, barWidth, barHeight);
    }

    //Reset
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [array, activeIndices, operation, maxVal, colors]);

  return (
    <div className="w-full h-[40vh] min-h-75 md:h-125 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 transition-colors duration-300 shadow-inner">
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
