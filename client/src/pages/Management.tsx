import { useEffect, useState } from "react";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import useCustomFetch from "../hooks/customFetch";
import { ExpenseOverview } from "../types";
import { formatCentsToEuro, parseEuroInputToCents } from "../utils/money";

const Management = () => {
  const customFetch = useCustomFetch();
  const { user, balance, setUpdateBalance, updateBalance } = useUser();

  const [depositTitle, setDepositTitle] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [depositStatus, setDepositStatus] = useState("");
  const [isDepositSubmitting, setIsDepositSubmitting] = useState(false);

  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryLimit, setCategoryLimit] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [activeCategories, setActiveCategories] = useState(0);

  useEffect(() => {
    const fetchCategoryCount = async () => {
      if (!user) {
        setActiveCategories(0);
        return;
      }

      try {
        const response = await customFetch(apiPaths.categories, { method: "GET" });
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = (await response.json()) as ExpenseOverview[] | null;
        setActiveCategories(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    void fetchCategoryCount();
  }, [customFetch, user, updateBalance]);

  const handleDepositSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueCents = parseEuroInputToCents(depositValue);

    if (valueCents === null || valueCents <= 0) {
      setDepositStatus("Please enter a valid amount with max 2 decimals.");
      return;
    }

    try {
      setIsDepositSubmitting(true);
      setDepositStatus("");

      const response = await customFetch(apiPaths.deposit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: depositTitle.trim(),
          value: valueCents,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setDepositTitle("");
      setDepositValue("");
      setUpdateBalance((prev) => !prev);
      setDepositStatus("Balance added successfully.");
    } catch (error) {
      console.error("Failed to add deposit", error);
      setDepositStatus("Failed to add balance.");
    } finally {
      setIsDepositSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setCategoryStatus("You must be logged in.");
      return;
    }

    const totalCents = parseEuroInputToCents(categoryLimit);
    if (!categoryTitle.trim() || totalCents === null || totalCents <= 0) {
      setCategoryStatus("Please enter a title and a valid limit.");
      return;
    }

    try {
      setIsCategorySubmitting(true);
      setCategoryStatus("");

      const response = await customFetch(apiPaths.categories, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryTitle.trim(),
          total: totalCents,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setCategoryTitle("");
      setCategoryLimit("");
      setCategoryStatus("Category created successfully.");
      setUpdateBalance((prev) => !prev);
    } catch (error) {
      console.error("Failed to add category", error);
      setCategoryStatus("Failed to create category.");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Management Center</h1>
        <p className="dashboard-subtitle">
          Configure your financial infrastructure with surgical precision.
        </p>
      </header>

      <div className="management-grid">
        <form className="management-card" onSubmit={handleDepositSubmit}>
          <h2 className="management-title">Add Balance</h2>

          <label className="field-label" htmlFor="deposit-value">
            Deposit Amount
          </label>
          <input
            id="deposit-value"
            className="management-input management-input-money"
            placeholder="0,00"
            value={depositValue}
            onChange={(e) => setDepositValue(e.target.value)}
          />

          <label className="field-label" htmlFor="deposit-title">
            Optional Reference Title
          </label>
          <input
            id="deposit-title"
            className="management-input"
            placeholder="e.g. Monthly salary transfer"
            value={depositTitle}
            onChange={(e) => setDepositTitle(e.target.value)}
          />

          <button className="gradient-btn management-submit" type="submit" disabled={isDepositSubmitting}>
            {isDepositSubmitting ? "Submitting..." : "Confirm Deposit"}
          </button>
          {depositStatus && (
            <p
              className={
                /fail|invalid|required/i.test(depositStatus)
                  ? "status-pill status-pill-error"
                  : "status-pill status-pill-success"
              }
            >
              {depositStatus}
            </p>
          )}
        </form>

        <form className="management-card" onSubmit={handleCategorySubmit}>
          <h2 className="management-title">Create Expense Category</h2>

          <label className="field-label" htmlFor="category-title">
            Category Title
          </label>
          <input
            id="category-title"
            className="management-input"
            placeholder="e.g. Premium Travel"
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
          />

          <label className="field-label" htmlFor="category-limit">
            Monthly Limit
          </label>
          <input
            id="category-limit"
            className="management-input management-input-money"
            placeholder="5.000,00"
            value={categoryLimit}
            onChange={(e) => setCategoryLimit(e.target.value)}
          />

          <div className="management-info">
            Categories help you track spending trends. Limits are calculated against each category total.
          </div>

          <button className="gradient-btn management-submit" type="submit" disabled={isCategorySubmitting}>
            {isCategorySubmitting ? "Submitting..." : "Create Category"}
          </button>
          {categoryStatus && (
            <p
              className={
                /fail|invalid|required/i.test(categoryStatus)
                  ? "status-pill status-pill-error"
                  : "status-pill status-pill-success"
              }
            >
              {categoryStatus}
            </p>
          )}
        </form>
      </div>

      <div className="dashboard-stats management-stats">
        <div className="stat-card">
          <p className="stat-label">Current Balance</p>
          <p className="stat-value">{formatCentsToEuro(balance)} €</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Categories</p>
          <p className="stat-value">{activeCategories}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Status</p>
          <p className="stat-value">Optimized</p>
        </div>
      </div>
    </section>
  );
};

export default Management;
