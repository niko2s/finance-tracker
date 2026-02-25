import { Link, useNavigate } from "react-router-dom";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import useCustomFetch from "../hooks/customFetch";
import { formatCentsToEuro } from "../utils/money";

const NavBar = () => {
  const customFetch = useCustomFetch();
  const { user, setUser, balance } = useUser();
  const navigate = useNavigate();

  const formattedBalance = formatCentsToEuro(balance);

  const handleLogout = async () => {
    try {
      const response = await customFetch(apiPaths.logout, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Log out failed", error);
    }
  };

  return (
    <div className="navbar bg-base-300 mb-8">
      <div className="navbar-start">
        {user && (
          <div className="flex items-center space-x-3 ml-4 md:ml-12">
            <p className="text-xl">{formattedBalance} €</p>
            <Link className="btn btn-ghost" to="/add-balance" aria-label="Add balance">
              <i className="material-icons">add</i>
            </Link>
          </div>
        )}
      </div>

      <div className="navbar-center">
        <Link className="btn btn-ghost text-2xl md:text-3xl" to={user ? "/dashboard" : "/login"}>
          Finance Tracker
        </Link>
      </div>

      <div className="navbar-end">
        {user && (
          <div className="flex items-center space-x-3 mr-4 md:mr-12">
            <p className="text-xl">Hello, {user.username}</p>
            <button className="btn btn-ghost" onClick={handleLogout} aria-label="Log out">
              <i className="material-icons">logout</i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
