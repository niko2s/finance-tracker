import { useEffect, useMemo, useState } from "react";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import useCustomFetch from "../hooks/customFetch";
import { Deposit, Expense, ExpenseOverview } from "../types";
import { formatCentsToEuro } from "../utils/money";

interface TransactionItem {
  key: string;
  id: number;
  title: string;
  subtitle: string;
  category: string;
  type: "Deposit" | "Expense";
  amount: number;
  order: number;
  categoryId?: number;
}

const Transactions = () => {
  const customFetch = useCustomFetch();
  const { user, balance, setUpdateBalance } = useUser();

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Deposit" | "Expense">("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionStatus, setActionStatus] = useState("");
  const [deletingKey, setDeletingKey] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [categoriesResponse, depositsResponse] = await Promise.all([
          customFetch(apiPaths.categories, { method: "GET" }),
          customFetch(apiPaths.deposit, { method: "GET" }),
        ]);

        if (!categoriesResponse.ok || !depositsResponse.ok) {
          throw new Error("Failed to load data.");
        }

        const categories = ((await categoriesResponse.json()) as ExpenseOverview[] | null) ?? [];
        const deposits = ((await depositsResponse.json()) as Deposit[] | null) ?? [];

        const expensesByCategory = await Promise.all(
          categories.map(async (category) => {
            const response = await customFetch(apiPaths.expensesByCategory(category.category_id), {
              method: "GET",
            });

            if (!response.ok) {
              return [];
            }

            const expenses = ((await response.json()) as Expense[] | null) ?? [];
            return expenses.map((expense) => ({
              key: `expense-${expense.id}`,
              id: expense.id,
              title: expense.title?.trim() || "Untitled Expense",
              subtitle: `Category budget: ${formatCentsToEuro(category.total)} €`,
              category: category.name,
              type: "Expense" as const,
              amount: -Math.abs(expense.value),
              order: expense.id,
              categoryId: category.category_id,
            }));
          })
        );

        const depositItems: TransactionItem[] = deposits.map((deposit) => ({
          key: `deposit-${deposit.id}`,
          id: deposit.id,
          title: deposit.title?.trim() || "Balance Deposit",
          subtitle: "Added to account balance",
          category: "Balance",
          type: "Deposit",
          amount: Math.abs(deposit.value),
          order: deposit.id,
        }));

        const merged = [...depositItems, ...expensesByCategory.flat()].sort(
          (a, b) => b.order - a.order
        );

        setTransactions(merged);
      } catch (fetchError) {
        console.error("Failed to load transactions", fetchError);
        setError("Failed to load transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTransactions();
  }, [customFetch, user]);

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      if (typeFilter !== "All" && item.type !== typeFilter) {
        return false;
      }

      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }

      const normalized = search.trim().toLowerCase();
      if (!normalized) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized)
      );
    });
  }, [transactions, typeFilter, categoryFilter, search]);

  const categoryOptions = useMemo(() => {
    const unique = new Set(transactions.map((item) => item.category));
    return ["All", ...Array.from(unique)];
  }, [transactions]);

  const handleDeleteTransaction = async (item: TransactionItem) => {
    const shouldDelete = window.confirm(`Delete this ${item.type.toLowerCase()} entry?`);
    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingKey(item.key);
      setActionStatus("");

      if (item.type === "Expense" && !item.categoryId) {
        throw new Error("Missing category for expense deletion.");
      }

      const endpoint =
        item.type === "Deposit"
          ? apiPaths.depositById(item.id)
          : apiPaths.expenseByCategoryAndId(item.categoryId as number, item.id);

      const response = await customFetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setTransactions((prev) => prev.filter((tx) => tx.key !== item.key));
      setUpdateBalance((prev) => !prev);
      setActionStatus(`${item.type} deleted.`);
    } catch (deleteError) {
      console.error("Delete transaction failed", deleteError);
      setActionStatus(`Failed to delete ${item.type.toLowerCase()}.`);
    } finally {
      setDeletingKey("");
    }
  };

  return (
    <section className="page-section">
      <header className="dashboard-header tx-header">
        <div className="tx-heading-copy">
          <h1 className="dashboard-title">Transaction Center</h1>
          <p className="dashboard-subtitle">A clear history of every move.</p>
        </div>
        <div className="tx-balance-card">
          <p className="stat-label">Available Balance</p>
          <p className="tx-balance-value">{formatCentsToEuro(balance)} €</p>
          <div className="micro-progress-track">
            <div className="micro-progress-fill micro-progress-fill-safe" style={{ width: "74%" }} />
          </div>
        </div>
      </header>

      <div className="tx-filters">
        <input
          className="tx-input"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="tx-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "All" | "Deposit" | "Expense")}>
          <option value="All">Type: All</option>
          <option value="Deposit">Deposit</option>
          <option value="Expense">Expense</option>
        </select>
        <select className="tx-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "Category: All" : option}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="status-pill status-pill-error">{error}</p>}
      {!error && actionStatus && (
        <p
          className={
            /failed/i.test(actionStatus)
              ? "status-pill status-pill-error"
              : "status-pill status-pill-success"
          }
        >
          {actionStatus}
        </p>
      )}
      {isLoading && (
        <div className="center-state">
          <span className="spinner" />
        </div>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="center-state">
          <p className="subtle-copy">No transactions match these filters.</p>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Type</th>
                <th className="amount-col">Amount</th>
                <th className="amount-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.key}>
                  <td>
                    <p className="tx-title">{item.title}</p>
                    <p className="tx-subtitle">{item.subtitle}</p>
                  </td>
                  <td>
                    <span className="tx-badge">{item.category}</span>
                  </td>
                  <td>
                    <span
                      className={`tx-type ${
                        item.type === "Deposit" ? "tx-type-deposit" : "tx-type-expense"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className={`amount-col ${item.amount >= 0 ? "tx-positive" : "tx-negative"}`}>
                    {item.amount >= 0 ? "+" : "-"}
                    {formatCentsToEuro(Math.abs(item.amount))} €
                  </td>
                  <td className="amount-col">
                    <button
                      type="button"
                      className="table-delete-btn"
                      onClick={() => handleDeleteTransaction(item)}
                      disabled={deletingKey === item.key}
                    >
                      {deletingKey === item.key ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Transactions;
