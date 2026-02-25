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
  let withinLimit = true;
  let widthPercentage = 0;
  if (total > 0) {
    const ratio = spent / total;
    widthPercentage = Math.min(ratio * 100, 100);
    if (ratio > 1) withinLimit = false;
  }

  return (
    <>
      <div className="card w-96 bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{name}</h2>

          <p className="text-end">
            {formatCentsToEuro(spent)}/{formatCentsToEuro(total)}€
          </p>
          <progress
            className={`progress w-full mt-1 mb-3 ${
              withinLimit ? "progress-primary" : "progress-error"
            }`}
            value={widthPercentage}
            max="100"
          />
          <div className="card-actions justify-between">
            <Link
              to={`/expense-category/${category_id}`}
              className="btn btn-outline inline-flex items-center"
            >
              <i className="material-icons">history</i>
            </Link>
            <button
              onClick={() => {
                const dialog = document.getElementById(
                  `modal-${category_id}`
                ) as HTMLDialogElement | null;
                dialog?.showModal();
              }}
              className="btn btn-outline inline-flex items-center"
              disabled={isSubmitting}
            >
              <i className="material-icons">add</i>
            </button>
          </div>
        </div>
      </div>

      <Modal id={`modal-${category_id}`} onClose={() => {
        setStatus("");
        setValue("");
        setTitle("");
      }}>
        <AddForm
          title={`Add an expense to ${name}`}
          handleSubmit={handleSubmit}
          status={status}
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
        </AddForm>
      </Modal>
    </>
  );
};

export default ExpenseCard;
