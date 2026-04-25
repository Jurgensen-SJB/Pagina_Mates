/**
 * Validador de entrada según criterios de Chapra.
 * Valida parámetros numéricos antes de ejecutar métodos.
 */
export class InputValidator {
  /**
   * Valida que la tolerancia esté en un rango aceptable.
   * Rango válido: [1e-15, 1e-1]
   */
  validateTolerance(epsilon: number): { valid: boolean; error?: string } {
    if (typeof epsilon !== 'number' || isNaN(epsilon)) {
      return { valid: false, error: "La tolerancia debe ser un número válido" };
    }
    if (epsilon < 1e-15 || epsilon > 1e-1) {
      return { valid: false, error: "ε debe estar entre 1e-15 y 1e-1" };
    }
    return { valid: true };
  }

  /**
   * Valida que el número máximo de iteraciones esté en rango.
   * Rango válido: [1, 1000]
   */
  validateIterations(maxIter: number): { valid: boolean; error?: string } {
    if (!Number.isInteger(maxIter)) {
      return { valid: false, error: "Las iteraciones máximas deben ser un entero" };
    }
    if (maxIter < 1 || maxIter > 1000) {
      return { valid: false, error: "Iteraciones máximas entre 1 y 1000" };
    }
    return { valid: true };
  }

  /**
   * Valida que el intervalo [a, b] sea válido (a < b).
   */
  validateInterval(a: number, b: number): { valid: boolean; error?: string } {
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
      return { valid: false, error: "Los límites del intervalo deben ser números válidos" };
    }
    if (a >= b) {
      return { valid: false, error: "El límite inferior (a) debe ser menor que el superior (b)" };
    }
    return { valid: true };
  }

  /**
   * Valida la condición de Bolzano para bisección: f(a)·f(b) < 0.
   */
  validateBisectionCondition(fa: number, fb: number): { valid: boolean; error?: string } {
    if (isNaN(fa) || isNaN(fb)) {
      return { valid: false, error: "La función no puede evaluarse en los límites del intervalo" };
    }
    if (fa * fb >= 0) {
      return {
        valid: false,
        error: "f(a)·f(b) debe ser < 0 para garantizar la existencia de una raíz en el intervalo. " +
               "Verifique que la función cambia de signo en [a, b]."
      };
    }
    return { valid: true };
  }

  /**
   * Ajusta automáticamente n para Simpson según la regla.
   * Simpson 1/3: n debe ser par.
   * Simpson 3/8: n debe ser divisible por 3.
   */
  validateSimpsonN(n: number, rule: "1/3" | "3/8"): { adjustedN: number; wasAdjusted: boolean } {
    if (rule === "1/3" && n % 2 !== 0) {
      return { adjustedN: n + 1, wasAdjusted: true };
    }
    if (rule === "3/8" && n % 3 !== 0) {
      return { adjustedN: n + (3 - (n % 3)), wasAdjusted: true };
    }
    return { adjustedN: n, wasAdjusted: false };
  }

  /**
   * Valida que un número no tenga más de 10 decimales.
   */
  validateDecimalPlaces(value: number): { valid: boolean; error?: string } {
    const decimals = value.toString().split('.')[1]?.length || 0;
    if (decimals > 10) {
      return { valid: false, error: "Máximo 10 decimales permitidos" };
    }
    return { valid: true };
  }

  /**
   * Valida que los puntos para interpolación no tengan x duplicados.
   */
  validateUniqueXPoints(points: Array<{ x: number; y: number }>): { valid: boolean; error?: string } {
    const xValues = points.map(p => p.x);
    const uniqueX = new Set(xValues);
    if (uniqueX.size !== xValues.length) {
      return { valid: false, error: "Los valores de x no deben repetirse en los puntos de interpolación" };
    }
    return { valid: true };
  }

  /**
   * Valida el número máximo de puntos para interpolación.
   */
  validateMaxPoints(count: number, max: number = 50): { valid: boolean; error?: string; warning?: string } {
    if (count < 2) {
      return { valid: false, error: "Se necesitan al menos 2 puntos para interpolar" };
    }
    if (count > max) {
      return { valid: false, error: `Máximo ${max} puntos permitidos` };
    }
    if (count > 20) {
      return { valid: true, warning: "⚠️ Muchos puntos pueden causar el fenómeno de Runge (oscilaciones)" };
    }
    return { valid: true };
  }

  /**
   * Valida subintervalos para integración.
   */
  validateSubintervals(n: number): { valid: boolean; error?: string } {
    if (!Number.isInteger(n) || n < 1) {
      return { valid: false, error: "El número de subintervalos debe ser un entero positivo" };
    }
    if (n > 10000) {
      return { valid: false, error: "Máximo 10,000 subintervalos" };
    }
    return { valid: true };
  }
}
