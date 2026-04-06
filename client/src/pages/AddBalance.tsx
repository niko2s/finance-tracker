import { useState } from "react";
import AddForm from "../components/AddForm";
import { useUser } from "../context/UserContext";
import FormField from "../components/FormField";
import apiPaths from "../api/paths";
import useCustomFetch from "../hooks/customFetch";
import { formatCentsToEuro, parseEuroInputToCents } from "../utils/money";
import { Link } from "react-router-dom";

const AddBalance = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customFetch = useCustomFetch();

  const { balance, setUpdateBalance } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueCents = parseEuroInputToCents(value);
    if (valueCents === null || valueCents <= 0) {
      setStatus("Please enter a valid amount with max 2 decimals.");
      return;
    }

    const addBalanceBody = {
      title,
      value: valueCents,
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
    <section className="page-section">
      <div className="form-page-header">
        <Link className="soft-btn" to="/dashboard">
          Back
        </Link>
        <p className="form-page-copy">
          Add money to your account balance. You can include a short title so it is easy to find later.
        </p>
      </div>
      <AddForm
        title="Add Balance"
        handleSubmit={handleSubmit}
        status={status}
        submitLabel="Confirm Deposit"
      >
        <FormField
          name="Title"
          info="Optional. Example: Salary, Transfer, Refund"
          placeholder="e.g. Salary"
          type="text"
          state={title}
          setState={setTitle}
        />
        <FormField
          name="Value"
          info={`Current balance: ${formatCentsToEuro(balance)} €`}
          placeholder="e.g. 2,500.00"
          type="number"
          required={true}
          state={value}
          setState={setValue}
        />
        {isSubmitting && <p className="subtle-copy">Submitting...</p>}
      </AddForm>
    </section>
  );
};

export default AddBalance;
