import { useState } from "react";
import Modal from "./Modal";
import { ExpenseCardProps } from "../types";
import AddForm from "./AddForm";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

const ExpenseCard = ({
  category_id,
  name,
  total,
  expense_sum,
}: ExpenseCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const customFetch = useCustomFetch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      setStatus("Value required!");
      return;
    }
    addExpense();
  };

  const addExpense = async () => {
  
    const addExpenseBody = {
      title,
      value: Number(value),
      expense_category_id: category_id,
    };

    const jsonAddExpenseBody = JSON.stringify(addExpenseBody);

    try {
      const response = await customFetch(apiPaths.expensesByCategory(category_id), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonAddExpenseBody,
      });

      if (!response.ok) {
        throw new Error("Network response not 200");
      } else {
        setStatus("Expense added successfully!");
        expense_sum.Float64 += Number(value);
        setTitle("");
        setValue("");
      }
    } catch (error) {
      setStatus("An error occured when adding a new expense");
      console.error("Fetch error:", error);
    }
  };

  //calculate width of progressbar
  let withinLimit = true;
  let widthPercentage = "0";
  if (expense_sum && total) {
    const ratio = expense_sum.Float64 / total;
    widthPercentage = String(Math.min(ratio * 100, 100));
    if (ratio > 1) withinLimit = false;
  }

  return (
    <>
      <div className="card w-96 bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{name}</h2>

          <p className="text-end">
            {expense_sum.Float64}/{total}€
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
                //so Link component does not get called
                setModalOpen(true);
              }}
              className="btn btn-outline inline-flex items-center"
            >
              <i className="material-icons">add</i>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen}>
        <AddForm
          title={`Add an expense to ${name}`}
          handleSubmit={handleSubmit}
          status={status}
          onClose={() => {
            setModalOpen(false);
            setStatus(""), setValue(""), setTitle("");
          }}
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
