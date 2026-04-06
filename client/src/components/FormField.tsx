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
    <div className="field-wrap">
      <label className="field-label" htmlFor={inputId}>
        {name} {required && <span className="required-star">*</span>}
      </label>
      <input
        id={inputId}
        name={inputName}
        type={type}
        className="field-input"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required={required}
        step={type === "number" ? "0.01" : undefined}
      />
      {info && (
        <p className="field-help">{info}</p>
      )}
    </div>
  );
};

export default FormField;
