// components/TextEditor.tsx
"use client";

import React, { useState, KeyboardEvent } from "react";
import axios from "axios";

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

const TextEditor: React.FC<TextEditorProps> = ({
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal container */}
      <div className="relative w-[90vw] max-w-5xl mx-4">
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-indigo-500/30 rounded-2xl opacity-75 blur"></div>

        <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-600/40 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <h2 className="text-xl font-bold text-white">Code Editor</h2>
                  <p className="text-sm text-slate-400">
                    Create or edit your code snippet
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Live Editor</span>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6 space-y-6">
            {/* Input fields row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name input */}
              <div className="relative group">
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
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
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter a descriptive name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Language input */}
              <div className="relative group">
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
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
                  Programming Language
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="javascript, python, css..."
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Code textarea */}
            <div className="relative group">
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
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
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Lines: {code.split("\n").length}</span>
                  <span>Characters: {code.length}</span>
                </div>
              </label>

              <div className="relative">
                {/* Gradient border for textarea */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>

                <textarea
                  className="relative w-full h-[40vh] min-h-[300px] p-4 bg-slate-800/80 border border-slate-600/40 rounded-xl text-white placeholder-slate-400 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400"
                  placeholder={actualPlaceholder}
                  value={code}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="bg-slate-800/60 backdrop-blur-sm border-t border-slate-600/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">
                    Ctrl+S
                  </kbd>
                  <span>to save</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition-colors duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={handleSaveCode}
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Save Code</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating background elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
