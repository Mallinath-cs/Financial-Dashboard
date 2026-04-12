import React from 'react';
import '../../styles/Badge.css';

const Badge = ({ type, children, testId }) => {
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
};

export default Badge;