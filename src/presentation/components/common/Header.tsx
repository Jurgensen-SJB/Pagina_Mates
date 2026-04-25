'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border" style={{
      background: 'rgba(11, 15, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold"
              style={{ background: 'var(--gradient-primary)' }}>
              Σ
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                Métodos Numéricos
              </h1>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                Calculadora Interactiva
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Inicio" />
            <NavLink href="/root-finding" label="Raíces" />
            <NavLink href="/integration" label="Integración" />
            <NavLink href="/interpolation" label="Interpolación" />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slideDown border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <nav className="px-4 py-3 flex flex-col gap-1">
            <MobileNavLink href="/" label="🏠 Inicio" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/root-finding" label="🔍 Raíces de Ecuaciones" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/integration" label="∫ Integración Numérica" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/interpolation" label="📊 Interpolación" onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-hover)]"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-hover)]"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
    </Link>
  );
}
