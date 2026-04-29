import { useEffect, useRef } from 'react';

export const useScanner = (onScan: (barcode: string) => void) => {
  const buffer = useRef('');
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (buffer.current.length > 0) {
          onScan(buffer.current.trim());
          buffer.current = '';
        }
        return;
      }
      if (e.key.length === 1 && /[\x20-\x7E]/.test(e.key)) {
        buffer.current += e.key;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onScan]);
};
