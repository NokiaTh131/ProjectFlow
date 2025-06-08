import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FolderPlus, AlertCircle, Plus } from "lucide-react";
import axios from "axios";
import { MarkGithubIcon } from "@primer/octicons-react";

interface CrossProps {
  exitClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateProject({ exitClicked }: CrossProps) {
  const [formData, setFormData] = useState({
    name: "",
    githubUrl: "",
    deadLine: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    githubUrl: "",
    deadLine: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      githubUrl: "",
      deadLine: "",
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    }

    // Validate GitHub URL
    if (formData.githubUrl) {
      try {
        const url = new URL(formData.githubUrl);
        if (!url.hostname.includes("github.com")) {
          newErrors.githubUrl = "Must be a valid GitHub URL";
          isValid = false;
        }
      } catch {
        newErrors.githubUrl = "Must be a valid URL";
        isValid = false;
      }
    }

    // Validate deadline
    if (!formData.deadLine) {
      newErrors.deadLine = "Deadline is required";
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.deadLine);
      if (selectedDate < today) {
        newErrors.deadLine = "Deadline cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleExit = () => {
    exitClicked(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formattedData = {
        ...formData,
        deadLine: new Date(formData.deadLine),
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        formattedData
      );

      setSubmitStatus("success");

      // Wait for success animation then close
      setTimeout(() => {
        exitClicked(false);
      }, 1500);
    } catch (error) {
      console.error(`Error creating project:`, error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
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
      y: 50,
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
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.01,
      borderColor: "#14b8a6",
      boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: {
      scale: 1,
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
      onClick={handleExit}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-teal-200/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 text-white border-b border-teal-200/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Plus className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold">Create New Project</h2>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Project Name */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label
                htmlFor="name"
                className="flex items-center text-sm font-semibold text-teal-100"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Project Name
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-slate-800/50 border border-teal-200/20 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-0 focus:outline-none transition-all duration-200 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder="Enter your project name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* GitHub URL */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="githubUrl"
                className="flex items-center text-sm font-semibold text-teal-100"
              >
                <MarkGithubIcon className="w-4 h-4 mr-2" />
                GitHub URL{" "}
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-slate-800/50 border border-teal-200/20 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-0 focus:outline-none transition-all duration-200 ${
                  errors.githubUrl
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder="https://github.com/username/repo"
              />
              <AnimatePresence>
                {errors.githubUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.githubUrl}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Deadline */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="deadLine"
                className="flex items-center text-sm font-semibold text-teal-100"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Project Deadline
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type="date"
                id="deadLine"
                name="deadLine"
                value={formData.deadLine}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-4 rounded-xl bg-slate-800/50 border border-teal-200/20 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-0 focus:outline-none transition-all duration-200 ${
                  errors.deadLine
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <AnimatePresence>
                {errors.deadLine && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.deadLine}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                variants={buttonVariants}
                initial="idle"
                whileHover={!isSubmitting ? "hover" : "idle"}
                whileTap={!isSubmitting ? "tap" : "idle"}
                animate={isSubmitting ? "loading" : "idle"}
                className={`cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-teal-500/25 disabled:opacity-50 w-full disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                  submitStatus === "success"
                    ? "bg-green-400 text-white"
                    : submitStatus === "error"
                    ? "bg-red-400 border-2 text-white"
                    : isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Project...
                    </motion.div>
                  ) : submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Project Created!
                    </motion.div>
                  ) : submitStatus === "error" ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Try Again
                    </motion.div>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Create Project
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-xl" />
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CreateProject;
