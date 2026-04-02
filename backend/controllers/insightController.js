const { getDB } = require('../config/database');

class InsightController {
  async getInsights(req, res) {
    try {
      const db = getDB();
      const transactions = await db.collection('transactions')
        .find({}, { projection: { _id: 0 } })
        .limit(10000)
        .toArray();

      if (transactions.length === 0) {
        return res.json({
          total_balance: 0,
          total_income: 0,
          total_expense: 0,
          highest_spending_category: null,
          monthly_comparison: null,
          category_breakdown: []
        });
      }

      // Calculate totals
      const total_income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const total_balance = total_income - total_expense;

      // Category breakdown for expenses
      const categoryTotals = {};
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });

      const category_breakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));

      // Highest spending category
      let highest_spending_category = null;
      if (category_breakdown.length > 0) {
        const highest = category_breakdown.reduce((max, cat) =>
          cat.amount > max.amount ? cat : max
        );
        highest_spending_category = highest;
      }

      // Monthly comparison
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const currentMonthTxns = transactions.filter(t =>
        new Date(t.date) >= currentMonthStart
      );

      const previousMonthTxns = transactions.filter(t =>
        new Date(t.date) < currentMonthStart
      );

      const current_balance = currentMonthTxns.reduce((sum, t) =>
        sum + (t.type === 'income' ? t.amount : -t.amount), 0
      );

      const previous_balance = previousMonthTxns.reduce((sum, t) =>
        sum + (t.type === 'income' ? t.amount : -t.amount), 0
      );

      const monthly_comparison = {
        current_period: current_balance,
        previous_period: previous_balance,
        change: current_balance - previous_balance
      };

      res.json({
        total_balance,
        total_income,
        total_expense,
        highest_spending_category,
        monthly_comparison,
        category_breakdown
      });
    } catch (error) {
      console.error('Error calculating insights:', error);
      res.status(500).json({ error: 'Failed to calculate insights' });
    }
  }
}

module.exports = new InsightController();