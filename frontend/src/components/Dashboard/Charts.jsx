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
    const lineColor = "#000000";
    const bgColor = "rgba(128, 128, 128, 0.1)";
    const textColor = "#000000";
  const gridColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#E5E7EB";
  const getLast30DaysData = () => {
  const days = 30;
  const labels = [];
  const balanceData = [];

  const normalizeDate = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const today = normalizeDate(new Date());

  // 1. Sort transactions once
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let balance = 0;
  let index = 0;

  // 2. Loop through last 30 days
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);

    // 3. Add transactions up to this date
    while (
      index < sorted.length &&
      normalizeDate(sorted[index].date) <= currentDate
    ) {
      const t = sorted[index];
      balance += t.type === "income" ? t.amount : -t.amount;
      index++;
    }

    // 4. Push label
    labels.push(
      currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    // 5. Push balance
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
          color: "black",
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
        borderWidth: 2,
        borderColor: "black"
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
        color: "#000000",
        padding: 16,
        font: {
          size: 15,
          weight: "bold"
        },
        boxWidth: 20
      }
    },
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "#000000",
      bodyColor: "#000000",
      borderColor: "#000000",
      borderWidth: 2,
      padding: 12,
      cornerRadius: 0,
      callbacks: {
        label: (context) => {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ₹${value.toLocaleString('en-IN', {
            maximumFractionDigits: 2
          })}`;
        }
      }
    }
  }
};

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h2>Balance Trend</h2>
        <div style={{ height: "300px" }} className='balance-trend-box'>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="chart-card">
        <h2>Spending by Category</h2>
        <div style={{ height: "300px" }} className='spending-breakdown-box'>
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