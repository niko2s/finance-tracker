import { Link, NavLink, useNavigate } from "react-router-dom";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import useCustomFetch from "../hooks/customFetch";

const NavBar = () => {
  const customFetch = useCustomFetch();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

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
    <header className="ft-navbar">
      <div className="ft-navbar-inner">
        <div className="ft-brand-wrap">
          <Link className="ft-brand" to={user ? "/dashboard" : "/login"}>
            Finance Tracker
          </Link>
          {user && (
            <nav className="ft-nav-links" aria-label="Primary">
              <NavLink to="/dashboard" className={({ isActive }) => `ft-nav-link ${isActive ? "active" : ""}`}>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={({ isActive }) => `ft-nav-link ${isActive ? "active" : ""}`}>
                Transactions
              </NavLink>
              <NavLink to="/management" className={({ isActive }) => `ft-nav-link ${isActive ? "active" : ""}`}>
                Management
              </NavLink>
            </nav>
          )}
        </div>
        <div className="ft-navbar-right">
          {user && (
            <>
              <Link className="ft-primary-btn" to="/add-balance" aria-label="Add balance">
                Add Balance
              </Link>
              <div className="ft-avatar" aria-hidden="true">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <button className="ft-logout-link" onClick={handleLogout} aria-label="Log out">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
