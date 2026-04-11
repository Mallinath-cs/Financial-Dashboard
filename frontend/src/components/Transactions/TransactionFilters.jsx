import React, { useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);

  const options = [
    { label: "All Types", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" }
  ];
  const options1 = [
    { label: "Sort by Date", value: "date" },
    { label: "Sort by Amount", value: "amount" }
  ];
  const selected = options.find(opt => opt.value === filterType);
  const selected1 = options1.find(opt => opt.value === sortBy);

  // close on outside click
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      dropdownRef1.current &&
      !dropdownRef1.current.contains(e.target)
    ) {
      setOpen(false);
      setOpen1(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  return (
    <div className="filters-bar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by category or description"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          data-testid="search-input"
        />
      </div>
      <div className="neo-dropdown" ref={dropdownRef}>
      <div
        className="neo-dropdown-header"
        onClick={() => {
          setOpen(!open);
          setOpen1(false);
        }}
      >
        {selected?.label}
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="neo-dropdown-list">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`neo-dropdown-item ${
                filterType === opt.value ? "active" : ""
              }`}
              onClick={() => {
                onFilterTypeChange(opt.value);
                setOpen(false);
                setOpen1(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
      <div className="neo-dropdown" ref={dropdownRef1}>
      <div
        className="neo-dropdown-header"
        onClick={() => {
          setOpen1(!open1);
          setOpen(false);
        }}
      >
        {selected1?.label}
        <span className={`arrow ${open1 ? "open" : ""}`}>▾</span>
      </div>

      {open1 && (
        <div className="neo-dropdown-list">
          {options1.map((opt) => (
            <div
              key={opt.value}
              className={`neo-dropdown-item ${
                sortBy === opt.value ? "active" : ""
              }`}
              onClick={() => {
                onSortByChange(opt.value);
                setOpen1(false);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default TransactionFilters;