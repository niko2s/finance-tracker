import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Expense } from "../types";

const ExpenseCategory = () => {
  const { id } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as Expense[];
        console.log(data);
        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!expenses && <p>No expenses yet!</p>}
      {!!expenses && (
        <ul>
          {expenses.map((e: Expense) => {
            return (
              <li key={e.id}>
                <p>
                  Title: {e.title} Value: {e.value}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ExpenseCategory;
