"use client";

import { FC } from "react";
import { useThemeClasses } from '../hooks/useThemeClasses';

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
  const theme = useThemeClasses();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className={`${theme.bg.card} ${theme.border.primary} border rounded-lg p-6 w-full max-w-md ${theme.shadow.lg} transition-colors duration-300`}>
        <h2 className={`text-lg font-medium ${theme.text.primary} mb-4 transition-colors duration-300`}>
          Confirm Deletion
        </h2>
        <p className={`${theme.text.secondary} mb-6 transition-colors duration-300`}>
          Are you sure you want to delete this? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${theme.border.primary} ${theme.text.secondary} ${theme.bg.hover} border rounded-lg transition-colors duration-300`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
