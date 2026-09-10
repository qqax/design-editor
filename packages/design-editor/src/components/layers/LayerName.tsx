'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LayerNameProps {
  id: string;
  name: string;
  visible: boolean;
  isActive: boolean;
  editing: boolean;
  onCommit: (id: string, name: string) => void;
  onCancel: () => void;
}

export function LayerName({
  id,
  name,
  visible,
  isActive,
  editing,
  onCommit,
  onCancel,
}: LayerNameProps) {
  const [val, setVal] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal(name);
  }, [name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = val.trim();
    if (trimmed && trimmed !== name) onCommit(id, trimmed);
    else onCancel();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        onBlur={commit}
        onChange={(e) => setVal(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        value={val}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape') {
            setVal(name);
            onCancel();
          }
        }}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'var(--de-color-bg)',
          border: '1px solid var(--de-color-primary)',
          borderRadius: 4,
          color: 'var(--de-color-text)',
          fontSize: 11,
          padding: '2px 6px',
          outline: 'none',
        }}
      />
    );
  }

  return (
    <span
      style={{
        flex: 1,
        minWidth: 0,
        fontSize: 11,
        color: isActive ? 'var(--de-color-text)' : 'var(--de-color-text-muted)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        opacity: visible ? 1 : 0.45,
      }}
    >
      {name}
    </span>
  );
}
