import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/database.js";
import { seedDatabase } from "./utils/seed.js";
import transactionRoutes from "./routes/transactions.js";
import insightRoutes from "./routes/insights.js";

const app = express();
const PORT = process.env.PORT || 8001;

// __dirname for ES Modules
const __dirname = path.resolve();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGINS || "*",
  credentials: true
}));

app.use(express.json());

// ✅ API routes FIRST
app.get("/api", (req, res) => {
  res.json({ message: "Financial Dashboard API" });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/insights", insightRoutes);

// ✅ Serve frontend (after API)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Catch-all (ONLY ONE, always last)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
const startServer = async () => {
  try {
    const db = await connectDB();
    if (process.env.NODE_ENV === "development") {
    await seedDatabase(db);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();