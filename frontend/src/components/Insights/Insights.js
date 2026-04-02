import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import '../../styles/Insights.css';

const Insights = ({ insights }) => {
  if (!insights || !insights.highest_spending_category) {
    return null;
  }

  return (
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
  );
};

export default Insights;