/**
 * Configuración centralizada para gráficas Recharts.
 */
export const chartConfig = {
  colors: {
    primary: '#6366f1',
    secondary: '#06b6d4',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    grid: '#374151',
    gridLight: '#e5e7eb',
    axis: '#9ca3af',
    functionLine: '#818cf8',
    rootPoint: '#ef4444',
    area: 'rgba(99, 102, 241, 0.3)',
    convergence: '#10b981',
    toleranceLine: '#f59e0b',
    dataPoints: '#06b6d4',
    interpolant: '#8b5cf6',
  },
  margins: { top: 20, right: 30, bottom: 20, left: 30 },
  maxDataPoints: 500,
  animation: {
    duration: 800,
    easing: 'ease-in-out' as const,
  },
};

/**
 * Genera puntos equiespaciados de una función para graficar.
 */
export function generateFunctionPoints(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  numPoints: number = 200
): Array<{ x: number; y: number | null }> {
  const points: Array<{ x: number; y: number | null }> = [];
  const step = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    try {
      const y = fn(x);
      if (!isFinite(y) || Math.abs(y) > 1e10) {
        points.push({ x, y: null }); // Discontinuidad
      } else {
        points.push({ x, y });
      }
    } catch {
      points.push({ x, y: null });
    }
  }

  return points;
}

/**
 * Formatea un número para mostrar en gráficas.
 */
export function formatChartNumber(value: number): string {
  if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
    return value.toExponential(2);
  }
  return value.toFixed(4);
}
