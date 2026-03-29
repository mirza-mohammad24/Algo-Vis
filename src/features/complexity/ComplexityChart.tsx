/**
 * @file ComplexityChart.tsx
 *
 * @description
 * Feature component for the Big O dashboard.
 * Upgraded with premium AreaChart gradients and a Real-World Time Translator
 * to convert abstract operations into human-readable hardware execution times.
 */

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
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

// Assume a standard modern CPU can handle roughly 10^8 basic operations per second in JS
const OPERATIONS_PER_SECOND = 100_000_000;

/**
 * Translates raw operation counts into human-readable time
 */
function formatRealWorldTime(operations: number): string {
  if (operations === 0) return '0 ms';

  const seconds = operations / OPERATIONS_PER_SECOND;

  if (seconds < 0.001) return '< 1 ms';
  if (seconds < 1) return `${(seconds * 1000).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} sec`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} mins`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;

  return `${(seconds / 31536000).toFixed(1)} years`;
}

function generateComplexityData(maxN: number) {
  const data = [];
  const step = Math.max(1, Math.floor(maxN / 25));

  for (let n = 1; n <= maxN; n += step) {
    data.push({
      n: n,
      linear: n,
      logLinear: Number((n * Math.log2(n)).toFixed(0)),
      quadratic: n * n,
    });
  }

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

// Upgraded Tooltip with Hardware Time Estimation
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono text-[10px] sm:text-sm z-50 min-w-[200px] sm:min-w-[280px]">
        <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-slate-700/80">
          <p className="text-slate-400 text-[8px] sm:text-xs uppercase tracking-widest font-bold mb-0.5 sm:mb-1">
            Dataset Size
          </p>
          <p className="text-white text-sm sm:text-lg font-black tracking-tight">
            N = {label.toLocaleString()}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
            >
              <div className="flex justify-between items-center">
                <span
                  style={{ color: entry.color }}
                  className="font-bold flex items-center gap-1.5 sm:gap-2"
                >
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name.split(' - ')[0]}
                </span>
                <span className="text-slate-300 font-medium text-[9px] sm:text-xs">
                  {entry.value >= 1e12
                    ? `${(entry.value / 1e12).toFixed(1)}T`
                    : entry.value >= 1e9
                      ? `${(entry.value / 1e9).toFixed(1)}B`
                      : entry.value >= 1e6
                        ? `${(entry.value / 1e6).toFixed(1)}M`
                        : `${entry.value.toLocaleString()}`}
                </span>
              </div>
              {/* THE WOW FACTOR: Hardware Time Translation */}
              <div className="flex justify-between items-center pl-3 sm:pl-4">
                <span className="text-slate-500 text-[8px] sm:text-xs">Est. CPU:</span>
                <span className="text-white font-black text-[8px] sm:text-xs bg-slate-800 px-1.5 sm:px-2 py-0.5 rounded shadow-inner">
                  {formatRealWorldTime(entry.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ComplexityChart({ maxElements }: ComplexityChartProps) {
  const chartData = useMemo(() => generateComplexityData(maxElements), [maxElements]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Upgraded from LineChart to AreaChart for the gradient fills */}
      <AreaChart data={chartData} margin={{ top: 70, right: 10, left: -20, bottom: 0 }}>
        {/* SVG Defs for glowing gradients */}
        <defs>
          <linearGradient id="colorLinear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorLogLinear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorQuadratic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="n"
          stroke="#475569"
          tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
          tickMargin={10}
          tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
        />
        <YAxis
          stroke="#475569"
          tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
          tickMargin={5}
          tickFormatter={(value) => {
            if (value >= 1e12) return `${(value / 1e12).toFixed(0)}T`;
            if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`;
            if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
            if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
            return value;
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
          wrapperStyle={{ zIndex: 100 }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          height={40}
          iconType="circle"
          wrapperStyle={{
            top: 0,
            left: 0,
            paddingBottom: '40px',
            fontSize: '10px',
            width: '100%',
            fontWeight: 'bold',
          }}
        />

        {/* Rendered Areas with Gradients */}
        <Area
          type="monotone"
          dataKey="quadratic"
          name="O(N²) - e.g. Bubble Sort"
          stroke="#ef4444"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorQuadratic)"
          activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="logLinear"
          name="O(N log N) - e.g. Quick Sort"
          stroke="#3b82f6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorLogLinear)"
          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="linear"
          name="O(N) - Linear Time"
          stroke="#10b981"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorLinear)"
          activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
