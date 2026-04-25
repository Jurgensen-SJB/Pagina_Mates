'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceDot
} from 'recharts';
import { generateFunctionPoints, chartConfig } from '@/infrastructure/chart-provider/ChartConfig';

interface FunctionChartProps {
  fn: (x: number) => number;
  xMin: number;
  xMax: number;
  root?: number;
  title?: string;
}

export default function FunctionChart({ fn, xMin, xMax, root, title }: FunctionChartProps) {
  const data = generateFunctionPoints(fn, xMin, xMax, 300);

  return (
    <div className="chart-container">
      {title && (
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          📈 {title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={chartConfig.margins}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin, xMax]}
            tickFormatter={(v) => v.toFixed(1)}
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => Math.abs(v) > 1000 ? v.toExponential(1) : v.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => value !== null ? [Number(value).toFixed(6), 'f(x)'] : ['—', 'f(x)']}
            labelFormatter={(label) => `x = ${Number(label).toFixed(4)}`}
          />
          <ReferenceLine y={0} stroke={chartConfig.colors.axis} strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="y"
            stroke={chartConfig.colors.functionLine}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            animationDuration={chartConfig.animation.duration}
          />
          {root !== undefined && !isNaN(root) && (
            <ReferenceDot
              x={root}
              y={0}
              r={6}
              fill={chartConfig.colors.rootPoint}
              stroke="#fff"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {root !== undefined && !isNaN(root) && (
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
          🔴 Raíz encontrada en x = {root.toFixed(6)}
        </p>
      )}
    </div>
  );
}
