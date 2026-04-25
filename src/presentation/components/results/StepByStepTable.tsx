'use client';

import { StepDetail } from '@/domain/entities/StepDetail';

interface StepByStepTableProps {
  steps: StepDetail[];
  columns?: string[];
}

function formatNumber(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value !== 'number') return String(value);
  if (isNaN(value)) return 'NaN';
  if (!isFinite(value)) return value > 0 ? '+∞' : '-∞';
  if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(4);
  }
  return value.toFixed(6).replace(/\.?0+$/, '') || '0';
}

export default function StepByStepTable({ steps, columns }: StepByStepTableProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        No hay pasos para mostrar.
      </div>
    );
  }

  // Auto-detect columns from step values
  const allKeys = columns || Array.from(
    new Set(steps.flatMap(s => [
      ...Object.keys(s.values),
      ...(s.relativeError !== null ? ['Ea', 'Ea (%)'] : []),
    ]))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converged': return 'var(--success)';
      case 'error': return 'var(--danger)';
      case 'warning': return 'var(--warning)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'converged': return '✓ Convergió';
      case 'error': return '✗ Error';
      case 'warning': return '⚠ Advertencia';
      default: return '…';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ minWidth: '40px' }}>#</th>
            {allKeys.map(key => (
              <th key={key} style={{ minWidth: '90px' }}>{key}</th>
            ))}
            <th style={{ minWidth: '90px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, i) => (
            <tr key={i} className={step.status === 'converged' ? 'converged' : step.status === 'error' ? 'error-row' : ''}>
              <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                {step.iteration}
              </td>
              {allKeys.map(key => {
                let val: unknown;
                if (key === 'Ea') {
                  val = step.relativeError;
                } else if (key === 'Ea (%)') {
                  val = step.relativeError !== null ? step.relativeError * 100 : null;
                } else {
                  val = step.values[key] ?? step.intermediateCalculations[key] ?? null;
                }
                return (
                  <td key={key}>
                    {key === 'Ea (%)' && val !== null ? `${formatNumber(val)}%` : formatNumber(val)}
                  </td>
                );
              })}
              <td>
                <span className="text-xs font-semibold" style={{ color: getStatusColor(step.status) }}>
                  {getStatusLabel(step.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
