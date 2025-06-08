"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";

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

    // Simulate API call delay for better UX
    setTimeout(() => {
      onCreate(name.trim());
      setName("");
      setError("");
      setIsLoading(false);
      onClose();
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const inputVariants = {
    focus: {
      scale: 1.01,
      borderColor: "#14b8a6",
      boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-teal-200/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyPress}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 animate-pulse" />

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-teal-200/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <Plus className="w-5 h-5 text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Create {Label}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-teal-100">
                  {Label} Name
                </label>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError("");
                  }}
                  className="w-full p-4 rounded-xl bg-slate-800/50 border border-teal-200/20 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-0 focus:outline-none transition-all duration-200"
                  placeholder={`Enter ${Label.toLowerCase()} name...`}
                  variants={inputVariants}
                  whileFocus="focus"
                  disabled={isLoading}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 text-rose-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <motion.button
                  onClick={handleSubmit}
                  disabled={isLoading || !name.trim()}
                  className="flex-1 px-4 py-3 w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create {Label}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFeatureModal;
