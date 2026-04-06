import { AddFormProps } from "../types";

const AddForm = ({
  title,
  handleSubmit,
  status,
  submitLabel = "Add",
  children
}: AddFormProps) => {
  const statusLower = status.toLowerCase();
  const statusClass = !status
    ? ""
    : /(fail|error|invalid|required|wrong)/i.test(statusLower)
      ? "status-pill status-pill-error"
      : /(success|added|registered)/i.test(statusLower)
        ? "status-pill status-pill-success"
        : "status-pill status-pill-neutral";

  return (
    <div className="form-shell">
      <div className="form-frame">
        <h2 className="form-title">{title}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          {children}
          <button type="submit" className="gradient-btn">
            {submitLabel}
          </button>
          {status && <p className={statusClass}>{status}</p>}
        </form>
      </div>
    </div>
  );
};
export default AddForm;
