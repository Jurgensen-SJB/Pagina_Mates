/**
 * Detalle de un paso individual en un método numérico iterativo.
 * Cada iteración registra valores intermedios, cálculos y estado.
 */
export interface StepDetail {
  /** Número de iteración (comenzando desde 0 o 1) */
  iteration: number;
  /** Valores principales del paso (dinámico según método) */
  values: Record<string, number | string>;
  /** Cálculos intermedios realizados en este paso */
  intermediateCalculations: Record<string, number | string>;
  /** Error relativo aproximado (Ea). Null en la primera iteración */
  relativeError: number | null;
  /** Estado del paso */
  status: "continuing" | "converged" | "error" | "warning";
}
