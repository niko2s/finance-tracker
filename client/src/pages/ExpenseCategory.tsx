import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Expense, ExpenseOverview } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";
import { formatCentsToEuro, parseEuroInputToCents } from "../utils/money";
import { useUser } from "../context/UserContext";
import Modal from "../components/Modal";
import AddForm from "../components/AddForm";
import FormField from "../components/FormField";

const ExpenseCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setUpdateBalance } = useUser();
  const customFetch = useCustomFetch();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [isDeletingExpenseId, setIsDeletingExpenseId] = useState<number | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("Category");

  const fetchExpenses = useCallback(async () => {
    try {
      if (!id) {
        throw new Error("ID parameter is missing");
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
    } catch (fetchError) {
      setError("Failed to load expenses.");
      console.error("Failed to fetch data", fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [customFetch, id]);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (!id) {
        setCategoryName("Category");
        return;
      }

      try {
        const response = await customFetch(apiPaths.categories, {
          method: "GET",
        });
        if (!response.ok) {
          return;
        }

        const categories = (await response.json()) as ExpenseOverview[] | null;
        const match = categories?.find((category) => String(category.category_id) === id);
        setCategoryName(match?.name || "Category");
      } catch (nameError) {
        console.error("Failed to load category name", nameError);
      }
    };

    void fetchCategoryName();
  }, [customFetch, id]);

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      return;
    }

    const valueCents = parseEuroInputToCents(value);
    if (valueCents === null || valueCents <= 0) {
      setAddStatus("Please enter a valid amount with max 2 decimals.");
      return;
    }

    try {
      setIsSubmitting(true);
      setAddStatus("");

      const response = await customFetch(apiPaths.expensesByCategory(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          value: valueCents,
          expense_category_id: Number(id),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setTitle("");
      setValue("");
      setAddStatus("Expense added successfully!");
      setUpdateBalance((prev) => !prev);
      await fetchExpenses();
    } catch (addError) {
      console.error("Failed to add expense", addError);
      setAddStatus("Failed to add expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!id) {
      return;
    }

    const shouldDelete = window.confirm("Delete this expense?");
    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeletingExpenseId(expenseId);
      setActionStatus("");

      const response = await customFetch(
        apiPaths.expenseByCategoryAndId(id, expenseId),
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      setActionStatus("Expense deleted.");
    } catch (deleteError) {
      console.error("Delete expense failed", deleteError);
      setActionStatus("Failed to delete expense.");
    } finally {
      setIsDeletingExpenseId(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!id) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this expense category and all related expense entries?"
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeletingCategory(true);
      setActionStatus("");

      const response = await customFetch(apiPaths.categoryById(id), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setUpdateBalance((prev) => !prev);
      navigate("/dashboard");
    } catch (deleteError) {
      console.error("Delete category failed", deleteError);
      setActionStatus("Failed to delete category.");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <section className="history-shell">
      <header className="dashboard-header" style={{ marginBottom: "1rem" }}>
        <h1 className="dashboard-title">{categoryName}</h1>
        <p className="dashboard-subtitle">Transactions in this category.</p>
        <div className="toolbar-actions" style={{ marginTop: "0.85rem" }}>
          <button
            type="button"
            className="soft-btn"
            onClick={() => {
              const dialog = document.getElementById("history-add-expense-modal") as HTMLDialogElement | null;
              dialog?.showModal();
            }}
          >
            Add Expense
          </button>
          <button
            type="button"
            className="soft-btn soft-btn-danger toolbar-danger-btn"
            onClick={handleDeleteCategory}
            disabled={isDeletingCategory}
          >
            {isDeletingCategory ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </header>
      {isLoading && (
        <div className="center-state">
          <span className="spinner" />
        </div>
      )}
      {!isLoading && actionStatus && (
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
                <th className="amount-col">Amount</th>
                <th className="amount-col">Action</th>
              </tr>
            </thead>
            <tbody>
            {expenses.map((e: Expense) => {
              return (
                <tr key={e.id}>
                  <td>
                    <p className="tx-title">{e.title || "Untitled"}</p>
                  </td>
                  <td className="amount-col tx-negative">-{formatCentsToEuro(e.value)} €</td>
                  <td className="amount-col">
                    <button
                      type="button"
                      className="table-delete-btn"
                      onClick={() => handleDeleteExpense(e.id)}
                      disabled={isDeletingExpenseId === e.id}
                    >
                      {isDeletingExpenseId === e.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        id="history-add-expense-modal"
        onClose={() => {
          setAddStatus("");
          setTitle("");
          setValue("");
        }}
      >
        <AddForm
          title={`Add expense to ${categoryName}`}
          handleSubmit={handleAddExpense}
          status={addStatus}
          submitLabel="Add Expense"
        >
          <FormField
            name="Title"
            type="text"
            state={title}
            setState={setTitle}
          />
          <FormField
            name="Value (€)"
            info="Use format like 1,234.56"
            placeholder="e.g. 45.90"
            type="number"
            required={true}
            state={value}
            setState={setValue}
          />
          {isSubmitting && <p className="subtle-copy">Submitting...</p>}
        </AddForm>
      </Modal>
    </section>
  );
};

export default ExpenseCategory;
