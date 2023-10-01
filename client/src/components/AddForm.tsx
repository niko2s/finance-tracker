import { AddFormProps } from "../types";
import { useNavigate } from "react-router-dom";

const AddForm = ({
  title,
  handleSubmit,
  status,
  children,
  onClose,
}: AddFormProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <button
            onClick={handleClick}
            className="border border-solid rounded border-black p-1"
          >
            Go back
          </button>
          <h2 className="text-center text-xl">{title}</h2>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between p-3 border solid border-black rounded">
                {children}
              </div>

              <button
                type="submit"
                className="bg-blue-500 rounded mt-2 py-2 w-full"
              >
                Add
              </button>
              <p className="text-center">{status}</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddForm;
