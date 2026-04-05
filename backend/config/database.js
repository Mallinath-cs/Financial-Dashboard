import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let db = null;
let client = null;

export const connectDB = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log("✓ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("✓ MongoDB connection closed");
  }
};