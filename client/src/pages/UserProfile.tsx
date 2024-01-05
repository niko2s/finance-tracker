import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ExpenseOverview } from "../types";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";

const UserProfile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const customFetch = useCustomFetch();
  const [expenseOverviews, setExpenseOverviews] = useState<ExpenseOverview[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {

      // When user logged out, do not fetch
      if (!user) {
        return;
      }

      try {
        const response = await customFetch(apiPaths.categories, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as ExpenseOverview[];
        setExpenseOverviews(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await customFetch(apiPaths.logout, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      setUser(null);
      navigate("/login");
      
    } catch (error) {
      console.error("Log out failed ", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-end m-2">
        <div className="flex mb-6">
          <p>Logged in as {user?.username}</p>
          <button
            className="btn btn-xs btn-outline items-center rounded ml-2"
            onClick={handleLogout}
          >
            <i className="material-icons">logout</i>
          </button>
        </div>
        <div className="flex">
          <p>{user?.balance} €</p>
          <Link
            to="/add-balance"
            className="btn btn-xs btn-outline items-center rounded ml-2 "
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>

      <div className="my-3 flex justify-center">
        <Link
          to="/add-expense-category"
          className="btn inline-flex items-center border solid border-primary p-2 rounded"
        >
          <i className="material-icons">add</i>
          <span>Category</span>
        </Link>
      </div>

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
