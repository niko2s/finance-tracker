import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { ExpenseOverview } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

const UserProfile = () => {
  const { user, updateBalance } = useUser();

  const customFetch = useCustomFetch();
  const [expenseOverviews, setExpenseOverviews] = useState<ExpenseOverview[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // When user logged out, do not fetch
      if (!user) {
        setExpenseOverviews([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await customFetch(apiPaths.categories, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as ExpenseOverview[] | null;
        setExpenseOverviews(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load categories.");
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [customFetch, updateBalance, user]);

  return (
    <div>
      <div className="my-3 flex justify-center">
        <Link
          to="/add-expense-category"
          className="btn inline-flex items-center border solid border-primary p-2 rounded"
        >
          <i className="material-icons">add</i>
          <span>Category</span>
        </Link>
      </div>

      {error && <p className="text-center text-error">{error}</p>}
      {isLoading && (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
      {!isLoading && !error && expenseOverviews.length === 0 && (
        <p className="text-center py-6">No expense categories yet.</p>
      )}

      <ul className="flex flex-wrap items-center justify-center">
        {expenseOverviews?.map((ec: ExpenseOverview) => {
          return (
            <li key={ec.category_id} className="w-96 h-48 mx-2 my-5">
              <ExpenseCard
                category_id={ec.category_id}
                name={ec.name}
                total={ec.total}
                expense_sum={ec.expense_sum}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserProfile;
