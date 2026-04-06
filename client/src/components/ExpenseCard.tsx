import { useEffect, useState } from "react";
import Modal from "./Modal";
import { ExpenseCardProps } from "../types";
import AddForm from "./AddForm";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";
import { formatCentsToEuro, parseEuroInputToCents } from "../utils/money";

const ExpenseCard = ({
  category_id,
  name,
  total,
  expense_sum,
}: ExpenseCardProps) => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [spent, setSpent] = useState(expense_sum?.Int64 ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customFetch = useCustomFetch();
  const { setUpdateBalance } = useUser();

  useEffect(() => {
    setSpent(expense_sum?.Int64 ?? 0);
  }, [expense_sum?.Int64]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valueCents = parseEuroInputToCents(value);
    if (valueCents === null || valueCents <= 0) {
      setStatus("Please enter a valid amount with max 2 decimals.");
      return;
    }

    void addExpense(valueCents);
  };

  const addExpense = async (valueCents: number) => {
    const addExpenseBody = {
      title,
      value: valueCents,
      expense_category_id: category_id,
    };

    const jsonAddExpenseBody = JSON.stringify(addExpenseBody);

    try {
      setIsSubmitting(true);
      setStatus("");

      const response = await customFetch(
        apiPaths.expensesByCategory(category_id),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonAddExpenseBody,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setStatus("Expense added successfully!");
      setSpent((prev) => prev + valueCents);
      setTitle("");
      setValue("");
      setUpdateBalance((prev) => !prev);
    } catch (error) {
      setStatus("An error occurred when adding a new expense.");
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate width of progressbar.
  let widthPercentage = 0;
  let ratio = 0;
  if (total > 0) {
    ratio = spent / total;
    widthPercentage = Math.min(ratio * 100, 100);
  }
  const statusTone =
    ratio > 1 ? "over" : ratio >= 0.85 ? "warning" : "safe";
  const remaining = total - spent;
  const remainingPct = total > 0 ? Math.max(0, ((total - spent) / total) * 100) : 0;

  return (
    <>
      <article className="category-card">
        <div className="category-head">
          <div>
            <h2 className="category-title">{name}</h2>
            <p className="category-budget">
              {formatCentsToEuro(spent)} of {formatCentsToEuro(total)} €
            </p>
          </div>
          <span className={`status-badge status-badge-${statusTone}`}>
            {statusTone === "safe"
              ? "Safe"
              : statusTone === "warning"
                ? "Warning"
                : "Over Budget"}
          </span>
        </div>
        <div className="micro-progress-track" aria-label={`${name} budget usage`}>
          <div
            className={`micro-progress-fill micro-progress-fill-${statusTone}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
        <div className="category-footer">
          <span className={`remaining-copy ${remaining < 0 ? "remaining-copy-over" : ""}`}>
            {remaining < 0
              ? `-${formatCentsToEuro(Math.abs(remaining))} Exceeded`
              : `${Math.round(remainingPct * 10) / 10}% Remaining`}
          </span>
          <div className="category-actions">
            <Link
              to={`/expense-category/${category_id}`}
              className="history-link"
              aria-label={`Open ${name} history`}
            >
              History
            </Link>
          <button
            onClick={() => {
              const dialog = document.getElementById(
                `modal-${category_id}`
              ) as HTMLDialogElement | null;
              dialog?.showModal();
            }}
            className="category-inline-link"
            disabled={isSubmitting}
            aria-label={`Add expense to ${name}`}
          >
            <i className="material-icons">add_circle</i>
            Add expense
          </button>
          </div>
        </div>
      </article>

      <Modal id={`modal-${category_id}`} onClose={() => {
        setStatus("");
        setValue("");
        setTitle("");
      }}>
        <AddForm
          title={`Add an expense to ${name}`}
          handleSubmit={handleSubmit}
          status={status}
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
            type="number"
            required={true}
            state={value}
            setState={setValue}
          />
          {isSubmitting && <p className="subtle-copy">Submitting...</p>}
        </AddForm>
      </Modal>
    </>
  );
};

export default ExpenseCard;
