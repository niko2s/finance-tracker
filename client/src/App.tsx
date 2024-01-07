import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import AddExpenseCategory from "./pages/AddExpenseCategory";
import AddBalance from "./pages/AddBalance";
import ExpenseCategory from "./pages/ExpenseCategory";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<UserProfile />} />
          <Route path="/add-balance" element={<AddBalance />} />
          <Route
            path="/add-expense-category"
            element={<AddExpenseCategory />}
          />
          <Route path="/expense-category/:id" element={<ExpenseCategory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
