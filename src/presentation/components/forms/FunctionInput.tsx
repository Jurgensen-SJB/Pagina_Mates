'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MathParser } from '@/infrastructure/math-parser/MathParser';
import ScientificKeyboard from '@/presentation/components/forms/ScientificKeyboard';

interface FunctionInputProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

const parser = new MathParser();

export default function FunctionInput({
  value,
  onChange,
  onError,
  placeholder = 'Ej: x^2 - 3',
  label = 'f(x) =',
  id = 'function-input',
}: FunctionInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [cursorPos, setCursorPos] = useState<number>(value.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setError(null);
      onError?.(null);
      return;
    }

    const validation = parser.validateExpression(value);
    if (!validation.valid) {
      setError(validation.error || 'Expresión inválida');
      onError?.(validation.error || 'Expresión inválida');
    } else {
      setError(null);
      onError?.(null);
    }
  }, [value, onError]);

  // Close keyboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowKeyboard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInsert = useCallback((text: string) => {
    const before = value.slice(0, cursorPos);
    const after = value.slice(cursorPos);
    const newValue = before + text + after;
    const newCursorPos = cursorPos + text.length;
    onChange(newValue);
    setCursorPos(newCursorPos);

    // Restore focus and cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [value, cursorPos, onChange]);

  const handleBackspace = useCallback(() => {
    if (cursorPos === 0) return;
    const before = value.slice(0, cursorPos - 1);
    const after = value.slice(cursorPos);
    onChange(before + after);
    const newPos = cursorPos - 1;
    setCursorPos(newPos);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }, [value, cursorPos, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setCursorPos(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [onChange]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setCursorPos(inputRef.current?.selectionStart ?? newValue.length);
  };

  const handleInputClick = () => {
    setCursorPos(inputRef.current?.selectionStart ?? value.length);
  };

  const handleInputKeyUp = () => {
    setCursorPos(inputRef.current?.selectionStart ?? value.length);
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium mb-2"
        style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowKeyboard(true)}
          onClick={handleInputClick}
          onKeyUp={handleInputKeyUp}
          placeholder={placeholder}
          className={`input-field font-mono text-sm pr-20 ${error ? 'error' : ''}`}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Right-side controls */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Valid indicator */}
          {value && !error && (
            <span style={{ color: 'var(--success)' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 8l3 3 5-6" />
              </svg>
            </span>
          )}
          {/* Keyboard toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowKeyboard(!showKeyboard); }}
            className="p-1 rounded transition-colors hover:bg-[var(--surface-hover)]"
            style={{ color: showKeyboard ? 'var(--primary-light)' : 'var(--text-muted)' }}
            title="Teclado científico"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01" />
              <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
              <path d="M8 16h8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1 animate-slideDown"
          style={{ color: 'var(--danger-light)' }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Scientific Keyboard */}
      {showKeyboard && (
        <ScientificKeyboard
          onInsert={handleInsert}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />
      )}
    </div>
  );
}
