'use client';

import { useState } from 'react';
import { useCalculation } from '@/presentation/hooks/useCalculation';
import StepByStepTable from '@/presentation/components/results/StepByStepTable';
import ResultSummary from '@/presentation/components/results/ResultSummary';
import InterpolationChart from '@/presentation/components/charts/InterpolationChart';
import { getMethodById } from '@/lib/methods-data';

export default function LinearInterpolationPage() {
  const method = getMethodById('linear-interpolation')!;
  const { result, loading, error, execute, clear } = useCalculation('linear-interpolation');

  const [x0, setX0] = useState('1');
  const [y0, setY0] = useState('1');
  const [x1, setX1] = useState('3');
  const [y1, setY1] = useState('9');
  const [evalAt, setEvalAt] = useState('2');
  const [showChart, setShowChart] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const points = [
      { x: parseFloat(x0), y: parseFloat(y0) },
      { x: parseFloat(x1), y: parseFloat(y1) },
    ];
    const evaluateAt = evalAt.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    await execute({ points, parameters: { evaluateAt } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{method.icon}</span>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{method.name}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{method.description}</p>
        <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Fórmula:</strong> P(x) = y₀ + (y₁ - y₀)/(x₁ - x₀) · (x - x₀)
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Puntos de Datos</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>x₀</label>
              <input type="number" step="any" value={x0} onChange={e => setX0(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>y₀</label>
              <input type="number" step="any" value={y0} onChange={e => setY0(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>x₁</label>
              <input type="number" step="any" value={x1} onChange={e => setX1(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>y₁</label>
              <input type="number" step="any" value={y1} onChange={e => setY1(e.target.value)} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Evaluar en x = (separados por coma)
            </label>
            <input type="text" value={evalAt} onChange={e => setEvalAt(e.target.value)}
              className="input-field" placeholder="Ej: 2, 2.5, 1.5" required />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Calculando...' : '▶ Calcular'}
          </button>
          {result && <button type="button" className="btn-secondary" onClick={clear}>🗑 Limpiar</button>}
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg border animate-slideDown"
          style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'var(--danger)', color: 'var(--danger-light)' }}>❌ {error}</div>
      )}

      {result && (
        <div className="space-y-6 animate-fadeInUp">
          <ResultSummary result={result} />
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📋 Detalle</h3>
            <StepByStepTable steps={result.steps} />
          </div>
          <div className="glass-card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={showChart} onChange={e => setShowChart(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 Mostrar gráfica</span>
            </label>
            {showChart && (
              <div className="mt-4">
                <InterpolationChart
                  points={[{ x: parseFloat(x0), y: parseFloat(y0) }, { x: parseFloat(x1), y: parseFloat(y1) }]}
                  interpolantFn={result.interpolantFn}
                  title="Interpolación Lineal"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

