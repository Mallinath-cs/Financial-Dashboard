import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card.jsx';
import '../../styles/SummaryCards.css';

const SummaryCards = ({ insights }) => {
  return (
    <div className="summary-cards">
      <Card testId="summary-total-balance">
        <div className="card-header">
          <div className="card-icon balance">
            <DollarSign size={20} />
          </div>
          <div className="card-label">Total Balance</div>
        </div>
        <div className="card-value">
          ${insights?.total_balance?.toFixed(2) || "0.00"}
        </div>
      </Card>

      <Card testId="summary-total-income">
        <div className="card-header">
          <div className="card-icon income">
            <TrendingUp size={20} />
          </div>
          <div className="card-label">Total Income</div>
        </div>
        <div className="card-value">
          ${insights?.total_income?.toFixed(2) || "0.00"}
        </div>
      </Card>

      <Card testId="summary-total-expense">
        <div className="card-header">
          <div className="card-icon expense">
            <TrendingDown size={20} />
          </div>
          <div className="card-label">Total Expenses</div>
        </div>
        <div className="card-value">
          ${insights?.total_expense?.toFixed(2) || "0.00"}
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;