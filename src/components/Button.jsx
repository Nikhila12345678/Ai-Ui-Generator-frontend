import React from 'react';

export default function Button({ label, onClick, variant = 'primary', disabled = false }) {
  const styles = {
    base: {
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
    },
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
    },
  };

  const buttonStyle = {
    ...styles.base,
    ...(variant === 'primary' ? styles.primary : styles.secondary),
  };

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      {label || 'Button'}
    </button>
  );
}