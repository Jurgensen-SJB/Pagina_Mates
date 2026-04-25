'use client';

import { useState, useCallback } from 'react';
import { CalculationResult } from '@/domain/entities/CalculationResult';
import { CalculationRequest } from '@/application/dtos/CalculationRequest';
import { calculationService } from '@/application/services/CalculationService';

/**
 * Hook para gestionar la lógica de cálculo numérico.
 */
export function useCalculation(methodId: string) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const execute = useCallback(async (request: Omit<CalculationRequest, 'methodId'>) => {
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await calculationService.execute({
        methodId,
        ...request,
      });

      if (response.success && response.data) {
        const calcResult: CalculationResult = {
          method: methodId,
          success: true,
          result: response.data.result,
          iterations: response.data.iterations,
          steps: response.data.steps,
          executionTime: response.data.executionTime,
          warning: response.data.warning,
          interpolantFn: response.data.interpolantFn,
        };
        setResult(calcResult);
        if (response.data.warning) {
          setWarning(response.data.warning);
        }
      } else {
        setError(response.error?.message || 'Error desconocido');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, [methodId]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setWarning(null);
  }, []);

  return { result, loading, error, warning, execute, clear };
}
