import React from 'react';

export const DevelopmentBadge: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 24,
      left: 24,
      background: 'rgba(20, 20, 20, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      borderRadius: '24px',
      padding: '6px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 50,
      pointerEvents: 'none',
    }}
  >
    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 10px #a855f7' }} />
    <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
      In Development
    </span>
  </div>
);
