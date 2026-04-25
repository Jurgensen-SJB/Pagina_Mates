import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface NewtonRaphsonInput {
  f: (x: number) => number;
  fPrime: (x: number) => number;
  x0: number;
  tolerance: number;
  maxIterations: number;
}

/**
 * Caso de uso: Método de Newton-Raphson.
 * Convergencia cuadrática. Requiere f(x) y f'(x).
 * Fórmula: x_{n+1} = x_n - f(x_n) / f'(x_n)
 */
export class NewtonRaphsonUseCase {
  execute(input: NewtonRaphsonInput): CalculationResult {
    const startTime = performance.now();
    const { f, fPrime, x0, tolerance, maxIterations } = input;
    const steps: StepDetail[] = [];

    let xOld = x0;

    for (let i = 0; i < maxIterations; i++) {
      const fx = f(xOld);
      const fpx = fPrime(xOld);

      // Verificar división por cero
      if (Math.abs(fpx) < 1e-15) {
        return {
          method: 'newton-raphson',
          success: false,
          result: xOld,
          iterations: i + 1,
          steps,
          error: `f'(x) ≈ 0 en x = ${xOld}. División por cero. Intente con otro x₀.`,
          executionTime: performance.now() - startTime
        };
      }

      const xNew = xOld - fx / fpx;

      if (!isFinite(xNew) || isNaN(xNew)) {
        return {
          method: 'newton-raphson',
          success: false,
          result: NaN,
          iterations: i + 1,
          steps,
          error: `El método divergió en la iteración ${i + 1}.`,
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
          'f(x_i)': fx,
          "f'(x_i)": fpx,
          'x_{i+1}': xNew,
        },
        intermediateCalculations: {
          'f(x)/f\'(x)': fx / fpx,
        },
        relativeError: ea,
        status: 'continuing'
      };

      if (Math.abs(fx) < tolerance || (ea !== null && ea < tolerance)) {
        step.status = 'converged';
        steps.push(step);
        return {
          method: 'newton-raphson',
          success: true,
          result: xNew,
          iterations: i + 1,
          steps,
          executionTime: performance.now() - startTime
        };
      }

      steps.push(step);
      xOld = xNew;
    }

    return {
      method: 'newton-raphson',
      success: false,
      result: xOld,
      iterations: maxIterations,
      steps,
      warning: `No convergió en ${maxIterations} iteraciones.`,
      executionTime: performance.now() - startTime
    };
  }
}
