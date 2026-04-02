# Financial Dashboard - Project Structure

## Overview
A professional MERN stack financial dashboard with industry-standard folder structure following separation of concerns and best practices.

## Technology Stack
- **Frontend**: React.js, Chart.js, Lucide React Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, MongoDB (native driver)
- **State Management**: React Context API

---

## Backend Structure (`/app/backend/`)

```
/app/backend/
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
│
├── /config                      # Configuration files
│   └── database.js              # MongoDB connection setup
│
├── /models                      # Data models
│   └── Transaction.js           # Transaction model with validation
│
├── /controllers                 # Business logic layer
│   ├── transactionController.js # Transaction CRUD operations
│   └── insightController.js     # Analytics and insights calculations
│
├── /routes                      # API route definitions
│   ├── transactions.js          # Transaction endpoints
│   └── insights.js              # Insights endpoints
│
└── /utils                       # Utility functions
    └── seed.js                  # Database seeding logic
```

### Backend Architecture Details

**Config Layer** (`/config`)
- Handles database connections
- Provides singleton DB instance
- Manages connection lifecycle

**Models Layer** (`/models`)
- Transaction model with validation
- Data structure definitions
- Business rules enforcement

**Controllers Layer** (`/controllers`)
- Business logic implementation
- Request/response handling
- Error management
- **Transaction Controller**: CRUD operations (Create, Read, Update, Delete)
- **Insight Controller**: Calculates analytics (totals, categories, comparisons)

**Routes Layer** (`/routes`)
- HTTP endpoint definitions
- Route-to-controller mapping
- RESTful API structure

**Utils Layer** (`/utils`)
- Helper functions
- Database seeding
- Reusable utilities

### API Endpoints

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| GET    | `/api/transactions`    | Get all transactions       |
| POST   | `/api/transactions`    | Create new transaction     |
| PUT    | `/api/transactions/:id`| Update transaction         |
| DELETE | `/api/transactions/:id`| Delete transaction         |
| GET    | `/api/insights`        | Get financial insights     |

---

## Frontend Structure (`/app/frontend/src/`)

```
/app/frontend/src/
├── index.js                     # Application entry point
├── App.js                       # Main application component
├── App.css                      # Main application styles
│
├── /components                  # React components
│   │
│   ├── /common                  # Reusable UI components
│   │   ├── Button.js            # Button component
│   │   ├── Card.js              # Card container component
│   │   ├── Modal.js             # Modal dialog component
│   │   ├── Badge.js             # Badge/tag component
│   │   └── EmptyState.js        # Empty state placeholder
│   │
│   ├── /Dashboard               # Dashboard-specific components
│   │   ├── SummaryCards.js      # Financial summary cards
│   │   └── Charts.js            # Chart visualizations
│   │
│   ├── /Transactions            # Transaction-related components
│   │   ├── TransactionList.js   # Transaction table
│   │   ├── TransactionModal.js  # Add/Edit transaction form
│   │   └── TransactionFilters.js# Search, filter, sort controls
│   │
│   └── /Insights                # Insights components
│       └── Insights.js          # Financial insights display
│
├── /context                     # State management
│   └── AppContext.js            # Global application state
│
├── /services                    # API communication
│   └── api.js                   # API service layer
│
├── /utils                       # Utility functions
│   └── constants.js             # Application constants
│
└── /styles                      # Component-specific CSS
    ├── Button.css
    ├── Card.css
    ├── Modal.css
    ├── Badge.css
    ├── EmptyState.css
    ├── SummaryCards.css
    ├── Charts.css
    ├── Insights.css
    ├── TransactionList.css
    ├── TransactionFilters.css
    └── TransactionModal.css
```

### Frontend Architecture Details

**Component Organization**
- **Common Components**: Reusable across the application
- **Feature Components**: Organized by feature (Dashboard, Transactions, Insights)
- **Single Responsibility**: Each component has one clear purpose

**State Management** (`/context`)
- React Context API for global state
- Manages: user role, transactions, insights, loading state
- Provides data fetching and refresh functions

**Services Layer** (`/services`)
- Centralized API communication
- Axios-based HTTP client
- Clean separation from components

**Utilities** (`/utils`)
- Application constants (categories, roles, types)
- Helper functions
- Shared business logic

**Styling Approach**
- Vanilla CSS (no Tailwind as per requirements)
- CSS variables for theming
- Component-scoped stylesheets
- Consistent naming conventions

---

## Key Features

### Backend Features
✅ RESTful API design
✅ MVC architecture pattern
✅ Model validation
✅ Error handling
✅ Database query optimization (with limits)
✅ Seed data for demo purposes
✅ Clean separation of concerns

### Frontend Features
✅ Component-based architecture
✅ Reusable UI components
✅ Context API for state management
✅ Service layer for API calls
✅ Role-based UI (Admin/Viewer)
✅ Real-time data filtering and sorting
✅ Interactive charts (Line & Doughnut)
✅ Responsive design
✅ Empty state handling
✅ Form validation

---

## Design Patterns Used

1. **MVC Pattern** (Backend)
   - Models: Data structure and validation
   - Controllers: Business logic
   - Routes: Request routing

2. **Service Layer Pattern** (Frontend)
   - Separates API calls from components
   - Centralized HTTP communication

3. **Container/Presentational Pattern** (Frontend)
   - Smart components (with logic)
   - Dumb components (presentation only)

4. **Context API Pattern** (Frontend)
   - Global state management
   - Avoids prop drilling

5. **Composition Pattern** (Frontend)
   - Building complex UIs from simple components
   - Reusable component library

---

## Best Practices Implemented

### Code Organization
- Clear folder structure
- Logical file grouping
- Consistent naming conventions
- Single responsibility principle

### Performance
- Database query limits
- Optimized re-renders
- Memoization where needed

### Maintainability
- Modular code structure
- Separation of concerns
- Reusable components
- Clear documentation

### Scalability
- Easy to add new features
- Extensible component library
- Flexible state management
- Clean API design

---

## Environment Variables

### Backend (`.env`)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
PORT=8001
```

### Frontend (`.env`)
```
REACT_APP_BACKEND_URL=https://money-dashboard-206.preview.emergentagent.com
```

---

## Development Commands

### Backend
```bash
cd /app/backend
yarn install          # Install dependencies
yarn start            # Start server
```

### Frontend
```bash
cd /app/frontend
yarn install          # Install dependencies
yarn start            # Start development server
```

---

## Testing Strategy

- Backend: Unit tests for controllers, integration tests for APIs
- Frontend: Component tests, integration tests, E2E tests
- Use data-testid attributes for reliable test selection

---

## Future Enhancements

1. Add TypeScript for type safety
2. Implement user authentication
3. Add data export functionality (CSV/PDF)
4. Implement pagination for large datasets
5. Add recurring transaction support
6. Budget tracking features
7. Multi-currency support
8. Dark mode theme
9. Mobile app version
10. Advanced analytics and reports
