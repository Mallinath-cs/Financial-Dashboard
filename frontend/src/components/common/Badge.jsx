import React from 'react';
import '../../styles/Badge.css';

const Badge = ({ type, children, testId }) => {
  return (
    <span className={`badge badge-${type}`} data-testid={testId}>
      {children}
    </span>
  );
};

export default Badge;