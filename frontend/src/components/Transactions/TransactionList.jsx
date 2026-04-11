import React, { useEffect, useRef, useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { ROLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/export';
import '../../styles/TransactionList.css';

const ITEMS_PER_PAGE_OPTIONS = [6, 10, 25];

const TransactionList = ({ transactions, role, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);  
  const [open2, setOpen2] = useState(false);
  const dropdownRef2 = useRef(null);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const options2 = ITEMS_PER_PAGE_OPTIONS.map((n) => ({
    label: n.toString(),
    value: n
  }));
  const selected2 = options2.find(opt => opt.value === itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = transactions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(e.target)
      ) {
        setOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getPageRange = () => {
    const delta = 1; // siblings on each side
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (last) {
        if (i - last === 2) rangeWithDots.push(last + 1);
        else if (i - last > 2) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="transaction-list-wrapper">
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
          {paginated.map((transaction) => (
            <tr key={transaction.id} data-testid="transaction-item">
              <td data-label="Date">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td data-label="Category">{transaction.category}</td>
              <td data-label="Description">
                {transaction.description || '-'}
              </td>
              <td data-label="Type">
                <Badge type={transaction.type} testId={`badge-${transaction.type}`}>
                  {transaction.type}
                </Badge>
              </td>
              <td data-label="Amount">
                <span
                  className={`amount-${transaction.type}`}
                  data-testid="transaction-amount"
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              {role === ROLES.ADMIN && (
                <td data-label="Actions">
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
          {Array.from({ length: itemsPerPage - paginated.length }).map((_, idx) => (
            <tr key={`filler-${idx}`} className="filler-row">
              <td colSpan={role === ROLES.ADMIN ? 6 : 5}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Pagination bar ── */}
      <div className="pagination-bar">
        <div className="pagination-meta">
          <span>
            {transactions.length === 0
              ? 'No transactions'
              : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, transactions.length)} of ${transactions.length}`}
          </span>
          {transactions.length > 0 && ( <>
          <div className="">Rows:</div>
          <div className="neo-dropdown1" ref={dropdownRef2}>
            <div
              className="neo-dropdown-header1"
              onClick={() => setOpen2(!open2)}
            >
              {selected2?.label}
              <span className={`arrow1 ${open2 ? "open" : ""}`}>▴</span>
            </div>

            {open2 && (
              <div className="neo-dropdown-list1">
                {options2.map((opt) => (
                  <div
                    key={opt.value}
                    className={`neo-dropdown-item1 ${
                      itemsPerPage === opt.value ? "active" : ""
                    }`}
                    onClick={() => {
                      handleItemsPerPageChange({ target: { value: opt.value } });
                      setOpen2(false);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}
        </div>

        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageRange().map((page, idx) =>
            page === '...' ? (
              <span key={`dots-${idx}`} className="page-dots">…</span>
            ) : (
              <button
                key={page}
                className={`page-btn${page === currentPage ? ' active' : ''}`}
                onClick={() => goToPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;