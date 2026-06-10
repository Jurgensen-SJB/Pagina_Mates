import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface FixedPointInput {
  g: (x: number) => number;
  x0: number;
  tolerance: number;
  maxIterations: number;
}

/**
 * Caso de uso: Método de Punto Fijo.
 * Encuentra la raíz resolviendo x = g(x) iterativamente.
 * Condición de convergencia: |g'(x)| < 1 en vecindad de la raíz.
 */
export class FixedPointUseCase {
  execute(input: FixedPointInput): CalculationResult {
    const startTime = performance.now();
    const { g, x0, tolerance, maxIterations } = input;
    const steps: StepDetail[] = [];

    // Verificar convergencia numéricamente: |g'(x0)| < 1
    const h = 1e-8;
    const gPrimeX0 = (g(x0 + h) - g(x0 - h)) / (2 * h);
    let warning: string | undefined;

    if (Math.abs(gPrimeX0) >= 1) {
      warning = `|g'(x₀)| = ${Math.abs(gPrimeX0).toFixed(6)} ≥ 1. El método podría divergir.`;
    }

    let xOld = x0;

    for (let i = 0; i < maxIterations; i++) {
      const xNew = g(xOld);

      if (!isFinite(xNew) || isNaN(xNew)) {
        return {
          method: 'fixed-point',
          success: false,
          result: NaN,
          iterations: i + 1,
          steps,
          error: `g(x) divergió en la iteración ${i + 1}. El valor se volvió infinito o NaN.`,
          executionTime: performance.now() - startTime
        };
      }

      let ea: number | null = null;
      if (xNew !== 0) {
        ea = Math.abs((xNew - xOld) / xNew);
      }

      const step: StepDetail = {
        iteration: i + 1,
        values: {
          'x_i': xOld,
          'g(x_i)': xNew,
          'x_{i+1}': xNew,
        },
        intermediateCalculations: {
          '|x_{i+1} - x_i|': Math.abs(xNew - xOld),
        },
        relativeError: ea,
        status: 'continuing'
      };

      if (Math.abs(xNew - xOld) < tolerance || (ea !== null && ea < tolerance)) {
        step.status = 'converged';
        steps.push(step);
        return {
          method: 'fixed-point',
          success: true,
          result: xNew,
          iterations: i + 1,
          steps,
          warning,
          executionTime: performance.now() - startTime
        };
      }

      steps.push(step);
      xOld = xNew;
    }

    return {
      method: 'fixed-point',
      success: false,
      result: xOld,
      iterations: maxIterations,
      steps,
      warning: warning || `No convergió en ${maxIterations} iteraciones.`,
      executionTime: performance.now() - startTime
    };
  }
}
