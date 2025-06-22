// components/TextEditor.tsx
"use client";

import React, { useState, KeyboardEvent } from "react";
import axios from "axios";
import { useThemeClasses } from "../hooks/useThemeClasses";

type TextEditorProps = {
  placeholder?: string;
  onChange?: (code: string) => void;
  value?: string;
  onClose?: () => void;
  taskId: string;
  isEdit?: boolean;
  initialName?: string;
  initialLanguage?: string;
  messageId?: string;
};

const CodeEditor: React.FC<TextEditorProps> = ({
  placeholder,
  onChange,
  value,
  onClose,
  taskId,
  isEdit = false,
  initialName = "",
  initialLanguage = "",
  messageId,
}) => {
  const theme = useThemeClasses();
  const defaultPlaceholder = isEdit
    ? "Press Ctrl+Enter to Save.\nPress Ctrl+Del to Delete.\nPress Ctrl+Backspace to exit."
    : "Press Ctrl+Enter to Save.\nPress Ctrl+Backspace to exit.";
  const [code, setCode] = useState(value || "");
  const [name, setName] = useState(initialName);
  const [language, setLanguage] = useState(initialLanguage);

  const actualPlaceholder = placeholder || defaultPlaceholder;
  const handleSaveCode = async () => {
    try {
      if (isEdit) {
        // Update existing message
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/task_message/${messageId}`,
          {
            name,
            language,
            code,
            taskId,
          }
        );
      } else {
        // Create new message
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task_message`, {
          name,
          language,
          code,
          taskId,
        });
      }
      if (onClose) onClose();
    } catch (error) {
      console.log("Save failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/task_message/${messageId}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey && e.key === "s") || (e.ctrlKey && e.key === "S")) {
      e.preventDefault();
      handleSaveCode();
    }
    if (e.ctrlKey && e.key === "Backspace") {
      e.preventDefault();
      if (onClose) onClose();
    }
    if (isEdit && e.ctrlKey && e.key === "Delete") {
      e.preventDefault();
      handleDelete();
      if (onClose) onClose();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className={`relative ${theme.bg.card} ${theme.border.primary} border rounded-lg ${theme.shadow.lg} overflow-hidden transition-colors duration-300`}
      >
        {/* Header */}
        <div
          className={`${theme.bg.secondary} ${theme.border.primary} border-b px-6 py-4 transition-colors duration-300`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${theme.button.primary} rounded-lg flex items-center justify-center transition-colors duration-300`}
              >
                <svg
                  className={`w-5 h-5 text-white transition-colors duration-300`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold ${theme.text.primary} transition-colors duration-300`}
                >
                  Code Editor
                </h2>
                <p
                  className={`text-sm ${theme.text.muted} transition-colors duration-300`}
                >
                  Create or edit your code snippet
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div
              className={`flex items-center gap-2 text-sm ${theme.text.muted} transition-colors duration-300`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Editor</span>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6 space-y-6">
          {/* Input fields row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name input */}
            <div className="relative">
              <label
                className={`text-sm font-medium ${theme.text.secondary} mb-2 flex items-center gap-2 transition-colors duration-300`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Snippet Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 ${theme.input.base} rounded-lg transition-all duration-300`}
                placeholder="Enter a descriptive name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Language input */}
            <div className="relative">
              <label
                className={`text-sm font-medium ${theme.text.secondary} mb-2 flex items-center gap-2 transition-colors duration-300`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Language
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 ${theme.input.base} rounded-lg transition-all duration-300`}
                placeholder="javascript, python, css..."
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
          </div>

          {/* Code textarea */}
          <div className="relative">
            <label
              className={`text-sm font-medium ${theme.text.secondary} mb-2 flex items-center justify-between transition-colors duration-300`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Code Content
              </div>
              <div
                className={`flex items-center gap-4 text-xs ${theme.text.muted} transition-colors duration-300`}
              >
                <span>Lines: {code.split("\n").length}</span>
                <span>Characters: {code.length}</span>
              </div>
            </label>

            <textarea
              className={`w-full h-[40vh] min-h-[300px] p-4 ${theme.input.base} rounded-lg font-mono text-sm leading-relaxed resize-y transition-all duration-300`}
              placeholder={actualPlaceholder}
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Footer with actions */}
        <div
          className={`${theme.bg.secondary} ${theme.border.primary} border-t px-6 py-4 transition-colors duration-300`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-4 text-sm ${theme.text.muted} transition-colors duration-300`}
            >
              <div className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 ${theme.bg.tertiary} rounded text-xs transition-colors duration-300`}
                >
                  Ctrl+S
                </kbd>
                <span>to save</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`px-4 py-2 ${theme.button.secondary} rounded-lg transition-colors duration-300`}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${theme.button.primary} px-6 py-2 rounded-lg font-medium transition-colors duration-300`}
                onClick={handleSaveCode}
              >
                Save Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
