import { useId } from "react";

export interface FormFieldProps {
  name: string;
  info?: string;
  placeholder?: string;
  type: "number" | "text" | "password" | "email";
  required?: boolean;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const FormField = ({
  name,
  info,
  placeholder,
  type,
  required = false,
  state,
  setState,
}: FormFieldProps) => {
  const generatedId = useId();
  const inputName = name.toLowerCase().replace(/\s+/g, "-");
  const inputId = `${inputName}-${generatedId}`;
  const inputType = type === "number" ? "text" : type;

  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={inputId}>
        {name} {required && <span className="required-star">*</span>}
      </label>
      <input
        id={inputId}
        name={inputName}
        type={inputType}
        inputMode={type === "number" ? "decimal" : undefined}
        className="field-input"
        placeholder={placeholder}
        value={state}
        onChange={(e) => setState(e.target.value)}
        required={required}
      />
      {info && (
        <p className="field-help">{info}</p>
      )}
    </div>
  );
};

export default FormField;
