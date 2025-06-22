"use client";

import React, { useState } from "react";
import { Calendar, FolderPlus, AlertCircle, Plus, X } from "lucide-react";
import axios from "axios";
import { MarkGithubIcon } from "@primer/octicons-react";
import { useThemeClasses } from "./hooks/useThemeClasses";

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

  const ThemeClass = useThemeClasses();

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

      setTimeout(() => {
        exitClicked(false);
      }, 1000);
    } catch (error) {
      console.error(`Error creating project:`, error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${ThemeClass.bg.primary} border ${ThemeClass.border.primary} rounded-xl shadow-xl w-full max-w-md`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`p-6 border-b ${ThemeClass.border.primary}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${ThemeClass.bg.secondary} rounded-lg`}>
              <Plus className={`w-5 h-5 ${ThemeClass.text.primary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${ThemeClass.text.primary}`}>
              Create Project
            </h2>
          </div>
          <div
            onClick={handleExit}
            className="p-2 hover:scale-120 duration-120 cursor-pointer"
          >
            <X className={`w-5 h-5 ${ThemeClass.text.primary}`} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className={`flex items-center text-sm font-medium ${ThemeClass.text.secondary}`}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border transition-colors duration-200 ${
                ThemeClass.input.secondary
              }
              ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : `${ThemeClass.border.secondary} ${ThemeClass.border.focus}`
              } focus:outline-none`}
              placeholder="Enter project name"
            />
            {errors.name && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="githubUrl"
              className={`flex items-center text-sm font-medium ${ThemeClass.text.secondary}`}
            >
              <MarkGithubIcon className="w-4 h-4 mr-2" />
              GitHub URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border transition-colors duration-200 
              ${ThemeClass.input.secondary} 
                ${
                  errors.githubUrl
                    ? "border-red-500 focus:border-red-500"
                    : `${ThemeClass.border.secondary} ${ThemeClass.border.focus}`
                } focus:outline-none`}
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.githubUrl}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deadLine"
              className={`flex items-center text-sm font-medium ${ThemeClass.text.secondary}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Deadline
            </label>
            <input
              type="date"
              id="deadLine"
              name="deadLine"
              value={formData.deadLine}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full p-3 rounded-lg border transition-colors duration-200 
              ${ThemeClass.input.secondary} 
                ${
                  errors.deadLine
                    ? "border-red-500 focus:border-red-500"
                    : `${ThemeClass.border.secondary} ${ThemeClass.border.focus}`
                } focus:outline-none`}
            />
            {errors.deadLine && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.deadLine}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                submitStatus === "success"
                  ? "bg-green-600 text-white"
                  : submitStatus === "error"
                  ? "bg-red-600 text-white"
                  : isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : `${ThemeClass.bg.submit}`
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Created!
                </>
              ) : submitStatus === "error" ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Try Again
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
