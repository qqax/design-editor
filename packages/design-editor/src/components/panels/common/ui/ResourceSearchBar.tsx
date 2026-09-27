'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Search } from 'lucide-react';

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
    <div className="de-panel-search">
      <Search size={14} />
      <input
        aria-label={placeholder}
        onChange={handleChange}
        placeholder={placeholder}
        type="search"
        value={local}
      />
    </div>
  );
}
