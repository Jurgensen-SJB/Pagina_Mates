import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface FalsePositionInput {
  f: (x: number) => number;
  a: number;
  b: number;
  tolerance: number;
  maxIterations: number;
}

/**
 * Caso de uso: Método de Falsa Posición (Regula Falsi).
 * Similar a bisección pero usa interpolación lineal para encontrar c.
 * Fórmula: c = a - f(a)·(b - a) / (f(b) - f(a))
 */
export class FalsePositionUseCase {
  execute(input: FalsePositionInput): CalculationResult {
    const startTime = performance.now();
    const { f, a: initialA, b: initialB, tolerance, maxIterations } = input;
    const steps: StepDetail[] = [];

    const fa0 = f(initialA);
    const fb0 = f(initialB);
    if (fa0 * fb0 >= 0) {
      return {
        method: 'false-position',
        success: false,
        result: NaN,
        iterations: 0,
        steps: [],
        error: 'f(a)·f(b) debe ser < 0. No se garantiza raíz en el intervalo.',
        executionTime: performance.now() - startTime
      };
    }

    let a = initialA;
    let b = initialB;
    let cPrev: number | null = null;

    for (let i = 0; i < maxIterations; i++) {
      const faVal = f(a);
      const fbVal = f(b);

      // Fórmula de falsa posición
      const c = a - faVal * (b - a) / (fbVal - faVal);
      const fc = f(c);

      let ea: number | null = null;
      if (cPrev !== null && c !== 0) {
        ea = Math.abs((c - cPrev) / c);
      }

      const step: StepDetail = {
        iteration: i + 1,
        values: {
          a, b, c,
          'f(a)': faVal,
          'f(b)': fbVal,
          'f(c)': fc,
        },
        intermediateCalculations: {
          'f(a)·f(c)': faVal * fc,
        },
        relativeError: ea,
        status: 'continuing'
      };

      if (Math.abs(fc) < tolerance || (ea !== null && ea < tolerance)) {
        step.status = 'converged';
        steps.push(step);
        return {
          method: 'false-position',
          success: true,
          result: c,
          iterations: i + 1,
          steps,
          executionTime: performance.now() - startTime
        };
      }

      steps.push(step);
      cPrev = c;

      if (faVal * fc < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    const lastC = a - f(a) * (b - a) / (f(b) - f(a));
    return {
      method: 'false-position',
      success: false,
      result: lastC,
      iterations: maxIterations,
      steps,
      warning: `No convergió en ${maxIterations} iteraciones.`,
      executionTime: performance.now() - startTime
    };
  }
}
