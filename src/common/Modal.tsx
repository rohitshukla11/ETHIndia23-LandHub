// Modal.tsx
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div >
      {isOpen && (
        <Fragment>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-8 max-w-md w-full mx-auto rounded shadow-lg z-50">
              {children}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Modal;
