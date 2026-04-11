import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { ROLES } from '../utils/constants';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.ADMIN);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  const fetchTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions');
    }
  };

  const fetchInsights = async () => {
    try {
      const data = await apiService.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights');
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchTransactions(), fetchInsights()]);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    initializeData();
  }, []);

  const value = {
    role,
    setRole,
    transactions,
    insights,
    loading,
    refreshData,
    theme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};