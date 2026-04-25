import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface Simpson13Input {
  f: (x: number) => number;
  a: number;
  b: number;
  n: number; // Debe ser par
}

/**
 * Caso de uso: Regla de Simpson 1/3.
 * I ≈ (h/3) · [f(x₀) + 4·Σf(x_impar) + 2·Σf(x_par) + f(xₙ)]
 * Requiere n par. Error O(h⁴).
 */
export class Simpson13UseCase {
  execute(input: Simpson13Input): CalculationResult {
    const startTime = performance.now();
    const { f, a, b } = input;
    let { n } = input;
    let warning: string | undefined;

    // Ajustar n si es impar
    if (n % 2 !== 0) {
      n = n + 1;
      warning = `n fue ajustado de ${input.n} a ${n} (debe ser par para Simpson 1/3).`;
    }

    const steps: StepDetail[] = [];
    const h = (b - a) / n;
    let sum = 0;

    for (let i = 0; i <= n; i++) {
      const xi = a + i * h;
      const fxi = f(xi);

      let coefficient: number;
      let tipo: string;
      if (i === 0 || i === n) {
        coefficient = 1;
        tipo = 'extremo';
      } else if (i % 2 !== 0) {
        coefficient = 4;
        tipo = 'impar';
      } else {
        coefficient = 2;
        tipo = 'par';
      }

      sum += coefficient * fxi;

      const step: StepDetail = {
        iteration: i,
        values: {
          i,
          'xᵢ': xi,
          'f(xᵢ)': fxi,
          'Tipo': tipo,
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

    const integral = (h / 3) * sum;

    return {
      method: 'simpson-13',
      success: true,
      result: integral,
      iterations: n + 1,
      steps,
      warning,
      executionTime: performance.now() - startTime
    };
  }
}
