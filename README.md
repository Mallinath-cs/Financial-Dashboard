# Financial Dashboard

A full-stack personal finance tracker built with the **MERN stack** that helps you monitor your income, expenses, and overall financial health — all in one place.

<p align="center">
  <a href="https://financial-dashboard-hjyp.onrender.com/">Live Demo</a>
</p>

![Dashboard Preview](https://github.com/user-attachments/assets/0d7b5e9e-6488-4511-b4bb-9185ff8fe649)

---
## Features

### Dashboard Overview
- **Total Balance, Income & Expenses** — at-a-glance summary cards
- **Balance Trend Chart** — line chart showing your balance over the last 30 days
- **Spending by Category** — interactive donut chart breaking down where your money goes
- **Insights Panel** — highlights your highest spending category and period-over-period comparison
- **Dark/Light Mode** toggle
- **Role-based view** (Admin / User)

### Transactions
- View all transactions in a clean, sortable table (Date, Category, Description, Type, Amount)
- **Search** by category or description
- **Filter** by type — Income or Expense
- **Sort** by Date or Amount
- **Add** new transactions via a modal form
- **Edit** or **Delete** existing transactions
- **Export** transactions to CSV / JSON

### Spending Categories
Housing · Food · Transportation · Utilities · Shopping · Entertainment · Healthcare · Education

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Charts | Chart.js / React-Chartjs-2 |
| Animations | Framer Motion |
| Styling | CSS / Tailwind CSS |

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mallinath-cs/Financial-Dashboard.git
   cd financial-dashboard
   ```

2. **Install server dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `/server` directory:
   ```env
   MONGO_URL=your_mongo_url
   DB_NAME=your_db_name
   CORS_ORIGINS=your_localhost
   PORT=any_available ports
   NODE_ENV=development or production
   OPENAI_API_KEY=your_open_router_api_key
   ```

5. **Run the app**

   Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

   Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

---

## Screenshots

| Dashboard | Transactions |
|---|---|
| ![Dashboard](https://github.com/user-attachments/assets/0d7b5e9e-6488-4511-b4bb-9185ff8fe649) | ![Transactions](https://github.com/user-attachments/assets/93ade85e-0fa6-4986-826d-7b09b1db7ab1) |

---

## Project Structure

```
Financial_dashboard/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── build/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── components.json
│   ├── craco.config.js
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

