'use client';

import { useState, useEffect, useCallback } from 'react';

const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface StoredData<T> {
  data: T;
  timestamp: number;
}

/**
 * Hook para persistencia temporal en sessionStorage con TTL de 30 minutos.
 */
export function useSessionStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [hasRecovered, setHasRecovered] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        const parsed: StoredData<T> = JSON.parse(item);
        const elapsed = Date.now() - parsed.timestamp;
        if (elapsed < TTL_MS) {
          setStoredValue(parsed.data);
          setHasRecovered(true);
        } else {
          sessionStorage.removeItem(key);
        }
      }
    } catch {
      sessionStorage.removeItem(key);
    }
  }, [key]);

  const save = useCallback((data: T) => {
    try {
      const stored: StoredData<T> = { data, timestamp: Date.now() };
      sessionStorage.setItem(key, JSON.stringify(stored));
      setStoredValue(data);
    } catch {
      // sessionStorage full or unavailable
    }
  }, [key]);

  const clear = useCallback(() => {
    sessionStorage.removeItem(key);
    setStoredValue(null);
    setHasRecovered(false);
  }, [key]);

  const dismissRecovery = useCallback(() => {
    setHasRecovered(false);
  }, []);

  return { storedValue, hasRecovered, save, clear, dismissRecovery };
}
