import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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

// Added isLoading to props
const Charts = ({ transactions = [], categoryData = [], theme, isLoading }) => {
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
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    let balance = 0;
    let index = 0;

    for (let i = days - 1; i >= 0; i--) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - i);

      while (index < sorted.length && normalizeDate(sorted[index].date) <= currentDate) {
        const t = sorted[index];
        balance += t.type === "income" ? t.amount : -t.amount;
        index++;
      }
      labels.push(currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      balanceData.push(balance);
    }
    return { labels, balanceData };
  };

  const { labels: lineLabels, balanceData } = getLast30DaysData();

  const lineChartData = {
    labels: lineLabels,
    datasets: [{
      label: "Balance Trend",
      data: balanceData,
      borderColor: lineColor,
      backgroundColor: bgColor,
      fill: true,
      tension: 0.4
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "black", callback: (v) => `₹${v.toLocaleString('en-IN')}` }, grid: { color: gridColor } },
      x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } }
    }
  };

  const doughnutChartData = {
    labels: categoryData.map(c => c.category),
    datasets: [{
      data: categoryData.map(c => c.amount),
      backgroundColor: ["#0F766E", "#10B981", "#F59E0B", "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#14B8A6"],
      borderWidth: 2,
      borderColor: "black"
    }]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { color: "#000000", font: { size: 14, weight: "bold" } } },
      tooltip: {
        backgroundColor: "#ffffff", titleColor: "#000000", bodyColor: "#000000", borderColor: "#000000", borderWidth: 2,
        callbacks: { label: (ctx) => `${ctx.label}: ₹${ctx.parsed.toLocaleString('en-IN')}` }
      }
    }
  };

  return (
    <div className="charts-container">
      {/* Balance Trend Card */}
      <div className="chart-card">
        <h2>Balance Trend</h2>
        <div style={{ height: "300px" }} className='balance-trend-box'>
          {isLoading ? (
            <Skeleton height="100%" width="100%" />
          ) : (
            <Line data={lineChartData} options={lineChartOptions} />
          )}
        </div>
      </div>

      {/* Spending Category Card */}
      <div className="chart-card">
        <h2>Spending by Category</h2>
        <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }} className='spending-breakdown-box'>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton circle height={200} width={200} />
              <div style={{ marginTop: '10px' }}>
                <Skeleton width={100} />
              </div>
            </div>
          ) : categoryData.length > 0 ? (
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
