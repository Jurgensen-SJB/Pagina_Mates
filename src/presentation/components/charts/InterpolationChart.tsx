'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Scatter, ScatterChart, ComposedChart
} from 'recharts';
import { generateFunctionPoints, chartConfig } from '@/infrastructure/chart-provider/ChartConfig';

interface InterpolationChartProps {
  points: Array<{ x: number; y: number }>;
  interpolantFn?: (x: number) => number;
  title?: string;
}

export default function InterpolationChart({ points, interpolantFn, title }: InterpolationChartProps) {
  if (!points || points.length === 0) return null;

  const xValues = points.map(p => p.x);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const padding = (xMax - xMin) * 0.15 || 1;

  const curveData = interpolantFn
    ? generateFunctionPoints(interpolantFn, xMin - padding, xMax + padding, 200)
    : [];

  const pointData = points.map(p => ({ x: p.x, y: p.y }));

  return (
    <div className="chart-container">
      {title && (
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          📊 {title || 'Interpolación'}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart margin={chartConfig.margins}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin - padding, xMax + padding]}
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <YAxis
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
            }}
          />
          {curveData.length > 0 && (
            <Line
              data={curveData}
              type="monotone"
              dataKey="y"
              stroke={chartConfig.colors.interpolant}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="P(x)"
              animationDuration={chartConfig.animation.duration}
            />
          )}
          <Scatter
            data={pointData}
            fill={chartConfig.colors.dataPoints}
            name="Puntos"
            r={5}
            stroke="#fff"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
        🔵 Puntos originales | 🟣 Polinomio interpolante
      </p>
    </div>
  );
}
