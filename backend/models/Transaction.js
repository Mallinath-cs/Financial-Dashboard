const { v4: uuidv4 } = require('uuid');

class Transaction {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.date = data.date;
    this.amount = parseFloat(data.amount);
    this.category = data.category;
    this.type = data.type;
    this.description = data.description || '';
    this.created_at = data.created_at || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    
    if (!data.date) errors.push('Date is required');
    if (!data.amount || isNaN(data.amount)) errors.push('Valid amount is required');
    if (!data.category) errors.push('Category is required');
    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Type must be either income or expense');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      amount: this.amount,
      category: this.category,
      type: this.type,
      description: this.description,
      created_at: this.created_at
    };
  }
}

module.exports = Transaction;