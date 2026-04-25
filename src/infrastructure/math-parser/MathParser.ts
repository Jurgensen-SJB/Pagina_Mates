import * as math from 'mathjs';

/**
 * Parser de expresiones matemáticas usando math.js.
 * Convierte strings en funciones JavaScript evaluables.
 */
export class MathParser {
  private dangerousPatterns = [
    /eval\s*\(/i,
    /Function\s*\(/i,
    /import\s*\(/i,
    /require\s*\(/i,
    /<script/i,
    /document\./i,
    /window\./i,
    /process\./i,
    /global\./i,
  ];

  /**
   * Parsea una expresión matemática y retorna una función evaluable.
   */
  parse(expression: string): {
    success: boolean;
    fn?: (x: number) => number;
    error?: string;
    position?: number;
  } {
    try {
      const validation = this.validateExpression(expression);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const compiled = math.compile(expression);
      const fn = (x: number): number => {
        const result = compiled.evaluate({ x });
        if (typeof result === 'object' && result !== null) {
          return Number(result);
        }
        return result as number;
      };

      // Test de evaluación
      fn(1);

      return { success: true, fn };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido al parsear';
      return {
        success: false,
        error: msg,
        position: (error as { char?: number }).char,
      };
    }
  }

  /**
   * Valida una expresión matemática sin compilarla.
   */
  validateExpression(expression: string): {
    valid: boolean;
    error?: string;
    suggestion?: string;
  } {
    if (!expression || expression.trim().length === 0) {
      return { valid: false, error: 'La expresión no puede estar vacía' };
    }

    // Verificar caracteres peligrosos
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(expression)) {
        return {
          valid: false,
          error: 'La expresión contiene caracteres o funciones no permitidas',
          suggestion: 'Use solo funciones matemáticas: sin, cos, tan, sqrt, abs, ln, exp, etc.'
        };
      }
    }

    // Verificar paréntesis balanceados
    let depth = 0;
    for (const char of expression) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      if (depth < 0) {
        return {
          valid: false,
          error: 'Paréntesis desbalanceados: cierre sin apertura',
          suggestion: 'Verifique que cada ")" tenga su correspondiente "("'
        };
      }
    }
    if (depth !== 0) {
      return {
        valid: false,
        error: 'Paréntesis desbalanceados: falta cerrar',
        suggestion: `Faltan ${depth} paréntesis de cierre`
      };
    }

    // Intentar compilar
    try {
      math.compile(expression);
      return { valid: true };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Sintaxis inválida';
      return {
        valid: false,
        error: msg,
        suggestion: 'Verifique la sintaxis. Ejemplos válidos: x^2 + 3*x - 5, sin(x), sqrt(x)'
      };
    }
  }

  /**
   * Retorna sugerencias de autocompletado basadas en una entrada parcial.
   */
  getSuggestions(partial: string): string[] {
    const functions = [
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh',
      'sqrt', 'cbrt', 'abs',
      'log', 'log2', 'log10', 'ln',
      'exp', 'pow',
      'pi', 'e',
      'ceil', 'floor', 'round',
    ];

    if (!partial) return functions;

    const lastToken = partial.split(/[+\-*/^(),\s]/).pop() || '';
    if (!lastToken) return [];

    return functions.filter(f =>
      f.startsWith(lastToken.toLowerCase()) && f !== lastToken.toLowerCase()
    );
  }

  /**
   * Intenta calcular la derivada simbólica, o retorna un aproximador numérico.
   */
  getDerivative(expression: string): {
    success: boolean;
    fn?: (x: number) => number;
    symbolic?: string;
    error?: string;
  } {
    try {
      // Intentar derivada simbólica con math.js
      const derivative = math.derivative(expression, 'x');
      const derivativeStr = derivative.toString();
      const compiled = math.compile(derivativeStr);

      return {
        success: true,
        fn: (x: number) => compiled.evaluate({ x }) as number,
        symbolic: derivativeStr,
      };
    } catch {
      // Fallback: derivada numérica (diferencia centrada)
      const parsed = this.parse(expression);
      if (!parsed.success || !parsed.fn) {
        return { success: false, error: 'No se pudo calcular la derivada' };
      }

      const originalFn = parsed.fn;
      const h = 1e-8;
      return {
        success: true,
        fn: (x: number) => (originalFn(x + h) - originalFn(x - h)) / (2 * h),
        symbolic: '(aproximación numérica)',
      };
    }
  }
}
