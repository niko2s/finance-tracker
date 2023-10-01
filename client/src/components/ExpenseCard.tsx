import { useState } from "react";
import Modal from "./Modal";
import { ExpenseCardProps } from "../types";
import AddForm from "./AddForm";

const ExpenseCard = ({ id, name, total }: ExpenseCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) {
      setStatus("Value required!");
      return;
    }
    addExpense();
  };

  const addExpense = async () => {
    const api = "http://localhost:8080";

    const addExpenseBody = {
      title,
      "value": Number(value),
      "expense_category_id": id,
    };

    const jsonAddExpenseBody = JSON.stringify(addExpenseBody);

    try {
      const response = await fetch(api + "/expense", {
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
        setTitle("")
        setValue("")
      }

    } catch (error) {
      setStatus("An error occured when adding a new expense");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="block max-w-sm p-6 border rounded-lg shadow bg-gray-800 border-gray-700">
      <div className="flex justify-between pb-6">
        <p className="text-slate-200">{name}</p>
        <p className="text-slate-200">450/{total}€</p>
      </div>

      <div className="w-full rounded-full h-2.5 bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: "45%" }}
        />
      </div>

      <div className="flex justify-end pt-3">
        <button
          onClick={() => setModalOpen(true)}
          className="text-slate-200 border border-solid border-slate-400 rounded hover:bg-slate-700 p-2"
        >
          Add expense
        </button>
      </div>

      <Modal isOpen={isModalOpen}>
        <AddForm
          title={`Add an expense to ${name}`}
          handleSubmit={handleSubmit}
          status={status}
          onClose={() => setModalOpen(false)}
        >
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-solid rounded "
            />
          </label>

          <div className="pl-4">
            <label className="inline-block">
              Expense (required):
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="border border-solid rounded "
              />
            </label>
          </div>
        </AddForm>
      </Modal>
    </div>
  );
};

export default ExpenseCard;
