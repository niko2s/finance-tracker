export interface FormFieldProps {
  name: string;
  info?: string;
  type: "number" | "text" | "password";
  required?: boolean;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const FormField = ({
  name,
  info,
  type,
  required = false,
  state,
  setState,
}: FormFieldProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {name} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        className="input input-bordered w-full"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required={required}
      />
      {info && (
        <label className="label">
          <span className="label-text-alt">{info}</span>
        </label>
      )}
    </div>
  );
};

export default FormField;
