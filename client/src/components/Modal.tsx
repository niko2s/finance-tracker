import { ModalProps } from "../types";

const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
      <div className="bg-white rounded p-8">
        {children}
      </div>
    </div>
  );
};

export default Modal;
