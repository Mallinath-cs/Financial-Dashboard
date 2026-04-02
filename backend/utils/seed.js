const { v4: uuidv4 } = require('uuid');

const getSeedData = () => {
  const today = new Date();
  
  return [
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
};

const seedDatabase = async (db) => {
  try {
    const collection = db.collection('transactions');
    const count = await collection.countDocuments();
    
    if (count === 0) {
      console.log('Seeding initial transaction data...');
      const sampleTransactions = getSeedData();
      await collection.insertMany(sampleTransactions);
      console.log(`✓ Seeded ${sampleTransactions.length} sample transactions`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedDatabase };