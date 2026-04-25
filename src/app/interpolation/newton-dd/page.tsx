'use client';

import { useState } from 'react';
import { useCalculation } from '@/presentation/hooks/useCalculation';
import StepByStepTable from '@/presentation/components/results/StepByStepTable';
import ResultSummary from '@/presentation/components/results/ResultSummary';
import InterpolationChart from '@/presentation/components/charts/InterpolationChart';
import { getMethodById } from '@/lib/methods-data';

export default function NewtonDDPage() {
  const method = getMethodById('newton-dd')!;
  const { result, loading, error, execute, clear } = useCalculation('newton-dd');

  const [points, setPoints] = useState<Array<{ x: string; y: string }>>([
    { x: '1', y: '1' },
    { x: '2', y: '4' },
    { x: '3', y: '9' },
    { x: '4', y: '16' },
  ]);
  const [evalAt, setEvalAt] = useState('2.5');
  const [showChart, setShowChart] = useState(false);

  const addPoint = () => setPoints([...points, { x: '', y: '' }]);
  const removePoint = (idx: number) => {
    if (points.length <= 2) return;
    setPoints(points.filter((_, i) => i !== idx));
  };
  const updatePoint = (idx: number, field: 'x' | 'y', value: string) => {
    const updated = [...points];
    updated[idx] = { ...updated[idx], [field]: value };
    setPoints(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPoints = points
      .filter(p => p.x !== '' && p.y !== '')
      .map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));
    const evaluateAt = evalAt.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    await execute({ points: numPoints, parameters: { evaluateAt } });
  };

  const numericPoints = points
    .filter(p => p.x !== '' && p.y !== '')
    .map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{method.icon}</span>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{method.name}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{method.description}</p>
        <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Método:</strong> Construye tabla de diferencias divididas y evalúa P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ...
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Puntos de Datos</h2>

        <div className="space-y-2 mb-4">
          {points.map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>P{i}:</span>
              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>x =</label>
                <input type="number" step="any" value={point.x} onChange={e => updatePoint(i, 'x', e.target.value)}
                  className="input-field flex-1" required />
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>y =</label>
                <input type="number" step="any" value={point.y} onChange={e => updatePoint(i, 'y', e.target.value)}
                  className="input-field flex-1" required />
              </div>
              {points.length > 2 && (
                <button type="button" onClick={() => removePoint(i)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20" style={{ color: 'var(--danger)' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={addPoint}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-dashed transition-colors hover:bg-[var(--surface-hover)]"
          style={{ borderColor: 'var(--border)', color: 'var(--primary-light)' }}>
          + Agregar punto
        </button>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Evaluar en x = (separados por coma)
          </label>
          <input type="text" value={evalAt} onChange={e => setEvalAt(e.target.value)}
            className="input-field" placeholder="Ej: 2.5, 1.5" required />
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📋 Tabla de Diferencias Divididas</h3>
            <StepByStepTable steps={result.steps} />
          </div>
          <div className="glass-card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={showChart} onChange={e => setShowChart(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 Mostrar gráfica</span>
            </label>
            {showChart && (
              <div className="mt-4">
                <InterpolationChart points={numericPoints} interpolantFn={result.interpolantFn} title="Polinomio de Newton (Diferencias Divididas)" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
