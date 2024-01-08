import { useState } from "react";
import AddForm from "../components/AddForm";
import { useUser } from "../context/UserContext";
import FormField from "../components/FormField";
import apiPaths from "../api/paths";

const AddBalance = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  const {balance, updateBalance , setUpdateBalance} = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value) {
      const addBalanceBody = {
        title,
        value: Number(value),
      };
  
      const jsonAddBalanceBody = JSON.stringify(addBalanceBody);
  
      try {
        const response = await fetch(apiPaths.deposit, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonAddBalanceBody,
        });
  
        if (!response.ok) {
          throw new Error("Network response not 200");
        } else {
          setTitle("");
          setValue("");
          setUpdateBalance(!updateBalance);
          setStatus("Balance added successfully!");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  return (
    <div className="mt-6">
      <AddForm title="Add balance" handleSubmit={handleSubmit} status={status}>
        <FormField name="Title" type="text" state={title} setState={setTitle} />
        <FormField
          name="Value"
          info={`Current balance: ${balance} €`}
          type="number"
          required={true}
          state={value}
          setState={setValue}
        />
      </AddForm>
    </div>
  );
};

export default AddBalance;
