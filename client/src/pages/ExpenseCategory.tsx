import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Expense } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

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
    <>
      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
      {!isLoading && error && (
        <p className="text-lg font-semibold text-center mt-8 text-error">
          {error}
        </p>
      )}
      {!isLoading && !error && expenses.length === 0 && (
        <p className="text-lg font-semibold text-center mt-8">
          No expenses yet!
        </p>
      )}
      {!isLoading && !error && expenses.length > 0 && (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between py-2 border-b border-base-content text-lg font-semibold mt-8">
            <span>Title</span>
            <span>Value</span>
          </div>
          <ul className="divide-y divide-base-content">
            {expenses.map((e: Expense) => {
              return (
                <li key={e.id} className="flex justify-between py-4">
                  <span className="text-lg">{e.title || "Untitled"}</span>
                  <span className="text-lg">{e.value} €</span>
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
