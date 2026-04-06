import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Expense } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";
import { formatCentsToEuro } from "../utils/money";

const ExpenseCategory = () => {
  const { id } = useParams();
  const customFetch = useCustomFetch();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("ID parameter is missing"); //should not happen
        }

        setIsLoading(true);
        setError("");

        const response = await customFetch(apiPaths.expensesByCategory(id), {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as Expense[] | null;
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load expenses.");
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [customFetch, id]);

  return (
    <section className="history-shell">
      <header className="dashboard-header" style={{ marginBottom: "1rem" }}>
        <h1 className="dashboard-title">Category Transactions</h1>
        <p className="dashboard-subtitle">Line items for this category.</p>
      </header>
      {isLoading && (
        <div className="center-state">
          <span className="spinner" />
        </div>
      )}
      {!isLoading && error && (
        <p className="status-pill status-pill-error">{error}</p>
      )}
      {!isLoading && !error && expenses.length === 0 && (
        <div className="center-state">
          <p className="subtle-copy">No expenses yet!</p>
        </div>
      )}
      {!isLoading && !error && expenses.length > 0 && (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Reference</th>
                <th className="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
            {expenses.map((e: Expense) => {
              return (
                <tr key={e.id}>
                  <td>
                    <p className="tx-title">{e.title || "Untitled"}</p>
                    <p className="tx-subtitle">Expense record</p>
                  </td>
                  <td className="tx-muted">Record #{e.id}</td>
                  <td className="amount-col tx-negative">-{formatCentsToEuro(e.value)} €</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ExpenseCategory;
