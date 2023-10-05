import { useState } from "react";
import AddForm from "../components/AddForm";
import { useUser } from "../context/UserContext";
import FormField from "../components/FormField";

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
    <div className="mt-6">
      <AddForm title="Add balance" handleSubmit={handleSubmit} status="">
        <FormField name="Title" type="text" state={title} setState={setTitle} />
        <FormField
          name="Value"
          info={`Current balance: ${user?.balance}€`}
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
