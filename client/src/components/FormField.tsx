import { useId } from "react";

export interface FormFieldProps {
  name: string;
  info?: string;
  type: "number" | "text" | "password" | "email";
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
  const generatedId = useId();
  const inputName = name.toLowerCase().replace(/\s+/g, "-");
  const inputId = `${inputName}-${generatedId}`;

  return (
    <div className="form-control w-full">
      <label className="label" htmlFor={inputId}>
        <span className="label-text">
          {name} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        id={inputId}
        name={inputName}
        type={type}
        className="input input-bordered w-full"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required={required}
        step={type === "number" ? "0.01" : undefined}
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
