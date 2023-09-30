import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import AddExpenseCategory from "./pages/Add/AddExpenseCategory";
import AddBalance from "./pages/Add/AddBalance";

function App() {
  //use effect here to fetch user with cookie if cookie exists !?
  //also add refresh token
  //no ID then, because cookie is HTTP-only, cant access through JS

  return (
    <>
      <p className="text-5xl text-center bg-blue-200">Finance Tracker</p>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<UserProfile />} />
        <Route path="/add">
            <Route path="balance" element={<AddBalance />} />
            <Route path="category" element={<AddExpenseCategory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
