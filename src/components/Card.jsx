import React from 'react';

export default function Card({ children, title, padding = 'medium' }) {
  const paddingValues = {
    small: '12px',
    medium: '24px',
    large: '32px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: paddingValues[padding] || paddingValues.medium,
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#111827',
  };

  return (
    <div style={cardStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {children}
    </div>
  );
}