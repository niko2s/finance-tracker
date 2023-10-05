import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Expense } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

const ExpenseCategory = () => {
  const { id } = useParams();
  const customFetch = useCustomFetch();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("ID parameter is missing"); //should not happen
        }

        const response = await customFetch(apiPaths.expensesByCategory(id), {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as Expense[];

        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!expenses && (
        <p className="text-lg font-semibold text-center mt-8">
          No expenses yet!
        </p>
      )}
      {!!expenses && (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between py-2 border-b border-base-content text-lg font-semibold mt-8">
            <span>Title</span>
            <span>Value</span>
          </div>
          <ul className="divide-y divide-base-content">
            {expenses.map((e: Expense) => {
              return (
                <li key={e.id} className="flex justify-between py-4">
                  <span className="text-lg">{e.title}</span>
                  <span className="text-lg">{e.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default ExpenseCategory;
