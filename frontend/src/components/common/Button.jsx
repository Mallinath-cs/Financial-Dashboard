import React from 'react';
import '../../styles/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false,
  testId,
  className = ''
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  );
};

export default Button;