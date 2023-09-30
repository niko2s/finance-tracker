import { useState } from "react";
import Modal from "./Modal";

const ExpenseCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shado dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between pb-6">
        <p className="text-slate-200">Category</p>
        <p className="text-slate-200">450/1000€</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
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
