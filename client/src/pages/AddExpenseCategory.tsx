import { useState } from "react";
import AddForm from "../components/AddForm";
import { useUser } from "../context/UserContext";
import FormField from "../components/FormField";
import useCustomFetch from "../hooks/customFetch";
import apiPaths from "../api/paths";
import { parseEuroInputToCents } from "../utils/money";

const AddExpenseCategory = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customFetch = useCustomFetch();
  const { user } = useUser();

  const postCategory = async (name: string, totalCents: number) => {
    if (!user) {
      setStatus("You must be logged in.");
      return;
    }

    const requestBody = {
      name,
      total: totalCents,
      user_id: user.id,
    };
    const jsonCategoryBody = JSON.stringify(requestBody);

    try {
      setIsSubmitting(true);
      setStatus("");

      const response = await customFetch(apiPaths.categories, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonCategoryBody,
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      setStatus(`Category ${name} added successfully!`);
      setTitle("");
      setValue("");
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("Adding failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const totalCents = parseEuroInputToCents(value);

    if (!trimmedTitle || totalCents === null || totalCents <= 0) {
      setStatus("Please enter a title and valid limit (max 2 decimals).");
      return;
    }

    void postCategory(trimmedTitle, totalCents);
  };

  return (
    <div className="mt-6">
      <AddForm
        title="Add new expense category"
        handleSubmit={handleSubmit}
        status={status}
      >
        <FormField
          name="Title"
          type="text"
          required={true}
          state={title}
          setState={setTitle}
        />
        <FormField
          name="Limit"
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

export default AddExpenseCategory;
