import { AddFormProps } from "../types";

const AddForm = ({
  title,
  handleSubmit,
  status,
  children
}: AddFormProps) => {

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-md w-full px-4">
          <h2 className="text-2xl text-center font-semibold my-3">{title}</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center space-y-4">
              {children}
              <button type="submit" className="btn btn-primary rounded w-full">
                Add
              </button>
            </div>

            <p className="text-center mt-2">{status}</p>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddForm;
