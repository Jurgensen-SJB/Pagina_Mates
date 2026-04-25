import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface TrapezoidInput {
  f: (x: number) => number;
  a: number;
  b: number;
  n: number;
}

/**
 * Caso de uso: Regla del Trapecio.
 * Aproxima la integral mediante trapecio(s).
 * I ≈ (h/2) · [f(x₀) + 2·Σf(xᵢ) + f(xₙ)]
 */
export class TrapezoidUseCase {
  execute(input: TrapezoidInput): CalculationResult {
    const startTime = performance.now();
    const { f, a, b, n } = input;
    const steps: StepDetail[] = [];

    const h = (b - a) / n;
    let sum = 0;

    for (let i = 0; i <= n; i++) {
      const xi = a + i * h;
      const fxi = f(xi);

      let coefficient = 2;
      if (i === 0 || i === n) {
        coefficient = 1;
      }

      sum += coefficient * fxi;

      const step: StepDetail = {
        iteration: i,
        values: {
          i,
          'xᵢ': xi,
          'f(xᵢ)': fxi,
          'Coeficiente': coefficient,
          'Contribución': coefficient * fxi,
        },
        intermediateCalculations: {
          'Suma acumulada': sum,
        },
        relativeError: null,
        status: i === n ? 'converged' : 'continuing'
      };
      steps.push(step);
    }

    const integral = (h / 2) * sum;

    return {
      method: 'trapezoid',
      success: true,
      result: integral,
      iterations: n + 1,
      steps,
      executionTime: performance.now() - startTime
    };
  }
}
