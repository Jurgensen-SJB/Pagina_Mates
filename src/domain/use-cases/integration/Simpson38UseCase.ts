import { CalculationResult } from '../../entities/CalculationResult';
import { StepDetail } from '../../entities/StepDetail';

export interface Simpson38Input {
  f: (x: number) => number;
  a: number;
  b: number;
  n: number; // Debe ser divisible por 3
}

/**
 * Caso de uso: Regla de Simpson 3/8.
 * I ≈ (3h/8) · [f(x₀) + 3·Σf(x no múltiplo de 3) + 2·Σf(x múltiplo de 3) + f(xₙ)]
 * Requiere n divisible por 3. Error O(h⁴).
 */
export class Simpson38UseCase {
  execute(input: Simpson38Input): CalculationResult {
    const startTime = performance.now();
    const { f, a, b } = input;
    let { n } = input;
    let warning: string | undefined;

    // Ajustar n si no es divisible por 3
    if (n % 3 !== 0) {
      const oldN = n;
      n = n + (3 - (n % 3));
      warning = `n fue ajustado de ${oldN} a ${n} (debe ser divisible por 3 para Simpson 3/8).`;
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
      } else if (i % 3 === 0) {
        coefficient = 2;
        tipo = 'múltiplo de 3';
      } else {
        coefficient = 3;
        tipo = 'no múltiplo de 3';
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

    const integral = (3 * h / 8) * sum;

    return {
      method: 'simpson-38',
      success: true,
      result: integral,
      iterations: n + 1,
      steps,
      warning,
      executionTime: performance.now() - startTime
    };
  }
}
