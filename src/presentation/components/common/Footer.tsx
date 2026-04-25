export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{
      borderColor: 'var(--border)',
      background: 'var(--surface)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--gradient-primary)' }}>
                Σ
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Métodos Numéricos
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Herramienta interactiva para resolver problemas de métodos numéricos
              con visualización paso a paso y gráficas dinámicas.
            </p>
          </div>

          {/* Methods */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-secondary)' }}>
              Métodos
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li>Bisección & Falsa Posición</li>
              <li>Punto Fijo & Newton-Raphson</li>
              <li>Trapecio & Simpson</li>
              <li>Lagrange & Newton DD</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-secondary)' }}>
              Referencia
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Basado en <em>&quot;Métodos Numéricos para Ingenieros&quot;</em> de Steven C. Chapra.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Métodos Numéricos · Proyecto Académico
        </div>
      </div>
    </footer>
  );
}
