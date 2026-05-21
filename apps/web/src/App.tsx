import { BrowserRouter, Routes, Route, NavLink} from "react-router"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import CategoriesPage from "./pages/CategoriesPage"
import BudgetsPage from "./pages/BudgetsPage"
import TransactionsPage from "./pages/TransactionsPage"

function App() {

  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <NavLink to = "/register">Register</NavLink> | {" "}
        <NavLink to = "/login">Login</NavLink> | {" "}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path ="/register" element={<RegisterPage />} />
        <Route path ="/login" element={<LoginPage />} />
        <Route path ="/dashboard" element={<DashboardPage />} />
        <Route path ="/categories" element={<CategoriesPage />} />
        <Route path ="/budgets" element={<BudgetsPage />} />
        <Route path ="/transactions" element={<TransactionsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
