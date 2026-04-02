const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
let db;
let transactionsCollection;

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('✓ Connected to MongoDB');
    db = client.db(dbName);
    transactionsCollection = db.collection('transactions');
    
    // Seed initial data
    seedData();
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Seed function to add sample data
async function seedData() {
  try {
    const count = await transactionsCollection.countDocuments();
    if (count === 0) {
      console.log('Seeding initial transaction data...');
      
      const today = new Date();
      const sampleTransactions = [
        // Income transactions
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
          amount: 5000,
          category: 'Savings',
          type: 'income',
          description: 'Monthly Salary',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0],
          amount: 500,
          category: 'Other',
          type: 'income',
          description: 'Freelance Project',
          created_at: new Date().toISOString()
        },
        // Expense transactions
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0],
          amount: 1200,
          category: 'Housing',
          type: 'expense',
          description: 'Monthly Rent',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
          amount: 350,
          category: 'Food',
          type: 'expense',
          description: 'Grocery Shopping',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 8).toISOString().split('T')[0],
          amount: 180,
          category: 'Transportation',
          type: 'expense',
          description: 'Gas and Metro Card',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split('T')[0],
          amount: 120,
          category: 'Utilities',
          type: 'expense',
          description: 'Electric Bill',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 12).toISOString().split('T')[0],
          amount: 250,
          category: 'Food',
          type: 'expense',
          description: 'Restaurants',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 14).toISOString().split('T')[0],
          amount: 450,
          category: 'Shopping',
          type: 'expense',
          description: 'Clothing',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 16).toISOString().split('T')[0],
          amount: 80,
          category: 'Entertainment',
          type: 'expense',
          description: 'Movie Tickets',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 18).toISOString().split('T')[0],
          amount: 200,
          category: 'Healthcare',
          type: 'expense',
          description: 'Doctor Visit',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 20).toISOString().split('T')[0],
          amount: 150,
          category: 'Food',
          type: 'expense',
          description: 'Groceries',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 22).toISOString().split('T')[0],
          amount: 95,
          category: 'Utilities',
          type: 'expense',
          description: 'Internet Bill',
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          date: new Date(today.getFullYear(), today.getMonth(), 25).toISOString().split('T')[0],
          amount: 300,
          category: 'Education',
          type: 'expense',
          description: 'Online Course',
          created_at: new Date().toISOString()
        }
      ];
      
      await transactionsCollection.insertMany(sampleTransactions);
      console.log(`✓ Seeded ${sampleTransactions.length} sample transactions`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Financial Dashboard API' });
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await transactionsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ date: -1 })
      .toArray();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { date, amount, category, type, description } = req.body;
    
    const transaction = {
      id: uuidv4(),
      date,
      amount: parseFloat(amount),
      category,
      type,
      description: description || '',
      created_at: new Date().toISOString()
    };
    
    await transactionsCollection.insertOne(transaction);
    
    // Return without _id
    const { _id, ...returnTransaction } = transaction;
    res.status(201).json(returnTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove id from update data if present
    delete updateData.id;
    delete updateData.created_at;
    
    // Convert amount to number if present
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }
    
    const result = await transactionsCollection.updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const updated = await transactionsCollection.findOne(
      { id },
      { projection: { _id: 0 } }
    );
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await transactionsCollection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get insights
app.get('/api/insights', async (req, res) => {
  try {
    const transactions = await transactionsCollection
      .find({}, { projection: { _id: 0 } })
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
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
});