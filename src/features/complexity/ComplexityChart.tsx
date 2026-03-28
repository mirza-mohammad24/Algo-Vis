/**
 * @file ComplexityChart.tsx
 *
 * @description
 * Feature component that handles the mathematical data generation and SVG plotting
 * for the Big O Time Complexity dashboard. Safely scales up to N=1,000,000.
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComplexityChartProps {
  maxElements: number;
}

// Generates an array of data points safely up to maxElements
function generateComplexityData(maxN: number) {
  const data = [];
  const step = Math.max(1, Math.floor(maxN / 25)); // Dynamic step to prevent DOM overload

  for (let n = 1; n <= maxN; n += step) {
    data.push({
      n: n,
      linear: n,
      logLinear: Number((n * Math.log2(n)).toFixed(0)),
      quadratic: n * n,
    });
  }

  // Ensure the exact max value is always plotted at the end
  if (data[data.length - 1].n !== maxN) {
    data.push({
      n: maxN,
      linear: maxN,
      logLinear: Number((maxN * Math.log2(maxN)).toFixed(0)),
      quadratic: maxN * maxN,
    });
  }

  return data;
}

// Custom tooltip for dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl font-mono text-sm z-50">
        <p className="text-slate-300 font-bold mb-2 pb-2 border-b border-slate-700">
          Array Size (N) = {label.toLocaleString()}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-6 py-1">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>
            <span className="text-white font-black">{entry.value.toLocaleString()} ops</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ComplexityChart({ maxElements }: ComplexityChartProps) {
  // Memoize so we only recalculate the math when the slider moves
  const chartData = useMemo(() => generateComplexityData(maxElements), [maxElements]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
        <XAxis
          dataKey="n"
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }}
          tickMargin={10}
          tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
          label={{
            value: 'Array Size (N)',
            position: 'insideBottom',
            offset: -15,
            fill: '#94a3b8',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }}
          tickFormatter={(value) => {
            if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
            if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
            if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
            if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
            return value;
          }}
          label={{
            value: 'Operations (Time)',
            angle: -90,
            position: 'insideLeft',
            fill: '#94a3b8',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingTop: '10px', paddingBottom: '20px', fontWeight: 'bold' }}
        />

        {/* The Mathematical Curves */}
        <Line
          type="monotone"
          dataKey="linear"
          name="O(N) - Linear"
          stroke="#10b981"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="logLinear"
          name="O(N log N) - Log Linear"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="quadratic"
          name="O(N²) - Quadratic"
          stroke="#ef4444"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
