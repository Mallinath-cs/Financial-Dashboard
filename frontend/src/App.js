import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Inbox,
  Lightbulb
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Savings",
  "Other"
];

function App() {
  const [role, setRole] = useState("Admin");
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    category: "Food",
    type: "expense",
    description: ""
  });

  useEffect(() => {
    fetchTransactions();
    fetchInsights();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API}/insights`);
      setInsights(response.data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await axios.put(`${API}/transactions/${editingTransaction.id}`, formData);
      } else {
        await axios.post(`${API}/transactions`, formData);
      }
      fetchTransactions();
      fetchInsights();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`${API}/transactions/${id}`);
        fetchTransactions();
        fetchInsights();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      description: transaction.description || ""
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: "",
      category: "Food",
      type: "expense",
      description: ""
    });
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

  // Prepare chart data
  const getLast30DaysData = () => {
    const days = 30;
    const labels = [];
    const balanceData = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Calculate cumulative balance up to this date
      const txnsUpToDate = transactions.filter(t => new Date(t.date) <= date);
      const balance = txnsUpToDate.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
      balanceData.push(balance);
    }
    
    return { labels, balanceData };
  };

  const { labels: lineLabels, balanceData } = getLast30DaysData();

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Balance Trend",
        data: balanceData,
        borderColor: "#0F766E",
        backgroundColor: "rgba(15, 118, 110, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toFixed(0)}`
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 10
        }
      }
    }
  };

  const categoryData = insights?.category_breakdown || [];
  const doughnutChartData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c.amount),
        backgroundColor: [
          "#0F766E",
          "#10B981",
          "#F59E0B",
          "#6366F1",
          "#8B5CF6",
          "#EC4899",
          "#EF4444",
          "#14B8A6"
        ],
        borderWidth: 0
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 12,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  const isEmpty = transactions.length === 0;

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
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card" data-testid="summary-total-balance">
          <div className="card-header">
            <div className="card-icon balance">
              <DollarSign size={20} />
            </div>
            <div className="card-label">Total Balance</div>
          </div>
          <div className="card-value">
            ${insights?.total_balance?.toFixed(2) || "0.00"}
          </div>
        </div>

        <div className="card" data-testid="summary-total-income">
          <div className="card-header">
            <div className="card-icon income">
              <TrendingUp size={20} />
            </div>
            <div className="card-label">Total Income</div>
          </div>
          <div className="card-value">
            ${insights?.total_income?.toFixed(2) || "0.00"}
          </div>
        </div>

        <div className="card" data-testid="summary-total-expense">
          <div className="card-header">
            <div className="card-icon expense">
              <TrendingDown size={20} />
            </div>
            <div className="card-label">Total Expenses</div>
          </div>
          <div className="card-value">
            ${insights?.total_expense?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {isEmpty ? (
        <div className="empty-state" data-testid="charts-empty-state">
          <Inbox className="empty-state-icon" size={64} strokeWidth={1.5} />
          <h3>No data yet</h3>
          <p>Start by adding your first transaction to see visualizations</p>
          {role === "Admin" && (
            <button
              className="button button-primary"
              onClick={() => setShowModal(true)}
              data-testid="empty-add-transaction-btn"
            >
              <Plus size={16} />
              Add First Transaction
            </button>
          )}
        </div>
      ) : (
        <div className="charts-container">
          <div className="chart-card" data-testid="balance-trend-chart">
            <h2>Balance Trend (Last 30 Days)</h2>
            <div style={{ height: "300px" }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="chart-card" data-testid="spending-breakdown-chart">
            <h2>Spending by Category</h2>
            <div style={{ height: "300px" }}>
              {categoryData.length > 0 ? (
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              ) : (
                <div className="empty-state">
                  <p>No expense data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Insights Section */}
      {!isEmpty && insights && (
        <div className="insights-section" data-testid="insights-section">
          <h2>Insights</h2>
          <div className="insights-grid">
            {insights.highest_spending_category && (
              <div className="insight-card" data-testid="insight-highest-spending">
                <h3>
                  <Lightbulb size={20} />
                  Highest Spending Category
                </h3>
                <div className="insight-value">
                  {insights.highest_spending_category.category}
                </div>
                <div className="insight-description">
                  ${insights.highest_spending_category.amount.toFixed(2)} spent this period
                </div>
              </div>
            )}

            {insights.monthly_comparison && (
              <div className="insight-card" data-testid="insight-monthly-comparison">
                <h3>
                  <TrendingUp size={20} />
                  Period Comparison
                </h3>
                <div className="insight-value">
                  ${Math.abs(insights.monthly_comparison.change).toFixed(2)}
                </div>
                <div className="insight-description">
                  {insights.monthly_comparison.change >= 0 ? "Up" : "Down"} from previous period
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h2>Transactions</h2>
          {role === "Admin" && (
            <button
              className="button button-primary"
              onClick={() => setShowModal(true)}
              data-testid="add-transaction-btn"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>

        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            data-testid="filter-type-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            data-testid="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {isEmpty ? (
          <div className="empty-state" data-testid="transactions-empty-state">
            <Inbox className="empty-state-icon" size={64} strokeWidth={1.5} />
            <h3>No transactions yet</h3>
            <p>Add your first transaction to start tracking your finances</p>
            {role === "Admin" && (
              <button
                className="button button-primary"
                onClick={() => setShowModal(true)}
                data-testid="empty-add-transaction-btn-2"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            )}
          </div>
        ) : (
          <table className="transactions-table" data-testid="transaction-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                {role === "Admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} data-testid="transaction-item">
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description || "-"}</td>
                  <td>
                    <span
                      className={`badge badge-${transaction.type}`}
                      data-testid={`badge-${transaction.type}`}
                    >
                      {transaction.type}
                    </span>
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
                  {role === "Admin" && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() => handleEditTransaction(transaction)}
                          data-testid="edit-transaction-btn"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="icon-button delete"
                          onClick={() => handleDeleteTransaction(transaction.id)}
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
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {showModal && role === "Admin" && (
        <div className="modal-overlay" onClick={handleCloseModal} data-testid="transaction-modal">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
              <button
                className="modal-close"
                onClick={handleCloseModal}
                data-testid="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    data-testid="form-date-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    data-testid="form-type-select"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    data-testid="form-amount-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                <div className="form-group">
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    data-testid="form-description-input"
                    placeholder="Add a note..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCloseModal}
                  data-testid="form-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  data-testid="form-submit-btn"
                >
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;