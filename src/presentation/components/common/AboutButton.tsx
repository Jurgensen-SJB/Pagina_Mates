'use client';

import { useState } from 'react';

export default function AboutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 group"
        style={{
          background: 'var(--gradient-primary)',
          color: 'var(--text-inverse)',
          boxShadow: 'var(--shadow-glow-sm)',
        }}
        aria-label="Acerca de"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:rotate-12"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className="absolute right-14 scale-0 origin-right transition-all duration-200 group-hover:scale-100 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 whitespace-nowrap shadow-md">
          Acerca de
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: 'rgba(9, 9, 11, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="w-full max-w-md glass-card p-6 md:p-8 relative animate-fadeInUp"
            style={{
              background: 'rgba(20, 20, 30, 0.95)',
              borderColor: 'rgba(129, 140, 248, 0.25)',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <span className="text-2xl">🎓</span>
              </div>

              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Información del Proyecto
              </h3>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Código elaborado por <strong className="text-indigo-300">Sneider Jurgensen</strong>, estudiante de Ingeniería de Sistemas de la Universidad Simón Bolívar.
              </p>

              <div className="h-px w-full bg-zinc-800 my-4" />

              {/* Logo Card */}
              <div className="bg-white/95 p-4 rounded-xl flex items-center justify-center border border-white/10 shadow-sm mt-4 hover:scale-[1.02] transition-transform duration-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Unisimon.svg"
                  alt="Universidad Simón Bolívar Logo"
                  className="h-10 w-auto object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
