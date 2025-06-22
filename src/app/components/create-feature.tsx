"use client";

import { FC, useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useThemeClasses } from '../hooks/useThemeClasses';

interface CreateFeatureModalProps {
  Label: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateFeatureModal: FC<CreateFeatureModalProps> = ({
  Label,
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useThemeClasses();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    onCreate(name.trim());
    setName("");
    setError("");
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative ${theme.bg.card} ${theme.border.primary} border rounded-lg shadow-xl w-full max-w-md transition-colors duration-300`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyPress}
      >
        <div className={`flex items-center justify-between p-4 border-b ${theme.border.primary} transition-colors duration-300`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${theme.bg.tertiary} rounded-lg transition-colors duration-300`}>
              <Plus className={`w-4 h-4 ${theme.text.secondary} transition-colors duration-300`} />
            </div>
            <h2 className={`text-lg font-medium ${theme.text.primary} transition-colors duration-300`}>
              Create {Label}
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${theme.text.secondary} transition-colors duration-300`}>
              {Label} Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className={`w-full p-3 rounded-lg ${theme.input.base} transition-colors duration-300`}
              placeholder={`Enter ${Label.toLowerCase()} name...`}
              disabled={isLoading}
            />

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !name.trim()}
              className={`flex-1 px-4 py-2 ${theme.button.primary} rounded-lg transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              {isLoading ? (
                <>
                  <div className={`w-4 h-4 border-2 ${theme.text.inverse.includes('text-white') ? 'border-white/30 border-t-white' : 'border-gray-900/30 border-t-gray-900'} rounded-full animate-spin`}></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create {Label}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureModal;
