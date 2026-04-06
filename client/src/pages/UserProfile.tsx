import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { ExpenseOverview } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";
import { formatCentsToEuro } from "../utils/money";

const UserProfile = () => {
  const { user, updateBalance, balance } = useUser();

  const customFetch = useCustomFetch();
  const [expenseOverviews, setExpenseOverviews] = useState<ExpenseOverview[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // When user logged out, do not fetch
      if (!user) {
        setExpenseOverviews([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await customFetch(apiPaths.categories, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as ExpenseOverview[] | null;
        setExpenseOverviews(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load categories.");
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [customFetch, updateBalance, user]);

  const totalSpent = expenseOverviews.reduce(
    (sum, item) => sum + (item.expense_sum?.Int64 ?? 0),
    0
  );
  const totalDeposited = balance + totalSpent;
  const overBudgetCount = expenseOverviews.reduce((sum, item) => {
    return sum + ((item.expense_sum?.Int64 ?? 0) > item.total ? 1 : 0);
  }, 0);

  return (
    <section className="page-section">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Overview</h1>
        <p className="dashboard-subtitle">See your money in one place.</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-label">Total Balance</p>
          <p className="stat-value">
            {formatCentsToEuro(balance)} €
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Deposited</p>
          <p className="stat-value">
            {formatCentsToEuro(totalDeposited)} €
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Spent</p>
          <p className="stat-value">
            {formatCentsToEuro(totalSpent)} €
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Over Budget</p>
          <p className="stat-value stat-value-danger">{String(overBudgetCount).padStart(2, "0")}</p>
          <p className="over-budget-inline">Categories</p>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <h2 className="section-title">Expense Categories</h2>
        <div className="toolbar-actions">
          <Link to="/add-expense-category" className="soft-btn">New Category</Link>
          <Link to="/management" className="soft-btn">Management</Link>
        </div>
      </div>

      {error && <p className="status-pill status-pill-error">{error}</p>}
      {isLoading && (
        <div className="center-state">
          <span className="spinner" />
        </div>
      )}
      {!isLoading && !error && expenseOverviews.length === 0 && (
        <div className="center-state">
          <p className="subtle-copy">No expense categories yet.</p>
        </div>
      )}

      <ul className="dashboard-grid">
        {expenseOverviews?.map((ec: ExpenseOverview) => {
          return (
            <li key={ec.category_id}>
              <ExpenseCard
                category_id={ec.category_id}
                name={ec.name}
                total={ec.total}
                expense_sum={ec.expense_sum}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default UserProfile;
