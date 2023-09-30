import { useState } from "react";
import Modal from "./Modal";
import { ExpenseCardProps } from "../types";

const ExpenseCard = ({ name, total }: ExpenseCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

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

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <p>Quick add here</p>
      </Modal>
    </div>
  );
};

export default ExpenseCard;
