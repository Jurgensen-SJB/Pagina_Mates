import { StepDetail } from './StepDetail';

/**
 * Resultado completo de un cálculo numérico.
 * Incluye el resultado final, pasos intermedios y metadatos de ejecución.
 */
export interface CalculationResult {
  /** Identificador del método usado */
  method: string;
  /** Si el cálculo fue exitoso */
  success: boolean;
  /** Resultado numérico (raíz, integral, valor interpolado) */
  result: number | number[];
  /** Número total de iteraciones realizadas */
  iterations: number;
  /** Detalle paso a paso de cada iteración */
  steps: StepDetail[];
  /** Mensaje de error si hubo fallo */
  error?: string;
  /** Mensaje de advertencia */
  warning?: string;
  /** Tiempo de ejecución en milisegundos */
  executionTime: number;
  /** Función interpolante generada (para métodos de interpolación) */
  interpolantFn?: (x: number) => number;
}
