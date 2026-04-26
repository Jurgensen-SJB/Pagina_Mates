'use client';

import { useState } from 'react';
import { useCalculation } from '@/presentation/hooks/useCalculation';
import FunctionInput from '@/presentation/components/forms/FunctionInput';
import StepByStepTable from '@/presentation/components/results/StepByStepTable';
import ResultSummary from '@/presentation/components/results/ResultSummary';
import FunctionChart from '@/presentation/components/charts/FunctionChart';
import ConvergenceChart from '@/presentation/components/charts/ConvergenceChart';
import { MathParser } from '@/infrastructure/math-parser/MathParser';
import { getMethodById } from '@/lib/methods-data';

const parser = new MathParser();

export default function NewtonRaphsonPage() {
  const method = getMethodById('newton-raphson')!;
  const { result, loading, error, warning, execute, clear } = useCalculation('newton-raphson');

  const [funcStr, setFuncStr] = useState('x^3 - x - 2');
  const [derivStr, setDerivStr] = useState('');
  const [autoDerivative, setAutoDerivative] = useState(true);
  const [x0, setX0] = useState('1.5');
  const [tolerance, setTolerance] = useState('0.000001');
  const [maxIter, setMaxIter] = useState('100');
  const [showChart, setShowChart] = useState(false);
  const [funcError, setFuncError] = useState<string | null>(null);
  const [derivError, setDerivError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (funcError || (!autoDerivative && derivError)) return;
    await execute({
      functionString: funcStr,
      derivativeString: autoDerivative ? undefined : derivStr,
      parameters: {
        x0: parseFloat(x0),
        tolerance: parseFloat(tolerance),
        maxIterations: parseInt(maxIter),
      },
    });
  };

  const parsedFn = parser.parse(funcStr);

  // Calculate symbolic derivative for display
  const symbolicDeriv = parser.getDerivative(funcStr);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{method.icon}</span>
          <h1 className="text-3xl font-bold gradient-text">{method.name}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{method.description}</p>
        <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Base teórica:</strong> {method.theoreticalBasis}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Parámetros de Entrada</h2>
        <div className="space-y-4">
          <FunctionInput value={funcStr} onChange={setFuncStr} onError={setFuncError}
            label="f(x) =" placeholder="Ej: x^3 - x - 2" />

          {/* Derivative section */}
          <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={autoDerivative} onChange={e => setAutoDerivative(e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Calcular derivada automáticamente
              </span>
            </label>

            {autoDerivative && symbolicDeriv.success && (
              <div className="text-sm font-mono p-2 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success-light)' }}>
                f&apos;(x) = {symbolicDeriv.symbolic}
              </div>
            )}

            {!autoDerivative && (
              <FunctionInput value={derivStr} onChange={setDerivStr} onError={setDerivError}
                label="f'(x) =" placeholder="Ej: 3*x^2 - 1" id="derivative-input" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>x₀ (inicial)</label>
              <input type="number" step="any" value={x0} onChange={e => setX0(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Tolerancia (ε)</label>
              <input type="number" step="any" value={tolerance} onChange={e => setTolerance(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Máx. Iteraciones</label>
              <input type="number" value={maxIter} onChange={e => setMaxIter(e.target.value)} className="input-field" required min="1" max="1000" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="btn-primary" disabled={loading || !!funcError}>
            {loading ? '⏳ Calculando...' : '▶ Calcular'}
          </button>
          {result && <button type="button" className="btn-secondary" onClick={clear}>🗑 Limpiar</button>}
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg border animate-slideDown"
          style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'var(--danger)', color: 'var(--danger-light)' }}>❌ {error}</div>
      )}
      {warning && !error && (
        <div className="mb-6 p-4 rounded-lg border animate-slideDown"
          style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'var(--warning)', color: 'var(--warning-light)' }}>⚠️ {warning}</div>
      )}

      {result && (
        <div className="space-y-6 animate-fadeInUp">
          <ResultSummary result={result} />
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📋 Tabla Paso a Paso</h3>
            <StepByStepTable steps={result.steps} />
          </div>
          <div className="glass-card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={showChart} onChange={e => setShowChart(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 Mostrar gráficas</span>
            </label>
            {showChart && parsedFn.success && parsedFn.fn && (
              <div className="mt-4 space-y-4">
                <FunctionChart fn={parsedFn.fn}
                  xMin={(result.result as number) - 3} xMax={(result.result as number) + 3}
                  root={result.success ? (result.result as number) : undefined} title="f(x) y raíz" />
                <ConvergenceChart steps={result.steps} tolerance={parseFloat(tolerance)} title="Convergencia cuadrática" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

