import { ModalProps } from "../types";

const Modal = ({ id, onClose, children }: ModalProps) => {
  const handleClose = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    dialog?.close();
    onClose();
  };

  return (
    <dialog id={id} className="ft-modal" onCancel={handleClose}>
      <div className="ft-modal-inner">
        <div className="form-grid">
          <button type="button" className="ft-modal-close" onClick={handleClose} aria-label="Close modal">
            x
          </button>
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
