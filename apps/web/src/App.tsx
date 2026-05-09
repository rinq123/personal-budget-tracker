import { BrowserRouter, Routes, Route, NavLink} from "react-router"
import DashboardPage from "./pages/DashboardPage"
import CategoriesPage from "./pages/CategoriesPage"
import BudgetsPage from "./pages/BudgetsPage"
import TransactionsPage from "./pages/TransactionsPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"


function App() {

  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <NavLink to ="/">Dashboard</NavLink> | {" "}
        <NavLink to = "/categories">Categories</NavLink> | {" "}
        <NavLink to = "/budgets">Budgets</NavLink> | {" "}
        <NavLink to = "/transactions">Transactions</NavLink> | {" "}
        <NavLink to = "/register">Register</NavLink> | {" "}
        <NavLink to = "/login">Login</NavLink>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path ="/" element={<DashboardPage />} />
        <Route path ="/categories" element={<CategoriesPage />} />
        <Route path ="/budgets" element={<BudgetsPage />} />
        <Route path ="/transactions" element={<TransactionsPage />} />
        <Route path ="/register" element={<RegisterPage />} />
        <Route path ="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
