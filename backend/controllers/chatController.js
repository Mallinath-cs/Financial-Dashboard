import { getDB } from "../config/database.js";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", 
    "X-Title": "Finance Dashboard", 
  },
});

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};

class ChatController {
  async chat(req, res) {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // ── Fetch transactions ──────────────────────────────
      const db = getDB();
      const transactions = await db
        .collection("transactions")
        .find({}, { projection: { _id: 0 } })
        .limit(10000)
        .toArray();

      // ── Financial summary ───────────────────────────────
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

      // ── Monthly comparison ──────────────────────────────
      const latestDate = transactions
        .map((t) => parseDate(t.date))
        .filter(Boolean)
        .reduce((max, d) => (d > max ? d : max), new Date(0));

      const currentMonthStart = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth(),
        1
      );
      const previousMonthStart = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth() - 1,
        1
      );
      const previousMonthEnd = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth(),
        0
      );

      const currentExpense = transactions
        .filter((t) => {
          const d = parseDate(t.date);
          return t.type === "expense" && d && d >= currentMonthStart;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const previousExpense = transactions
        .filter((t) => {
          const d = parseDate(t.date);
          return (
            t.type === "expense" &&
            d &&
            d >= previousMonthStart &&
            d <= previousMonthEnd
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      // ── System prompt ───────────────────────────────────
      const systemPrompt = `
You are a personal AI financial advisor embedded in a finance dashboard.
Use real financial data to give actionable insights.

FINANCIAL SUMMARY:
- Total Income: ₹${total_income.toLocaleString("en-IN")}
- Total Expenses: ₹${total_expense.toLocaleString("en-IN")}
- Total Balance: ₹${total_balance.toLocaleString("en-IN")}

SPENDING BY CATEGORY:
${Object.entries(categoryTotals)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString("en-IN")}`)
  .join("\n")}

MONTHLY COMPARISON:
- Current: ₹${currentExpense.toLocaleString("en-IN")}
- Previous: ₹${previousExpense.toLocaleString("en-IN")}
- Change: ₹${Math.abs(currentExpense - previousExpense).toLocaleString("en-IN")}

RECENT TRANSACTIONS:
${transactions
  .slice(-10)
  .reverse()
  .map(
    (t) =>
      `- ${t.date} | ${t.category} | ${t.description} | ${
        t.type === "income" ? "+" : "-"
      }₹${t.amount.toLocaleString("en-IN")}`
  )
  .join("\n")}
      `.trim();

      // ── Build messages ─────────────────────────────────
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: "user", content: message },
      ];

      // ── OpenAI API call ────────────────────────────────
      const response = await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages,
        max_tokens: 1000,
      });

      const reply = response.choices[0].message.content;

      res.json({ reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  }
}

export default new ChatController();