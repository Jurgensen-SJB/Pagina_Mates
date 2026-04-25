import { StepDetail } from '../../domain/entities/StepDetail';

/**
 * DTO para respuestas de cálculo numérico.
 */
export interface CalculationResponse {
  /** Si el cálculo fue exitoso */
  success: boolean;
  /** Datos del resultado */
  data?: {
    /** Resultado numérico */
    result: number | number[];
    /** Número de iteraciones */
    iterations: number;
    /** Pasos detallados */
    steps: StepDetail[];
    /** Tiempo de ejecución en ms */
    executionTime: number;
    /** Advertencia opcional */
    warning?: string;
    /** Función interpolante (serializada como evaluador) */
    interpolantFn?: (x: number) => number;
  };
  /** Información de error */
  error?: {
    /** Código de error */
    code: string;
    /** Mensaje descriptivo */
    message: string;
    /** Sugerencia para el usuario */
    suggestion?: string;
  };
}
