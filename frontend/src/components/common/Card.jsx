import React from 'react';
import '../../styles/Card.css';

const Card = ({ children, testId, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export default Card;