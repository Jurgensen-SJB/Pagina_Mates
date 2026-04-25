'use client';

import {
  AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { generateFunctionPoints, chartConfig } from '@/infrastructure/chart-provider/ChartConfig';

interface IntegrationChartProps {
  fn: (x: number) => number;
  a: number;
  b: number;
  n: number;
  title?: string;
}

export default function IntegrationChart({ fn, a, b, n, title }: IntegrationChartProps) {
  const fullData = generateFunctionPoints(fn, a - (b - a) * 0.1, b + (b - a) * 0.1, 300);
  const areaData = generateFunctionPoints(fn, a, b, Math.min(n * 4, 200));

  return (
    <div className="chart-container">
      {title && (
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          ∫ {title || 'Área bajo la curva'}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <RechartsAreaChart data={fullData} margin={chartConfig.margins}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.4} />
              <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.colors.grid} opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => value !== null ? [Number(value).toFixed(6), 'f(x)'] : ['—', 'f(x)']}
          />
          <ReferenceLine y={0} stroke={chartConfig.colors.axis} strokeWidth={1} />
          <ReferenceLine x={a} stroke={chartConfig.colors.warning} strokeDasharray="4 4" strokeWidth={1.5}
            label={{ value: 'a', position: 'top', fill: chartConfig.colors.warning, fontSize: 11 }} />
          <ReferenceLine x={b} stroke={chartConfig.colors.warning} strokeDasharray="4 4" strokeWidth={1.5}
            label={{ value: 'b', position: 'top', fill: chartConfig.colors.warning, fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="y"
            stroke={chartConfig.colors.functionLine}
            strokeWidth={2}
            fill="url(#areaGradient)"
            connectNulls={false}
            animationDuration={chartConfig.animation.duration}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>a = {a} | b = {b} | n = {n} | h = {((b - a) / n).toFixed(6)}</span>
      </div>
    </div>
  );
}
