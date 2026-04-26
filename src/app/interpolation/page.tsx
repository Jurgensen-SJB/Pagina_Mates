import Link from 'next/link';
import { getMethodsByCategory } from '@/lib/methods-data';
import MethodCard from '@/presentation/components/common/MethodCard';

export default function InterpolationPage() {
  const methods = getMethodsByCategory('interpolation');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fadeInUp">
        <Link href="/" className="text-sm mb-4 inline-flex items-center gap-1 transition-colors hover:text-[var(--primary-light)]"
          style={{ color: 'var(--text-muted)' }}>
          ← Volver al inicio
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-3xl">📊</span>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interpolación</h1>
        </div>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Métodos para construir polinomios que pasen por un conjunto de puntos dados.
          Desde interpolación lineal hasta Newton con diferencias divididas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method, i) => (
          <MethodCard key={method.id} {...method} index={i} />
        ))}
      </div>
    </div>
  );
}

