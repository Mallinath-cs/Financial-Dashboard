import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../../styles/Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ transactions, categoryData, theme }) => {
  const isDarkMode = theme === 'dark';
    const lineColor = isDarkMode ? "#EAB308" : "#0F766E";
    const bgColor = isDarkMode
      ? "rgba(234, 179, 8, 0.2)"
      : "rgba(15, 118, 110, 0.1)";
    const textColor = isDarkMode ? "#E5E7EB" : "#374151"; // light vs dark text
  const gridColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#E5E7EB";
  const getLast30DaysData = () => {
    const days = 30;
    const labels = [];
    const balanceData = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      const txnsUpToDate = transactions.filter(t => new Date(t.date) <= date);
      const balance = txnsUpToDate.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
      balanceData.push(balance);
    }

    return { labels, balanceData };
  };

  const { labels: lineLabels, balanceData } = getLast30DaysData();

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Balance Trend",
        data: balanceData,
        borderColor: lineColor,
        backgroundColor: bgColor,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          callback: (value) => `₹${value.toLocaleString('en-IN')}`
        },
        grid: {
          color: gridColor
        }
      },
      x: {
    ticks: {
      color: textColor,
      maxTicksLimit: 10
        },
        grid: {
          color: gridColor
        }
      }
    }
  };

  const doughnutChartData = {
    labels: categoryData.map(c => c.category),

    datasets: [
      {
        data: categoryData.map(c => c.amount),
        backgroundColor: [
          "#0F766E",
          "#10B981",
          "#F59E0B",
          "#6366F1",
          "#8B5CF6",
          "#EC4899",
          "#EF4444",
          "#14B8A6"
        ],
        borderWidth: 0
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: textColor,
          padding: 12,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
          }
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <div className="chart-card" data-testid="balance-trend-chart">
        <h2>Balance Trend (Last 30 Days)</h2>
        <div style={{ height: "300px" }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="chart-card" data-testid="spending-breakdown-chart">
        <h2>Spending by Category</h2>
        <div style={{ height: "300px" }}>
          {categoryData.length > 0 ? (
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          ) : (
            <div className="empty-state">
              <p>No expense data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;