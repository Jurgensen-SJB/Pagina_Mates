'use client';

import { useState } from 'react';
import MethodCard from '@/presentation/components/common/MethodCard';
import SearchBar from '@/presentation/components/common/SearchBar';
import { METHODS, CATEGORIES } from '@/lib/methods-data';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMethods = METHODS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let globalIndex = 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="gradient-text">Métodos Numéricos</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
          Resuelve problemas de raíces, integración e interpolación con
          visualización <strong style={{ color: 'var(--primary-light)' }}>paso a paso</strong> y gráficas interactivas.
        </p>

        {/* Search */}
        <SearchBar onSearch={setSearchQuery} placeholder="Buscar método (ej: bisección, simpson, lagrange...)" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-14">
        {CATEGORIES.map(cat => {
          const count = METHODS.filter(m => m.category === cat.id).length;
          return (
            <div key={cat.id} className="text-center glass-card p-3">
              <div className="text-xl mb-1">{cat.icon}</div>
              <div className="text-xl font-bold" style={{ color: cat.color }}>{count}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {cat.id === 'root-finding' ? 'Raíces' :
                 cat.id === 'integration' ? 'Integración' : 'Interpolación'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Methods by Category */}
      {searchQuery ? (
        /* Filtered Results */
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}>
            {filteredMethods.length} resultado{filteredMethods.length !== 1 ? 's' : ''}
          </h2>
          {filteredMethods.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p style={{ color: 'var(--text-secondary)' }}>
                No se encontraron métodos para &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMethods.map((method, i) => (
                <MethodCard key={method.id} {...method} index={i} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Grouped by Category */
        CATEGORIES.map(cat => {
          const methods = METHODS.filter(m => m.category === cat.id);
          return (
            <section key={cat.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {cat.name}
                  </h2>
                  <div className="h-0.5 w-12 mt-1 rounded-full" style={{ background: cat.color }} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {methods.map(method => {
                  const card = <MethodCard key={method.id} {...method} index={globalIndex} />;
                  globalIndex++;
                  return card;
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
