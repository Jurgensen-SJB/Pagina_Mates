'use client';

import { useState } from 'react';
import { useCalculation } from '@/presentation/hooks/useCalculation';
import FunctionInput from '@/presentation/components/forms/FunctionInput';
import StepByStepTable from '@/presentation/components/results/StepByStepTable';
import ResultSummary from '@/presentation/components/results/ResultSummary';
import IntegrationChart from '@/presentation/components/charts/IntegrationChart';
import { MathParser } from '@/infrastructure/math-parser/MathParser';
import { getMethodById } from '@/lib/methods-data';

const parser = new MathParser();

export default function Simpson38Page() {
  const method = getMethodById('simpson-38')!;
  const { result, loading, error, warning, execute, clear } = useCalculation('simpson-38');

  const [funcStr, setFuncStr] = useState('x^2');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('9');
  const [showChart, setShowChart] = useState(false);
  const [funcError, setFuncError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (funcError) return;
    await execute({
      functionString: funcStr,
      parameters: { a: parseFloat(a), b: parseFloat(b), n: parseInt(n) },
    });
  };

  const parsedFn = parser.parse(funcStr);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{method.icon}</span>
          <h1 className="text-3xl font-bold gradient-text-secondary">{method.name}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{method.description}</p>
        <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Fórmula:</strong> I ≈ (3h/8) · [f(x₀) + 3·Σf(x_no_múlt_3) + 2·Σf(x_múlt_3) + f(xₙ)]. Error O(h⁴). Requiere n divisible por 3.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Parámetros de Entrada</h2>
        <div className="space-y-4">
          <FunctionInput value={funcStr} onChange={setFuncStr} onError={setFuncError} label="f(x) =" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>a (inferior)</label>
              <input type="number" step="any" value={a} onChange={e => setA(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>b (superior)</label>
              <input type="number" step="any" value={b} onChange={e => setB(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                n (<span style={{ color: 'var(--warning)' }}>divisible por 3</span>)
              </label>
              <input type="number" value={n} onChange={e => setN(e.target.value)} className="input-field" required min="3" max="10000" step="3" />
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📋 Tabla de Evaluaciones</h3>
            <StepByStepTable steps={result.steps} />
          </div>
          <div className="glass-card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={showChart} onChange={e => setShowChart(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 Mostrar gráfica</span>
            </label>
            {showChart && parsedFn.success && parsedFn.fn && (
              <div className="mt-4">
                <IntegrationChart fn={parsedFn.fn} a={parseFloat(a)} b={parseFloat(b)} n={parseInt(n)} title="Área bajo la curva (Simpson 3/8)" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
