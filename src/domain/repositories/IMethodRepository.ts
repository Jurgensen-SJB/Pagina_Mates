import { NumericalMethod } from '../entities/NumericalMethod';
import { CalculationResult } from '../entities/CalculationResult';

/**
 * Contrato para acceso a datos de métodos numéricos.
 */
export interface IMethodRepository {
  getMethodById(id: string): NumericalMethod | null;
  getAllMethods(): NumericalMethod[];
  getMethodsByCategory(category: string): NumericalMethod[];
}

/**
 * Contrato para persistencia de cálculos (en memoria o sessionStorage).
 */
export interface ICalculationRepository {
  saveCalculation(id: string, result: CalculationResult): void;
  getCalculation(id: string): CalculationResult | null;
  clearCalculation(id: string): void;
  clearAll(): void;
}
