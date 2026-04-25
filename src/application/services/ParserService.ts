import { MathParser } from '../../infrastructure/math-parser/MathParser';

/**
 * Servicio que abstrae el MathParser para la capa de aplicación.
 */
export class ParserService {
  private mathParser = new MathParser();

  /**
   * Parsea una expresión f(x) y retorna una función evaluable.
   */
  parseFunction(expression: string): {
    success: boolean;
    fn?: (x: number) => number;
    error?: string;
  } {
    const validation = this.mathParser.validateExpression(expression);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    return this.mathParser.parse(expression);
  }

  /**
   * Obtiene la derivada de una expresión.
   * Intenta simbólica primero, luego numérica.
   */
  parseDerivative(expression: string): {
    success: boolean;
    derivativeFn?: (x: number) => number;
    symbolic?: string;
    error?: string;
  } {
    const result = this.mathParser.getDerivative(expression);
    return {
      success: result.success,
      derivativeFn: result.fn,
      symbolic: result.symbolic,
      error: result.error,
    };
  }

  /**
   * Valida una expresión sin compilarla.
   */
  validate(expression: string) {
    return this.mathParser.validateExpression(expression);
  }

  /**
   * Obtiene sugerencias de autocompletado.
   */
  getSuggestions(partial: string): string[] {
    return this.mathParser.getSuggestions(partial);
  }
}
