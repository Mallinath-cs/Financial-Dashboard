const { getDB } = require('../config/database');
const Transaction = require('../models/Transaction');

class TransactionController {
  async getAll(req, res) {
    try {
      const db = getDB();
      const transactions = await db.collection('transactions')
        .find({}, { projection: { _id: 0 } })
        .sort({ date: -1 })
        .limit(1000)
        .toArray();
      
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  async create(req, res) {
    try {
      const validation = Transaction.validate(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const transaction = new Transaction(req.body);
      const db = getDB();
      
      await db.collection('transactions').insertOne(transaction.toJSON());
      
      res.status(201).json(transaction.toJSON());
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      delete updateData.id;
      delete updateData.created_at;
      
      if (updateData.amount) {
        updateData.amount = parseFloat(updateData.amount);
      }

      const db = getDB();
      const result = await db.collection('transactions').updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const updated = await db.collection('transactions').findOne(
        { id },
        { projection: { _id: 0 } }
      );

      res.json(updated);
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();
      
      const result = await db.collection('transactions').deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  }
}

module.exports = new TransactionController();