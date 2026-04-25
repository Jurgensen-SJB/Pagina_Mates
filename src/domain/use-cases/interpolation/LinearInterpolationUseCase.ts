import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface LinearInterpolationInput {
  points: Array<{ x: number; y: number }>;
  evaluateAt: number[];
}

/**
 * Caso de uso: Interpolación Lineal.
 * P(x) = y₀ + (y₁ - y₀)/(x₁ - x₀) · (x - x₀)
 */
export class LinearInterpolationUseCase {
  execute(input: LinearInterpolationInput): CalculationResult {
    const startTime = performance.now();
    const { points, evaluateAt } = input;
    const steps: StepDetail[] = [];

    if (points.length < 2) {
      return {
        method: 'linear-interpolation',
        success: false,
        result: NaN,
        iterations: 0,
        steps: [],
        error: 'Se necesitan al menos 2 puntos para interpolación lineal.',
        executionTime: performance.now() - startTime
      };
    }

    if (points[0].x === points[1].x) {
      return {
        method: 'linear-interpolation',
        success: false,
        result: NaN,
        iterations: 0,
        steps: [],
        error: 'x₀ y x₁ no pueden ser iguales (división por cero).',
        executionTime: performance.now() - startTime
      };
    }

    const { x: x0, y: y0 } = points[0];
    const { x: x1, y: y1 } = points[1];
    const slope = (y1 - y0) / (x1 - x0);

    const interpolant = (x: number): number => y0 + slope * (x - x0);

    const results: number[] = [];

    // Paso informativo: mostrar la fórmula
    steps.push({
      iteration: 0,
      values: {
        'x₀': x0, 'y₀': y0,
        'x₁': x1, 'y₁': y1,
      },
      intermediateCalculations: {
        'Pendiente (m)': slope,
        'Fórmula': `P(x) = ${y0} + ${slope.toFixed(6)} · (x - ${x0})`,
      },
      relativeError: null,
      status: 'converged'
    });

    evaluateAt.forEach((x, i) => {
      const px = interpolant(x);
      results.push(px);
      steps.push({
        iteration: i + 1,
        values: {
          'x': x,
          'P(x)': px,
        },
        intermediateCalculations: {},
        relativeError: null,
        status: 'converged'
      });
    });

    return {
      method: 'linear-interpolation',
      success: true,
      result: results.length === 1 ? results[0] : results,
      iterations: evaluateAt.length,
      steps,
      interpolantFn: interpolant,
      executionTime: performance.now() - startTime
    };
  }
}
