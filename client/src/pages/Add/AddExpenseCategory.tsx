import { useState } from "react";
import AddForm from "../../components/AddForm";
import { useUser } from "../../components/context/UserContext";
import FormField from "../../components/FormField";

const AddExpenseCategory = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  const { user } = useUser();

  const postCategory = async () => {
    const api = "http://localhost:8080";
    const registerBody = {
      name: title,
      total: parseFloat(value),
      user_id: user?.id,
    };
    const jsonCategoryBody = JSON.stringify(registerBody);

    try {
      const response = await fetch(api + "/addCategory", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonCategoryBody,
      });

      if (!response.ok) {
        setStatus("Adding failed!");
        console.error("Network response not 200");
      }

      setStatus("Category " + title + " added successfully!");
      setTitle("");
      setValue("");
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("Adding failed!");
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && value) {
      postCategory();
      console.log("Submitted", { title, value });
    } else {
      console.warn("Value is required!");
    }
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
      </AddForm>
    </div>
  );
};

export default AddExpenseCategory;
