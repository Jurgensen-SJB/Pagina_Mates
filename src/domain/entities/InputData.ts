/**
 * Datos de entrada para un cálculo numérico.
 */
export interface InputData {
  /** Identificador del método seleccionado */
  methodId: string;
  /** Parámetros del cálculo (dinámicos según método) */
  params: Record<string, unknown>;
  /** Timestamp de creación */
  timestamp: number;
}
