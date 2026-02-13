import React from 'react';

export function Button({ label, onClick, variant = 'primary', disabled = false }) {
  const baseStyle = {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
    },
  };

  const style = { ...baseStyle, ...variants[variant] };

  return (
    <button style={style} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
