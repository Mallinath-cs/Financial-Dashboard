import React from 'react';
import { Search } from 'lucide-react';
import '../../styles/TransactionFilters.css';

const TransactionFilters = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  sortBy,
  onSortByChange
}) => {
  return (
    <div className="filters-bar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by category or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          data-testid="search-input"
        />
      </div>
      <select
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        data-testid="filter-type-select"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        data-testid="sort-select"
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>
    </div>
  );
};

export default TransactionFilters;