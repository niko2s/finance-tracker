import ExpenseCard from "../components/ExpenseCard";
import { useUser } from "../components/context/UserContext";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useUser();

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

      <Link to="/add/category" className="border solid border-black p-2 rounded">
        Add a new expense category
      </Link>
      <ExpenseCard />
    </div>
  );
};

export default UserProfile;
