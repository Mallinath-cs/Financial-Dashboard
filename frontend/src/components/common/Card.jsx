import React from 'react';
import '../../styles/Card.css';

const Card = ({ children, testId, className = '' }) => {
  return (
    <div className={`card ${className}`} data-testid={testId}>
      {children}
    </div>
  );
};

export default Card;