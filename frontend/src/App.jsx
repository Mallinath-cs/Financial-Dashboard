import React, { useState, useRef, useEffect  } from 'react';
import { Plus, Moon, Sun, Download } from 'lucide-react';
import { useApp } from './context/AppContext';
import { ROLES } from './utils/constants';
import { exportToCSV, exportToJSON } from './utils/export';
import apiService from './services/api';
import SummaryCards from './components/Dashboard/SummaryCards.jsx';
import Charts from './components/Dashboard/Charts.jsx';
import Insights from './components/Insights/Insights.jsx';
import TransactionFilters from './components/Transactions/TransactionFilters.jsx';
import TransactionList from './components/Transactions/TransactionList.jsx';
import TransactionModal from './components/Transactions/TransactionModal.jsx';
import EmptyState from './components/common/EmptyState.jsx';
import Button from './components/common/Button.jsx';
import ChatBot from '../src/components/chatBot/chatBot.jsx'
import './App.css';

function App() {
  const { role, setRole, transactions, insights, refreshData, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const dropdownRef = useRef(null);
  const options = ["Admin", "Viewer"];

  const exportRef = useRef(null); 
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    initFetch();
  }, []);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (exportRef.current && !exportRef.current.contains(event.target)) {
      setShowExportMenu(false);
    }
  };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleAddOrUpdateTransaction = async (formData) => {
    try {
      setIsLoading(true);
      if (editingTransaction) {
        await apiService.updateTransaction(editingTransaction.id, formData);
      } else {
        await apiService.createTransaction(formData);
      }
      await refreshData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        setIsLoading(true);
        await apiService.deleteTransaction(id);
        await refreshData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleExport = (format) => {
    if (format === 'csv') {
      exportToCSV(filteredTransactions);
    } else if (format === 'json') {
      exportToJSON(filteredTransactions);
    }
    setShowExportMenu(false);
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(t => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          t.category.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return 0;
    });

  const isEmpty = transactions.length === 0;
  const categoryData = insights?.category_breakdown || [];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-icon-container">
          <img src="./coin_icon.png" alt="" />
          <h1>Finora AI</h1>
        </div>
        <div className="header-right">
          <a href="https://github.com/Mallinath-cs/Finora-AI" target='_blank' rel='noopener' className='github-link'>
            <div className="github-container">
              <img src='./github_icon.png'/>
            </div>
          </a>
        <div className="dropdown" ref={dropdownRef}>
        <div
          className="dropdown-header"
          onClick={() => setOpen(!open)}
        >
          {role}
          <span className={`arrow ${open ? "open" : ""}`}>▾</span>
        </div>

        {open && (
          <div className="dropdown-list">
            {options.map((opt) => (
              <div
                key={opt}
                className="dropdown-item"
                onClick={() => {
                  setRole(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </header>

      {/* Summary Cards */}
      <SummaryCards insights={insights} />

      {/* Charts Section */}
      {isLoading ? (
        <Charts 
          transactions={[]} 
          categoryData={[]} 
          theme={theme} 
          isLoading={true} 
        />
      ) : isEmpty ? (
        <EmptyState
          title="No data yet"
          description="Start by adding your first transaction to see visualizations"
          actionLabel={role === ROLES.ADMIN ? "Add First Transaction" : null}
          onAction={role === ROLES.ADMIN ? () => setShowModal(true) : null}
        />
      ) : (
        <Charts 
          transactions={transactions} 
          categoryData={categoryData} 
          theme={theme} 
          isLoading={false} 
        />
      )}

      {/* Insights Section */}
      {!isEmpty && <Insights insights={insights} />}

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h2>Transactions</h2>
          <div className="header-actions">
            {!isEmpty && (
              <div className="export-menu" ref={exportRef}>
            <button
              className="export-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} />
              <span>Export</span>
              <span className={`arrow ${showExportMenu ? "open" : ""}`}>▾</span>
            </button>

            {showExportMenu && (
              <div className="export-dropdown">
                <button onClick={() => handleExport("csv")}>
                  Export as CSV
                </button>
                <button onClick={() => handleExport("json")}>
                  Export as JSON
                </button>
              </div>
            )}
          </div>
            )}
            {role === ROLES.ADMIN && (
              <button
                className="neo-btn primary"
                onClick={() => setShowModal(true)}
              >
                <Plus size={25} />
                <span className='add-transaction-text'>Add</span>
              </button>
            )}
          </div>
        </div>

        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {isEmpty ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to start tracking your finances"
            actionLabel={role === ROLES.ADMIN ? "Add Transaction" : null}
            onAction={role === ROLES.ADMIN ? () => setShowModal(true) : null}
          />
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            role={role}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
      </div>
      {/* Add/Edit Transaction Modal */}
      {role === ROLES.ADMIN && (
        <TransactionModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleAddOrUpdateTransaction}
          editingTransaction={editingTransaction}
        />
      )}
      <ChatBot />
    </div>
  );
}

export default App;
