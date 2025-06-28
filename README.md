# Financial Dashboard - Penta

A modern financial dashboard built with React, TypeScript, and Material-UI, featuring a dark theme interface that matches the provided design.

## Features

- 🎨 **Modern Dark UI**: Built with Material-UI following the provided dark theme design
- 📊 **Interactive Charts**: Revenue and expense tracking with Recharts
- 💰 **Transaction Management**: Complete CRUD operations for financial transactions
- 🔐 **Authentication**: Secure login/register with JWT tokens
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates**: Live data updates with React Query
- 🔍 **Search & Filters**: Advanced filtering and search capabilities

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for the component library
- **Recharts** for data visualization
- **Zustand** for state management
- **React Query** for server state management
- **React Router** for navigation
- **Vite** for build tooling

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd looper
   ```

2. **Install dependencies for all packages**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` in the backend folder:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start the development servers**

   **Option 1: Start all services at once**

   ```bash
   npm run dev
   ```

   **Option 2: Start services individually**

   Backend (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):

   ```bash
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
looper/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── store/         # Zustand stores
│   │   ├── theme/         # Material-UI theme configuration
│   │   └── ...
│   └── package.json
├── backend/           # Express backend API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── ...
│   └── package.json
├── shared/            # Shared TypeScript types
└── package.json       # Root package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Transactions

- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard

- `GET /api/dashboard/metrics` - Get dashboard metrics

## Available Routes

The application includes the following main routes:

- **`/dashboard`** - Main dashboard with overview stats and charts
- **`/transactions`** - Transaction management with CRUD operations
- **`/wallet`** - Wallet management with account overview and balances
- **`/analytics`** - Advanced analytics with charts and insights
- **`/personal`** - Personal profile management (coming soon)
- **`/message`** - Message center and notifications (coming soon)
- **`/settings`** - Application settings and preferences (coming soon)

All routes are protected and require authentication.

## UI Components

### Key Components

- **Layout**: Main application layout with sidebar and header
- **StatsCard**: Displays key metrics (Balance, Revenue, Expenses, Savings)
- **RevenueExpenseChart**: Interactive line chart for financial data
- **TransactionList**: Displays transaction data in a table format
- **FormField**: Reusable form input component

### Design Features

- Dark theme with accent colors (Blue: #00D4FF, Green: #22C55E)
- Consistent spacing and typography
- Hover effects and smooth transitions
- Mobile-responsive sidebar navigation

## Scripts

### Root Level

- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run clean` - Clean all node_modules

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financial-dashboard
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
