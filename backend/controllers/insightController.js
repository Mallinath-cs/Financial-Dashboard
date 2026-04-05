import { getDB } from "../config/database.js";

// Helper to parse DD/MM/YYYY or ISO date strings
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};

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

      // ── Total income & expense ──────────────────────────────────────
      const total_income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const total_balance = total_income - total_expense;

      // ── Category breakdown ──────────────────────────────────────────
      const categoryTotals = {};
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + t.amount;
        });

      const category_breakdown = Object.entries(categoryTotals).map(
        ([category, amount]) => ({ category, amount })
      );

      // ── Highest spending category ───────────────────────────────────
      let highest_spending_category = null;
      if (category_breakdown.length > 0) {
        highest_spending_category = category_breakdown.reduce((max, cat) =>
          cat.amount > max.amount ? cat : max
        );
      }

      // ── Monthly comparison (current vs previous month) ──────────────
      const now = new Date();

      // ── Derive current period from latest transaction date ──────────
      const latestDate = transactions
        .map((t) => parseDate(t.date))
        .filter(Boolean)
        .reduce((max, d) => (d > max ? d : max), new Date(0));

      const currentMonthStart  = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
      const previousMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1);
      const previousMonthEnd   = new Date(latestDate.getFullYear(), latestDate.getMonth(), 0);

      const currentMonthTxns = transactions.filter((t) => {
        const date = parseDate(t.date);
        return date && date >= currentMonthStart;
      });

      const previousMonthTxns = transactions.filter((t) => {
        const date = parseDate(t.date);
        return date && date >= previousMonthStart && date <= previousMonthEnd;
      });

      const current_expense = currentMonthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const previous_expense = previousMonthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthly_comparison = {
        current_period:  current_expense,
        previous_period: previous_expense,
        change:          current_expense - previous_expense,  // +ve = up, -ve = down
        has_previous_data: previous_expense > 0,
      };

      // ── Response ────────────────────────────────────────────────────
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
      res.status(500).json({ error: "Failed to calculate insights" });
    }
  }
}

export default new InsightController();