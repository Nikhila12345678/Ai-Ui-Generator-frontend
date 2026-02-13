import React from 'react';

export function Card({ children, title, padding = 'medium' }) {
  const paddingValues = {
    small: '12px',
    medium: '20px',
    large: '32px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: paddingValues[padding],
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1f2937',
  };

  return (
    <div style={cardStyle}>
      {title && <div style={titleStyle}>{title}</div>}
      {children}
    </div>
  );
}