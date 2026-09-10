// ─────────────────────────────────────────────────────────────
// PLACEHOLDER THUMB  (used when text designs are loading / empty)
// ─────────────────────────────────────────────────────────────

export function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 140,
        height: 140,
        borderRadius: 10,
        background: 'color-mix(in srgb, var(--de-color-text) 4%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        color: 'var(--de-color-text-muted)',
      }}
    >
      {label}
    </div>
  );
}
