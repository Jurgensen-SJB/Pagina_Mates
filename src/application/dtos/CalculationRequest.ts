/**
 * DTO para solicitudes de cálculo numérico.
 */
export interface CalculationRequest {
  /** Identificador del método a ejecutar */
  methodId: string;
  /** Expresión de función como string (para raíces e integración) */
  functionString?: string;
  /** Expresión de g(x) para punto fijo */
  gFunctionString?: string;
  /** Expresión de la derivada (para Newton-Raphson) */
  derivativeString?: string;
  /** Puntos de datos (para interpolación) */
  points?: Array<{ x: number; y: number }>;
  /** Parámetros del cálculo */
  parameters: {
    /** Límite inferior o inicio de intervalo */
    a?: number;
    /** Límite superior */
    b?: number;
    /** Aproximación inicial */
    x0?: number;
    /** Tolerancia (epsilon) */
    tolerance?: number;
    /** Número máximo de iteraciones */
    maxIterations?: number;
    /** Número de subintervalos (integración) */
    n?: number;
    /** Puntos a evaluar en interpolación */
    evaluateAt?: number[];
  };
}
