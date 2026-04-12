import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button.jsx';
import '../../styles/EmptyState.css';

const EmptyState = ({ title, description, actionLabel, onAction, testId }) => {
  return (
    <div className="empty-state">
      <Inbox className="empty-state-icon" size={64} strokeWidth={1.5} />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;