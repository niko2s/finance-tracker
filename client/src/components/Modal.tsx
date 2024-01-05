import { ModalProps } from "../types";

const Modal = ({ id, onClose, children }: ModalProps) => {

  return (
    <>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
          </form>
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </>
  );




};

export default Modal;
