/**
 * Configuración centralizada para gráficas Recharts.
 */
export const chartConfig = {
  colors: {
    primary:       '#818cf8',            // índigo principal
    secondary:     '#a78bfa',            // violeta
    success:       '#22c55e',
    danger:        '#ef4444',
    warning:       '#fcd34d',
    grid:          '#1e1e2e',
    gridLight:     '#2a2a40',
    axis:          '#52525b',
    functionLine:  '#818cf8',            // índigo
    rootPoint:     '#ef4444',
    area:          'rgba(129, 140, 248, 0.12)',
    convergence:   '#22c55e',
    toleranceLine: '#fcd34d',
    dataPoints:    '#67e8f9',            // cyan para puntos de datos
    interpolant:   '#a78bfa',            // violeta para interpolante
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
