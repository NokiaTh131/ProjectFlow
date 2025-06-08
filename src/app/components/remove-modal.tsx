"use client";

import { FC } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black border border-teal-100 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-teal-100 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-rose-300 mb-6">
          Are you sure you want to remove this?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-teal-100 text-teal-100 hover:bg-gray-300 hover:text-black transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white border border-rose-500 hover:bg-red-700 transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
