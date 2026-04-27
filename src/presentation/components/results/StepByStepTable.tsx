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

function getCellValue(step: StepDetail, key: string): string {
  let val: unknown;
  if (key === 'Ea') {
    val = step.relativeError;
  } else if (key === 'Ea (%)') {
    val = step.relativeError !== null ? step.relativeError * 100 : null;
  } else {
    val = step.values[key] ?? step.intermediateCalculations[key] ?? null;
  }
  return key === 'Ea (%)' && val !== null ? `${formatNumber(val)}%` : formatNumber(val);
}

export default function StepByStepTable({ steps, columns }: StepByStepTableProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        No hay pasos para mostrar.
      </div>
    );
  }

  const allKeys = columns || Array.from(
    new Set(steps.flatMap(s => [
      ...Object.keys(s.values),
      ...(s.relativeError !== null ? ['Ea', 'Ea (%)'] : []),
    ]))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converged': return 'var(--success)';
      case 'error':     return 'var(--danger)';
      case 'warning':   return 'var(--warning)';
      default:          return 'var(--text-muted)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'converged': return '✓ Convergió';
      case 'error':     return '✗ Error';
      case 'warning':   return '⚠ Advertencia';
      default:          return '…';
    }
  };

  const getRowBg = (status: string) => {
    if (status === 'converged') return 'var(--success-subtle)';
    if (status === 'error') return 'var(--danger-subtle)';
    return 'transparent';
  };

  return (
    <div>
      {/* ── DESKTOP: tabla clásica (≥ sm) ── */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
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
              <tr
                key={i}
                className={
                  step.status === 'converged' ? 'converged' :
                  step.status === 'error' ? 'error-row' : ''
                }
              >
                <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {step.iteration}
                </td>
                {allKeys.map(key => (
                  <td key={key}>{getCellValue(step, key)}</td>
                ))}
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

      {/* ── MÓVIL: tarjetas por iteración (< sm) ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              background: getRowBg(step.status) === 'transparent'
                ? 'rgba(15,14,22,0.92)'
                : getRowBg(step.status),
              border: '1px solid',
              borderColor:
                step.status === 'converged' ? 'rgba(34,197,94,0.25)' :
                step.status === 'error'     ? 'rgba(239,68,68,0.25)' :
                'var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
            }}
          >
            {/* Header de la tarjeta */}
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--primary)',
                }}
              >
                Iteración {step.iteration}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: getStatusColor(step.status),
                }}
              >
                {getStatusLabel(step.status)}
              </span>
            </div>

            {/* Grid de valores: 2 columnas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 12px',
              }}
            >
              {allKeys.map(key => (
                <div key={key}>
                  <p
                    style={{
                      fontSize: '0.6rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      marginBottom: '1px',
                    }}
                  >
                    {key}
                  </p>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      wordBreak: 'break-all',
                    }}
                  >
                    {getCellValue(step, key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
