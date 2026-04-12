import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/export';
import '../../styles/Insights.css';

const Insights = ({ insights }) => {
  if (!insights || !insights.highest_spending_category) {
    return null;
  }
  
  return (
    <div className="insights-section">
      <div className="insights-grid">
        {insights.highest_spending_category && (
          <div className="insight-card">
            <h3>
              <span className='lightbulb-icon'>
              <Lightbulb size={20}/>
              </span>
              Highest Spending Category
            </h3>
            <div className="insight-value">
              {insights.highest_spending_category.category}
            </div>
            <div className="insight-description">
              {formatCurrency(insights.highest_spending_category.amount)} spent this period
            </div>
          </div>
        )}

        {insights.monthly_comparison && (
          <div className="insight-card">
            <h3>
              <span className='trendup-icon'>
                <TrendingUp size={20} />
              </span>
              Period Comparison
            </h3>
            {insights.monthly_comparison.has_previous_data ? (
              <>
                <div className="insight-value">
                  {formatCurrency(Math.abs(insights.monthly_comparison.change))}
                </div>
                <div className="insight-description">
                  {insights.monthly_comparison.change >= 0 ? "Up" : "Down"} from previous period
                </div>
              </>
            ) : (
              <div className="insight-description">
                No previous data to compare
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;