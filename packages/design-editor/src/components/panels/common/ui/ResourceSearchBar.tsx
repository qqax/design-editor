'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (next: string) => void;
  debounceMs?: number;
  placeholder: string;
}

export function ResourceSearchBar({
  value,
  onChange,
  debounceMs = 300,
  placeholder,
}: Props) {
  const [local, setLocal] = useState(value);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(event.target.value);
    },
    []
  );

  useEffect(() => {
    if (local === value) return;

    const timeoutId = window.setTimeout(() => {
      onChange(local);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [local, value, debounceMs, onChange]);

  return (
    <div style={{ padding: '12px 12px 0 12px' }}>
      <input
        onChange={handleChange}
        placeholder={placeholder}
        type="search"
        value={local}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 13,
          border: '1px solid var(--de-color-border)',
          borderRadius: 6,
          background: 'var(--de-color-bg)',
          color: 'var(--de-color-text)',
          outline: 'none',
        }}
      />
    </div>
  );
}
