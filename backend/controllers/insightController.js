import { getDB } from "../config/database.js";

class InsightController {
  async getInsights(req, res) {
    try {
      const db = getDB();
      const transactions = await db
        .collection("transactions")
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
          category_breakdown: [],
        });
      }

      const total_income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const total_balance = total_income - total_expense;

      const categoryTotals = {};
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + t.amount;
        });

      const category_breakdown = Object.entries(categoryTotals).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );

      let highest_spending_category = null;
      if (category_breakdown.length > 0) {
        const highest = category_breakdown.reduce((max, cat) =>
          cat.amount > max.amount ? cat : max
        );
        highest_spending_category = highest;
      }

      const now = new Date();
      const currentMonthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const currentMonthTxns = transactions.filter(
        (t) => new Date(t.date) >= currentMonthStart
      );

      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const previousMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

      const previousMonthTxns = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= previousMonthStart && date <= previousMonthEnd;
      });

      const current_expense = currentMonthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const previous_expense = previousMonthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const has_previous_data = previous_expense > 0;

      const monthly_comparison = {
        current_period: current_expense,
        previous_period: previous_expense,
        change: current_expense - previous_expense,
        has_previous_data,
      };

      res.json({
        total_balance,
        total_income,
        total_expense,
        highest_spending_category,
        monthly_comparison,
        category_breakdown,
      });
    } catch (error) {
      console.error("Error calculating insights:", error);
      res
        .status(500)
        .json({ error: "Failed to calculate insights" });
    }
  }
}

export default new InsightController();