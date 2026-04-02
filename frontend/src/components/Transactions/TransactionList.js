import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import { ROLES } from '../../utils/constants';
import '../../styles/TransactionList.css';

const TransactionList = ({ transactions, role, onEdit, onDelete }) => {
  return (
    <table className="transactions-table" data-testid="transaction-list">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
          {role === ROLES.ADMIN && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} data-testid="transaction-item">
            <td>{new Date(transaction.date).toLocaleDateString()}</td>
            <td>{transaction.category}</td>
            <td>{transaction.description || "-"}</td>
            <td>
              <Badge type={transaction.type} testId={`badge-${transaction.type}`}>
                {transaction.type}
              </Badge>
            </td>
            <td>
              <span
                className={`amount-${transaction.type}`}
                data-testid="transaction-amount"
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </span>
            </td>
            {role === ROLES.ADMIN && (
              <td>
                <div className="action-buttons">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(transaction)}
                    data-testid="edit-transaction-btn"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-button delete"
                    onClick={() => onDelete(transaction.id)}
                    data-testid="delete-transaction-btn"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;