'use client';

import { useState } from 'react';

interface ScientificKeyboardProps {
  onInsert: (text: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

type KeyboardTab = 'basic' | 'functions' | 'advanced';

interface KeyDef {
  label: string;
  insert: string;
  color?: string;
  wide?: boolean;
  title?: string;
}

const TABS: { id: KeyboardTab; label: string; icon: string }[] = [
  { id: 'basic', label: 'Básico', icon: '🔢' },
  { id: 'functions', label: 'Funciones', icon: 'ƒ' },
  { id: 'advanced', label: 'Avanzado', icon: '∑' },
];

const BASIC_KEYS: KeyDef[][] = [
  [
    { label: 'x', insert: 'x', color: 'var(--primary)' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: '^', insert: '^', title: 'Potencia' },
    { label: '÷', insert: '/', color: 'var(--secondary)' },
  ],
  [
    { label: '7', insert: '7' },
    { label: '8', insert: '8' },
    { label: '9', insert: '9' },
    { label: '×', insert: '*', color: 'var(--secondary)' },
    { label: 'π', insert: 'pi', color: 'var(--accent)' },
  ],
  [
    { label: '4', insert: '4' },
    { label: '5', insert: '5' },
    { label: '6', insert: '6' },
    { label: '−', insert: '-', color: 'var(--secondary)' },
    { label: 'e', insert: 'e', color: 'var(--accent)' },
  ],
  [
    { label: '1', insert: '1' },
    { label: '2', insert: '2' },
    { label: '3', insert: '3' },
    { label: '+', insert: '+', color: 'var(--secondary)' },
    { label: 'x²', insert: 'x^2', color: 'var(--accent)', title: 'x al cuadrado' },
  ],
  [
    { label: '0', insert: '0', wide: true },
    { label: '.', insert: '.' },
    { label: '±', insert: '-', color: 'var(--secondary)', title: 'Negativo' },
    { label: 'x³', insert: 'x^3', color: 'var(--accent)', title: 'x al cubo' },
  ],
];

const FUNCTION_KEYS: KeyDef[][] = [
  [
    { label: 'sin', insert: 'sin(', color: 'var(--primary)' },
    { label: 'cos', insert: 'cos(', color: 'var(--primary)' },
    { label: 'tan', insert: 'tan(', color: 'var(--primary)' },
    { label: '√', insert: 'sqrt(', color: 'var(--accent)', title: 'Raíz cuadrada' },
  ],
  [
    { label: 'asin', insert: 'asin(', color: 'var(--primary)' },
    { label: 'acos', insert: 'acos(', color: 'var(--primary)' },
    { label: 'atan', insert: 'atan(', color: 'var(--primary)' },
    { label: '∛', insert: 'cbrt(', color: 'var(--accent)', title: 'Raíz cúbica' },
  ],
  [
    { label: 'sinh', insert: 'sinh(' },
    { label: 'cosh', insert: 'cosh(' },
    { label: 'tanh', insert: 'tanh(' },
    { label: 'ⁿ√', insert: 'nthRoot(', title: 'Raíz n-ésima: nthRoot(x, n)' },
  ],
  [
    { label: 'ln', insert: 'log(', color: 'var(--secondary)', title: 'Logaritmo natural' },
    { label: 'log₁₀', insert: 'log10(', color: 'var(--secondary)' },
    { label: 'log₂', insert: 'log2(', color: 'var(--secondary)' },
    { label: 'exp', insert: 'exp(', color: 'var(--accent)', title: 'e^x' },
  ],
];

const ADVANCED_KEYS: KeyDef[][] = [
  [
    { label: '|x|', insert: 'abs(', color: 'var(--primary)', title: 'Valor absoluto' },
    { label: '⌈x⌉', insert: 'ceil(', title: 'Techo' },
    { label: '⌊x⌋', insert: 'floor(', title: 'Piso' },
    { label: 'round', insert: 'round(' },
  ],
  [
    { label: 'xⁿ', insert: '^(', color: 'var(--accent)', title: 'Potencia personalizada' },
    { label: 'eˣ', insert: 'exp(', color: 'var(--accent)' },
    { label: '1/x', insert: '1/(', color: 'var(--secondary)' },
    { label: 'x!', insert: 'factorial(', title: 'Factorial' },
  ],
  [
    { label: 'mod', insert: ' mod ', title: 'Módulo' },
    { label: ',', insert: ', ', title: 'Separador de argumentos' },
    { label: 'pow', insert: 'pow(', title: 'pow(base, exp)' },
    { label: 'sign', insert: 'sign(' },
  ],
  [
    { label: '2π', insert: '2*pi', color: 'var(--accent)' },
    { label: 'π/2', insert: 'pi/2', color: 'var(--accent)' },
    { label: 'e²', insert: 'e^2', color: 'var(--accent)' },
    { label: '∞', insert: 'Infinity' },
  ],
];

export default function ScientificKeyboard({ onInsert, onBackspace, onClear }: ScientificKeyboardProps) {
  const [activeTab, setActiveTab] = useState<KeyboardTab>('basic');

  const getKeys = (): KeyDef[][] => {
    switch (activeTab) {
      case 'basic': return BASIC_KEYS;
      case 'functions': return FUNCTION_KEYS;
      case 'advanced': return ADVANCED_KEYS;
    }
  };

  return (
    <div
      className="mt-2 rounded-xl border overflow-hidden animate-slideDown"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Tab Bar */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-3 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              color: activeTab === tab.id ? 'var(--primary-light)' : 'var(--text-muted)',
              background: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}

        {/* Action buttons */}
        <div className="flex border-l" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            onClick={onBackspace}
            className="px-3 py-2 text-xs font-semibold transition-colors hover:bg-[var(--surface-hover)]"
            style={{ color: 'var(--warning)' }}
            title="Borrar último carácter"
          >
            ⌫
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-2 text-xs font-semibold transition-colors hover:bg-[var(--surface-hover)]"
            style={{ color: 'var(--danger)' }}
            title="Limpiar todo"
          >
            AC
          </button>
        </div>
      </div>

      {/* Keys Grid */}
      <div className="p-2 space-y-1.5">
        {getKeys().map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5">
            {row.map((key, keyIdx) => (
              <button
                key={keyIdx}
                type="button"
                onClick={() => onInsert(key.insert)}
                title={key.title || key.label}
                className={`
                  ${key.wide ? 'flex-[2]' : 'flex-1'}
                  py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  hover:scale-[1.04] active:scale-95
                `}
                style={{
                  background: key.color
                    ? `${key.color}15`
                    : 'var(--surface-hover)',
                  color: key.color || 'var(--text-primary)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = key.color || 'var(--border-hover)';
                  (e.target as HTMLElement).style.boxShadow = `0 0 8px ${key.color || 'var(--primary)'}30`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'transparent';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Helper text */}
      <div className="px-3 py-1.5 text-center border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          💡 También puedes escribir directamente en el campo de texto
        </p>
      </div>
    </div>
  );
}
