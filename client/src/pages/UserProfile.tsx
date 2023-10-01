import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { useUser } from "../components/context/UserContext";
import { Link } from "react-router-dom";
import { ExpenseOverview } from "../types";

const UserProfile = () => {
  const { user } = useUser();
  const [expenseOverviews, setExpenseOverviews] = useState<ExpenseOverview[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as ExpenseOverview[];
        console.log(data);
        setExpenseOverviews(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-4 m-2">
        <p>Logged in as {user?.username}</p>

        <div className="flex gap-5">
          <p>Balance: {user?.balance}</p>
          <Link to="/add/balance" className="border solid">
            Add balance
          </Link>
        </div>
      </div>

      <div className="my-3">
        <Link
          to="/add/category"
          className="border solid border-black p-2 rounded"
        >
          Add a new expense category
        </Link>
      </div>

      <ul className="flex flex-wrap items-center justify-center">
        {expenseOverviews?.map((ec: ExpenseOverview) => {
          return (
            <li key={ec.category_id} className="w-96 h-48 mx-2">
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
