import { useState } from "react";
import AddForm from "../components/AddForm";
import { useUser } from "../context/UserContext";
import FormField from "../components/FormField";
import apiPaths from "../api/paths";
import useCustomFetch from "../hooks/customFetch";

const AddBalance = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customFetch = useCustomFetch();

  const { balance, setUpdateBalance } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setStatus("Please enter a value greater than 0.");
      return;
    }

    const addBalanceBody = {
      title,
      value: numericValue,
    };

    const jsonAddBalanceBody = JSON.stringify(addBalanceBody);

    try {
      setIsSubmitting(true);
      setStatus("");

      const response = await customFetch(apiPaths.deposit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonAddBalanceBody,
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setTitle("");
      setValue("");
      setUpdateBalance((prev) => !prev);
      setStatus("Balance added successfully!");
    } catch (error) {
      setStatus("Failed to add balance.");
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
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
        {isSubmitting && <p className="text-sm">Submitting...</p>}
      </AddForm>
    </div>
  );
};

export default AddBalance;
