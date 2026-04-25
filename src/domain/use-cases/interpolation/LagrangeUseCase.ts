import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface LagrangeInput {
  points: Array<{ x: number; y: number }>;
  evaluateAt: number[];
}

/**
 * Caso de uso: Interpolación de Lagrange.
 * P(x) = Σ(yᵢ · Lᵢ(x)), donde Lᵢ(x) = Π((x - xⱼ)/(xᵢ - xⱼ)) para j ≠ i
 * Máximo 50 puntos. Advierte sobre fenómeno de Runge.
 */
export class LagrangeUseCase {
  execute(input: LagrangeInput): CalculationResult {
    const startTime = performance.now();
    const { points, evaluateAt } = input;
    const steps: StepDetail[] = [];
    const n = points.length;

    // Validaciones
    if (n < 2) {
      return {
        method: 'lagrange',
        success: false, result: NaN, iterations: 0, steps: [],
        error: 'Se necesitan al menos 2 puntos.',
        executionTime: performance.now() - startTime
      };
    }

    // Verificar x únicos
    const xSet = new Set(points.map(p => p.x));
    if (xSet.size !== n) {
      return {
        method: 'lagrange',
        success: false, result: NaN, iterations: 0, steps: [],
        error: 'Los valores de x no deben repetirse.',
        executionTime: performance.now() - startTime
      };
    }

    let warning: string | undefined;
    if (n > 20) {
      warning = '⚠️ Con muchos puntos puede ocurrir el fenómeno de Runge (oscilaciones en los extremos).';
    }

    // Función interpolante de Lagrange
    const interpolant = (x: number): number => {
      let result = 0;
      for (let i = 0; i < n; i++) {
        let Li = 1;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            Li *= (x - points[j].x) / (points[i].x - points[j].x);
          }
        }
        result += points[i].y * Li;
      }
      return result;
    };

    // Paso 0: Mostrar puntos y polinomios Li
    const liDescriptions: Record<string, string> = {};
    for (let i = 0; i < n; i++) {
      const terms = points
        .filter((_, j) => j !== i)
        .map(p => `(x - ${p.x})/(${points[i].x} - ${p.x})`)
        .join(' · ');
      liDescriptions[`L${i}(x)`] = terms;
    }

    steps.push({
      iteration: 0,
      values: Object.fromEntries(points.map((p, i) => [`(x${i}, y${i})`, `(${p.x}, ${p.y})`])),
      intermediateCalculations: liDescriptions,
      relativeError: null,
      status: 'converged'
    });

    // Evaluar en cada punto solicitado
    const results: number[] = [];
    evaluateAt.forEach((x, idx) => {
      const LiValues: Record<string, number> = {};
      let px = 0;
      for (let i = 0; i < n; i++) {
        let Li = 1;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            Li *= (x - points[j].x) / (points[i].x - points[j].x);
          }
        }
        LiValues[`L${i}(${x})`] = Li;
        px += points[i].y * Li;
      }

      results.push(px);
      steps.push({
        iteration: idx + 1,
        values: { 'x': x, 'P(x)': px, ...LiValues },
        intermediateCalculations: {},
        relativeError: null,
        status: 'converged'
      });
    });

    return {
      method: 'lagrange',
      success: true,
      result: results.length === 1 ? results[0] : results,
      iterations: evaluateAt.length,
      steps,
      warning,
      interpolantFn: interpolant,
      executionTime: performance.now() - startTime
    };
  }
}
