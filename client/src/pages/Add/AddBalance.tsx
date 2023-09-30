import { useState } from "react";
import AddForm from "../../components/AddForm";
import { useUser } from "../../components/context/UserContext";

const AddBalance = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value) {
      console.log("Submitted", { title, value });
    } else {
      console.warn("Value is required!");
    }
  };

  return (
    <AddForm title="test" handleSubmit={handleSubmit} status ="">
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-solid rounded "
        />
      </label>

      <div className="pl-4">
        <label className="inline-block">
          Value (required):
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="border border-solid rounded "
          />
        </label>
        <label>Current balance: {user?.balance}€</label>
      </div>
    </AddForm>
  );
};

export default AddBalance;
