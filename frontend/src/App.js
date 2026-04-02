import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from './context/AppContext';
import { ROLES } from './utils/constants';
import apiService from './services/api';
import SummaryCards from './components/Dashboard/SummaryCards';
import Charts from './components/Dashboard/Charts';
import Insights from './components/Insights/Insights';
import TransactionFilters from './components/Transactions/TransactionFilters';
import TransactionList from './components/Transactions/TransactionList';
import TransactionModal from './components/Transactions/TransactionModal';
import EmptyState from './components/common/EmptyState';
import Button from './components/common/Button';
import './App.css';

function App() {
  const { role, setRole, transactions, insights, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddOrUpdateTransaction = async (formData) => {
    try {
      if (editingTransaction) {
        await apiService.updateTransaction(editingTransaction.id, formData);
      } else {
        await apiService.createTransaction(formData);
      }
      await refreshData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await apiService.deleteTransaction(id);
        await refreshData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
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
    <div className="app-container" data-testid="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Financial Dashboard</h1>
        <div className="role-toggle" data-testid="role-toggle">
          <label htmlFor="role-select">Role:</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            data-testid="role-select"
          >
            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
            <option value={ROLES.VIEWER}>{ROLES.VIEWER}</option>
          </select>
        </div>
      </header>

      {/* Summary Cards */}
      <SummaryCards insights={insights} />

      {/* Charts Section */}
      {isEmpty ? (
        <EmptyState
          testId="charts-empty-state"
          title="No data yet"
          description="Start by adding your first transaction to see visualizations"
          actionLabel={role === ROLES.ADMIN ? "Add First Transaction" : null}
          onAction={role === ROLES.ADMIN ? () => setShowModal(true) : null}
        />
      ) : (
        <Charts transactions={transactions} categoryData={categoryData} />
      )}

      {/* Insights Section */}
      {!isEmpty && <Insights insights={insights} />}

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h2>Transactions</h2>
          {role === ROLES.ADMIN && (
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              testId="add-transaction-btn"
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          )}
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
            testId="transactions-empty-state"
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
    </div>
  );
}

export default App;