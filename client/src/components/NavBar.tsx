import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import useCustomFetch from "../hooks/customFetch";
import { Deposit, ExpenseOverview } from "../types";

const DEMO_PREFIX = "Demo:";

const DEMO_CATEGORY_TEMPLATES = [
  { name: "Groceries", total: 65000, expenses: [12900, 9800, 7600] },
  { name: "Transport", total: 25000, expenses: [4200, 3100, 2500] },
  { name: "Dining", total: 40000, expenses: [9800, 7600, 5400] },
  { name: "Utilities", total: 30000, expenses: [12400, 8400, 8300] }, // 97%
  { name: "Entertainment", total: 35000, expenses: [14500, 12000, 10000] }, // exceeds total
];

const DEMO_DEPOSITS = [
  { title: "Demo: Salary", value: 320000 },
  { title: "Demo: Freelance", value: 90000 },
];

const NavBar = () => {
  const customFetch = useCustomFetch();
  const { user, setUser, setUpdateBalance, updateBalance } = useUser();
  const navigate = useNavigate();
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [isDemoBusy, setIsDemoBusy] = useState(false);
  const [demoStatus, setDemoStatus] = useState("");

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

  const demoCategoryNames = useMemo(
    () => DEMO_CATEGORY_TEMPLATES.map((template) => `${DEMO_PREFIX} ${template.name}`),
    []
  );

  const getCategories = async () => {
    const response = await customFetch(apiPaths.categories, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch categories (${response.status})`);
    }
    const data = (await response.json()) as ExpenseOverview[] | null;
    return Array.isArray(data) ? data : [];
  };

  const getDeposits = async () => {
    const response = await customFetch(apiPaths.deposit, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch deposits (${response.status})`);
    }
    const data = (await response.json()) as Deposit[] | null;
    return Array.isArray(data) ? data : [];
  };

  const removeDemoData = async () => {
    const [categories, deposits] = await Promise.all([getCategories(), getDeposits()]);

    const demoCategories = categories.filter((category) =>
      category.name.startsWith(DEMO_PREFIX)
    );
    const demoDeposits = deposits.filter((deposit) =>
      (deposit.title || "").startsWith(DEMO_PREFIX)
    );

    await Promise.all(
      demoCategories.map(async (category) => {
        const response = await customFetch(apiPaths.categoryById(category.category_id), {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete demo category (${response.status})`);
        }
      })
    );

    await Promise.all(
      demoDeposits.map(async (deposit) => {
        const response = await customFetch(apiPaths.depositById(deposit.id), {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete demo deposit (${response.status})`);
        }
      })
    );
  };

  const seedDemoData = async () => {
    if (!user) {
      throw new Error("Missing user");
    }

    await removeDemoData();

    await Promise.all(
      DEMO_DEPOSITS.map(async (deposit) => {
        const response = await customFetch(apiPaths.deposit, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deposit),
        });
        if (!response.ok) {
          throw new Error(`Failed to create demo deposit (${response.status})`);
        }
      })
    );

    await Promise.all(
      DEMO_CATEGORY_TEMPLATES.map(async (template) => {
        const response = await customFetch(apiPaths.categories, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${DEMO_PREFIX} ${template.name}`,
            total: template.total,
            user_id: user.id,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to create demo category (${response.status})`);
        }
      })
    );

    const createdCategories = await getCategories();

    await Promise.all(
      DEMO_CATEGORY_TEMPLATES.flatMap((template) => {
        const categoryName = `${DEMO_PREFIX} ${template.name}`;
        const category = createdCategories.find((entry) => entry.name === categoryName);
        if (!category) {
          return [];
        }

        return template.expenses.map(async (value, index) => {
          const response = await customFetch(
            apiPaths.expensesByCategory(category.category_id),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: `${categoryName} #${index + 1}`,
                value,
                expense_category_id: category.category_id,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to create demo expense (${response.status})`);
          }
        });
      })
    );
  };

  const handleToggleDemo = async () => {
    const nextState = !demoEnabled;

    try {
      setIsDemoBusy(true);
      setDemoStatus("");

      if (nextState) {
        await seedDemoData();
      } else {
        await removeDemoData();
      }

      setDemoEnabled(nextState);
      setUpdateBalance((prev) => !prev);
      setDemoStatus(nextState ? "Demo data added." : "Demo data removed.");
    } catch (error) {
      console.error("Failed to toggle demo data", error);
      setDemoStatus("Failed to apply demo toggle.");
    } finally {
      setIsDemoBusy(false);
    }
  };

  useEffect(() => {
    const detectDemoMode = async () => {
      if (!user) {
        setDemoEnabled(false);
        setDemoStatus("");
        return;
      }

      try {
        const [categories, deposits] = await Promise.all([getCategories(), getDeposits()]);

        const hasDemoCategory = categories.some((category) =>
          demoCategoryNames.includes(category.name)
        );
        const hasDemoDeposit = deposits.some((deposit) =>
          (deposit.title || "").startsWith(DEMO_PREFIX)
        );
        setDemoEnabled(hasDemoCategory || hasDemoDeposit);
      } catch (error) {
        console.error("Failed to detect demo state", error);
      }
    };

    void detectDemoMode();
  }, [customFetch, demoCategoryNames, updateBalance, user]);

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
              <div className="demo-toggle-wrap">
                <span className="demo-toggle-label">Demo transactions</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={demoEnabled}
                  aria-label="Toggle demo transactions"
                  className={`demo-toggle ${demoEnabled ? "is-on" : ""}`}
                  onClick={handleToggleDemo}
                  disabled={isDemoBusy}
                >
                  <span className="demo-toggle-knob" />
                </button>
              </div>
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
      {user && demoStatus && (
        <p className={`demo-toggle-status ${/failed/i.test(demoStatus) ? "is-error" : ""}`}>
          {demoStatus}
        </p>
      )}
    </header>
  );
};

export default NavBar;
