const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let db = null;
let client = null;

const connectDB = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log('✓ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('✓ MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };