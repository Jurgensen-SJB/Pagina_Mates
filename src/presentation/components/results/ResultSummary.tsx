'use client';

import { CalculationResult } from '@/domain/entities/CalculationResult';

interface ResultSummaryProps {
  result: CalculationResult;
}

function formatResult(val: number | number[]): string {
  if (Array.isArray(val)) {
    return val.map(v => formatSingleNumber(v)).join(', ');
  }
  return formatSingleNumber(val);
}

function formatSingleNumber(val: number): string {
  if (isNaN(val)) return 'No encontrado';
  if (!isFinite(val)) return val > 0 ? '+∞' : '-∞';
  if (Math.abs(val) > 1e6 || (Math.abs(val) < 1e-6 && val !== 0)) {
    return val.toExponential(6);
  }
  return val.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  const lastStep = result.steps[result.steps.length - 1];
  const lastError = lastStep?.relativeError;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{
        borderColor: 'var(--border)',
        background: result.success
          ? 'rgba(16, 185, 129, 0.08)'
          : 'rgba(239, 68, 68, 0.08)',
      }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{result.success ? '✅' : '❌'}</span>
          <h3 className="text-sm font-bold uppercase tracking-wider"
            style={{ color: result.success ? 'var(--success)' : 'var(--danger)' }}>
            {result.success ? 'Resultado Final' : 'Cálculo No Exitoso'}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Result */}
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              {result.method.includes('interpolation') || result.method === 'lagrange' || result.method === 'newton-dd'
                ? 'Valor Interpolado'
                : result.method.includes('trapezoid') || result.method.includes('simpson')
                  ? 'Integral Aproximada'
                  : 'Raíz Encontrada'}
            </p>
            <p className="text-2xl font-bold font-mono" style={{
              color: result.success ? 'var(--primary-light)' : 'var(--danger)',
            }}>
              {formatResult(result.result)}
            </p>
          </div>

          {/* Iterations */}
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              Iteraciones
            </p>
            <p className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {result.iterations}
            </p>
          </div>

          {/* Execution Time */}
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              Tiempo
            </p>
            <p className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {result.executionTime < 1
                ? `${(result.executionTime * 1000).toFixed(0)} μs`
                : `${result.executionTime.toFixed(2)} ms`}
            </p>
          </div>

          {/* Error */}
          {lastError !== null && lastError !== undefined && (
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Error Relativo Aproximado (Ea)
              </p>
              <p className="text-lg font-bold font-mono" style={{ color: 'var(--warning)' }}>
                {lastError.toExponential(4)}
              </p>
            </div>
          )}
        </div>

        {/* Warning */}
        {result.warning && (
          <div className="mt-4 p-3 rounded-lg flex items-start gap-2 text-sm"
            style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-light)' }}>
            <span>⚠️</span>
            <span>{result.warning}</span>
          </div>
        )}

        {/* Error message */}
        {result.error && (
          <div className="mt-4 p-3 rounded-lg flex items-start gap-2 text-sm"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-light)' }}>
            <span>❌</span>
            <span>{result.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
