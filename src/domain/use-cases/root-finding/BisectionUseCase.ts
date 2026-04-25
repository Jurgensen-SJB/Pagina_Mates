import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface BisectionInput {
  f: (x: number) => number;
  a: number;
  b: number;
  tolerance: number;
  maxIterations: number;
}

/**
 * Caso de uso: Método de Bisección.
 * Encuentra raíces dividiendo repetidamente el intervalo [a, b].
 * Requiere que f(a)·f(b) < 0 (Teorema de Bolzano).
 */
export class BisectionUseCase {
  execute(input: BisectionInput): CalculationResult {
    const startTime = performance.now();
    const { f, a: initialA, b: initialB, tolerance, maxIterations } = input;
    const steps: StepDetail[] = [];

    // Validar condición de Bolzano
    const fa = f(initialA);
    const fb = f(initialB);
    if (fa * fb >= 0) {
      return {
        method: 'bisection',
        success: false,
        result: NaN,
        iterations: 0,
        steps: [],
        error: 'f(a)·f(b) debe ser < 0. No se garantiza la existencia de raíz en el intervalo.',
        executionTime: performance.now() - startTime
      };
    }

    let a = initialA;
    let b = initialB;
    let cPrev: number | null = null;

    for (let i = 0; i < maxIterations; i++) {
      const c = (a + b) / 2;
      const fc = f(c);
      const faVal = f(a);

      // Error relativo aproximado
      let ea: number | null = null;
      if (cPrev !== null && c !== 0) {
        ea = Math.abs((c - cPrev) / c);
      }

      const step: StepDetail = {
        iteration: i + 1,
        values: {
          a: a,
          b: b,
          c: c,
          'f(a)': faVal,
          'f(b)': f(b),
          'f(c)': fc,
        },
        intermediateCalculations: {
          'f(a)·f(c)': faVal * fc,
        },
        relativeError: ea,
        status: 'continuing'
      };

      // Verificar convergencia
      if (Math.abs(fc) < tolerance || (ea !== null && ea < tolerance)) {
        step.status = 'converged';
        steps.push(step);
        return {
          method: 'bisection',
          success: true,
          result: c,
          iterations: i + 1,
          steps,
          executionTime: performance.now() - startTime
        };
      }

      steps.push(step);
      cPrev = c;

      // Actualizar intervalo
      if (faVal * fc < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    // No convergió
    const lastC = (a + b) / 2;
    return {
      method: 'bisection',
      success: false,
      result: lastC,
      iterations: maxIterations,
      steps,
      warning: `No convergió en ${maxIterations} iteraciones. Último valor: ${lastC}`,
      executionTime: performance.now() - startTime
    };
  }
}
