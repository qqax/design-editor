'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LayerNameProps {
  id: string;
  name: string;
  editing: boolean;
  onCommit: (id: string, name: string) => void;
  onCancel: () => void;
}

export function LayerName({
  id,
  name,
  editing,
  onCommit,
  onCancel,
}: LayerNameProps) {
  const [val, setVal] = useState(name);
  const [prevName, setPrevName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  if (prevName !== name) {
    setPrevName(name);
    setVal(name);
  }

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
        aria-label={name}
        className="de-layer-rename"
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
      />
    );
  }

  return <span className="de-layer-name">{name}</span>;
}
