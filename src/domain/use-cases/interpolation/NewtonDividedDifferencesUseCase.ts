import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface NewtonDDInput {
  points: Array<{ x: number; y: number }>;
  evaluateAt: number[];
}

/**
 * Caso de uso: Interpolación de Newton con Diferencias Divididas.
 * Construye tabla de diferencias divididas y evalúa el polinomio.
 * Más eficiente que Lagrange para agregar puntos.
 */
export class NewtonDividedDifferencesUseCase {
  execute(input: NewtonDDInput): CalculationResult {
    const startTime = performance.now();
    const { points, evaluateAt } = input;
    const steps: StepDetail[] = [];
    const n = points.length;

    if (n < 2) {
      return {
        method: 'newton-dd',
        success: false, result: NaN, iterations: 0, steps: [],
        error: 'Se necesitan al menos 2 puntos.',
        executionTime: performance.now() - startTime
      };
    }

    const xSet = new Set(points.map(p => p.x));
    if (xSet.size !== n) {
      return {
        method: 'newton-dd',
        success: false, result: NaN, iterations: 0, steps: [],
        error: 'Los valores de x no deben repetirse.',
        executionTime: performance.now() - startTime
      };
    }

    // Construir tabla de diferencias divididas
    const dd: number[][] = [];
    dd[0] = points.map(p => p.y);

    for (let j = 1; j < n; j++) {
      dd[j] = [];
      for (let i = 0; i < n - j; i++) {
        dd[j][i] = (dd[j - 1][i + 1] - dd[j - 1][i]) / (points[i + j].x - points[i].x);
      }
    }

    // Paso informativo: tabla de diferencias divididas
    const tableStep: StepDetail = {
      iteration: 0,
      values: {},
      intermediateCalculations: {},
      relativeError: null,
      status: 'converged'
    };

    for (let i = 0; i < n; i++) {
      tableStep.values[`x${i}`] = points[i].x;
      tableStep.values[`f[x${i}]`] = points[i].y;
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        const label = `f[${Array.from({ length: j + 1 }, (_, k) => `x${i + k}`).join(',')}]`;
        tableStep.intermediateCalculations[label] = dd[j][i];
      }
    }
    steps.push(tableStep);

    // Coeficientes del polinomio (primera fila de cada orden)
    const coefficients = dd.map(col => col[0]);

    // Función interpolante
    const interpolant = (x: number): number => {
      let result = coefficients[0];
      let product = 1;
      for (let i = 1; i < n; i++) {
        product *= (x - points[i - 1].x);
        result += coefficients[i] * product;
      }
      return result;
    };

    // Evaluar
    const results: number[] = [];
    evaluateAt.forEach((x, idx) => {
      const px = interpolant(x);
      results.push(px);

      const evalValues: Record<string, number | string> = { 'x': x };
      let product = 1;
      let sum = coefficients[0];
      for (let i = 1; i < n; i++) {
        product *= (x - points[i - 1].x);
        sum += coefficients[i] * product;
        evalValues[`Término ${i}`] = coefficients[i] * product;
      }
      evalValues['P(x)'] = px;

      steps.push({
        iteration: idx + 1,
        values: evalValues,
        intermediateCalculations: {},
        relativeError: null,
        status: 'converged'
      });
    });

    return {
      method: 'newton-dd',
      success: true,
      result: results.length === 1 ? results[0] : results,
      iterations: evaluateAt.length,
      steps,
      interpolantFn: interpolant,
      executionTime: performance.now() - startTime
    };
  }
}
