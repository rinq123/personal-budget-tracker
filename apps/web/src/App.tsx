import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import BudgetsPage from "./pages/BudgetsPage";
import TransactionsPage from "./pages/TransactionsPage";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink> |{" "}
            <NavLink to="/categories">Categories</NavLink> |{" "}
            <NavLink to="/transactions">Transactions</NavLink> |{" "}
            <NavLink to="/budgets">Budgets</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink> |{" "}
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <BudgetsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;