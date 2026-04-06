import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { CATEGORIES, TRANSACTION_TYPES } from '../../utils/constants';
import '../../styles/TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSubmit, editingTransaction }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    category: "Food",
    type: TRANSACTION_TYPES.EXPENSE,
    description: ""
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
        description: editingTransaction.description || ""
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        category: "Food",
        type: TRANSACTION_TYPES.EXPENSE,
        description: ""
      });
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      testId="transaction-modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <div className="date-wrapper">
              <label htmlFor="date">Date</label>
              <div className="date-field">
                <input
                  type="date"
                  id="date"
                  className="date-input"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  data-testid="form-date-input"
                />
                <span className="date-icon">
                  <img src="/calendar.svg" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <div className="select-wrapper">
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
                data-testid="form-type-select"
              >
                <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
                <option value={TRANSACTION_TYPES.INCOME}>Income</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              data-testid="form-amount-input"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="select-wrapper">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
                data-testid="form-category-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              data-testid="form-description-input"
              placeholder="Add a note..."
              maxLength={25}
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            testId="form-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            testId="form-submit-btn"
          >
            {editingTransaction ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;