import React from 'react';
import { X } from 'lucide-react';
import '../../styles/Modal.css';

const Modal = ({ isOpen, onClose, title, children, testId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;