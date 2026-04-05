# 💰 Financial Dashboard

A full-stack personal finance tracker built with the **MERN stack** that helps you monitor your income, expenses, and overall financial health — all in one place.

![Dashboard Preview](./screenshots/dashboard.png)

---

## ✨ Features

### 📊 Dashboard Overview
- **Total Balance, Income & Expenses** — at-a-glance summary cards
- **Balance Trend Chart** — line chart showing your balance over the last 30 days
- **Spending by Category** — interactive donut chart breaking down where your money goes
- **Insights Panel** — highlights your highest spending category and period-over-period comparison
- **Dark/Light Mode** toggle
- **Role-based view** (Admin / User)

### 💳 Transactions
- View all transactions in a clean, sortable table (Date, Category, Description, Type, Amount)
- **Search** by category or description
- **Filter** by type — Income or Expense
- **Sort** by Date or Amount
- **Add** new transactions via a modal form
- **Edit** or **Delete** existing transactions
- **Export** transactions to CSV

### 📁 Spending Categories
Housing · Food · Transportation · Utilities · Shopping · Entertainment · Healthcare · Education

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Charts | Chart.js / React-Chartjs-2 |
| Animations | Framer Motion |
| Styling | CSS / Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/financial-dashboard.git
   cd financial-dashboard
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the app**

   Start the backend:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend:
   ```bash
   cd client
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots

| Dashboard | Transactions |
|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Transactions](./screenshots/transactions.png) |

---

## 📂 Project Structure

```
financial-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard, Transactions pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── middleware/         # Auth & error middleware
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/dashboard/summary` | Get balance, income & expense totals |
| GET | `/api/dashboard/trend` | Get balance trend data |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

> Built with ❤️ using the MERN Stack
