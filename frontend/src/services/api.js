import axios from 'axios';

const API = "/api";

class ApiService {
  async getTransactions() {
    try {
      const response = await axios.get(`${API}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async createTransaction(data) {
    try {
      const response = await axios.post(`${API}/transactions`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id, data) {
    try {
      const response = await axios.put(`${API}/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      const response = await axios.delete(`${API}/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getInsights() {
    try {
      const response = await axios.get(`${API}/insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }
}

export default new ApiService();