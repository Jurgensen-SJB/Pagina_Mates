'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { chartConfig } from '@/infrastructure/chart-provider/ChartConfig';
import { StepDetail } from '@/domain/entities/StepDetail';

interface ConvergenceChartProps {
  steps: StepDetail[];
  tolerance?: number;
  title?: string;
}

export default function ConvergenceChart({ steps, tolerance, title }: ConvergenceChartProps) {
  const data = steps
    .filter(s => s.relativeError !== null)
    .map(s => ({
      iteration: s.iteration,
      error: s.relativeError!,
    }));

  if (data.length === 0) return null;

  const maxError = Math.max(...data.map(d => d.error));
  const useLog = maxError / Math.min(...data.map(d => d.error).filter(e => e > 0)) > 100;

  return (
    <div className="chart-container">
      {title && (
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          📉 {title || 'Convergencia'}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={chartConfig.margins}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} opacity={0.3} />
          <XAxis
            dataKey="iteration"
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
            label={{ value: 'Iteración', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)', fontSize: 11 }}
          />
          <YAxis
            stroke={chartConfig.colors.axis}
            tick={{ fontSize: 11 }}
            scale={useLog ? 'log' : 'auto'}
            domain={useLog ? ['auto', 'auto'] : [0, 'auto']}
            tickFormatter={(v) => v.toExponential(0)}
            label={{ value: 'Ea', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
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
            formatter={(value: any) => [Number(value).toExponential(4), 'Error']}
            labelFormatter={(label) => `Iteración ${label}`}
          />
          {tolerance && (
            <ReferenceLine
              y={tolerance}
              stroke={chartConfig.colors.toleranceLine}
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `ε = ${tolerance}`,
                position: 'right',
                fill: chartConfig.colors.toleranceLine,
                fontSize: 10,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="error"
            stroke={chartConfig.colors.convergence}
            strokeWidth={2}
            dot={{ fill: chartConfig.colors.convergence, r: 3 }}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            animationDuration={chartConfig.animation.duration}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
