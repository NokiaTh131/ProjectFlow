import React, { useEffect, useState } from "react";
import {
  X,
  Trash,
  Hammer,
  Link as LinkIcon,
  FileImage,
  FileText,
} from "lucide-react";

import axios from "axios";

interface CreateToolProps {
  taskId: number;
  exitClicked: React.Dispatch<React.SetStateAction<boolean>>;
  editTool?: {
    id: number;
    name: string;
    iconUrl: string;
    note: string;
    link: string;
  };
}

interface ToolFormData {
  name: string;
  iconUrl: string;
  note: string;
  link: string;
}

function CreateTool({ exitClicked, taskId, editTool }: CreateToolProps) {
  const [formData, setFormData] = useState<ToolFormData>({
    name: "",
    iconUrl: "",
    note: "",
    link: "",
  });

  useEffect(() => {
    if (editTool) {
      setFormData({
        name: editTool.name,
        iconUrl: editTool.iconUrl,
        note: editTool.note,
        link: editTool.link,
      });
    }
  }, [editTool]);

  const [errors, setErrors] = useState({
    name: "",
    iconUrl: "",
    note: "",
    link: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      id: "",
      name: "",
      iconUrl: "",
      note: "",
      link: "",
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Tool name is required";
      isValid = false;
    }

    // Validate icon URL
    if (!formData.iconUrl.trim()) {
      newErrors.iconUrl = "Icon URL is required";
      isValid = false;
    } else {
      try {
        new URL(formData.iconUrl);
      } catch {
        newErrors.iconUrl = "Must be a valid URL";
        isValid = false;
      }
    }

    // Validate link
    if (!formData.link.trim()) {
      newErrors.link = "Tool link is required";
      isValid = false;
    } else {
      try {
        new URL(formData.link);
      } catch {
        newErrors.link = "Must be a valid URL";
        isValid = false;
      }
    }

    // Validate note
    if (!formData.note.trim()) {
      newErrors.note = "Tool description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleExit = () => {
    exitClicked(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id" ? parseInt(value) || 0 : value,
    }));
  };

  const handleDeleteTool = async () => {
    try {
      if (!editTool) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/task_tool/${editTool.id}`
      );
      exitClicked(false);
    } catch (error) {
      console.error(
        editTool ? "Error updating tool:" : "Error creating tool:",
        error
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (editTool) {
          // Update existing tool
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/task_tool/${editTool.id}`,
            {
              name: formData.name,
              iconUrl: formData.iconUrl,
              note: formData.note,
              link: formData.link,
              taskId: taskId,
            }
          );
          console.log("Tool updated successfully");
        } else {
          // Create new tool
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task_tool`, {
            name: formData.name,
            iconUrl: formData.iconUrl,
            note: formData.note,
            link: formData.link,
            taskId: taskId,
          });
          console.log("Tool created successfully");
        }
        exitClicked(false);
      } catch (error) {
        console.error(
          editTool ? "Error updating tool:" : "Error creating tool:",
          error
        );
      }
    }
  };

  return (
    <div className="fixed z-50 w-[500px] max-h-[800px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="group relative w-full">
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-75 blur"></div>

        <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-600/40 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/30 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg text-white text-sm font-medium shadow-lg">
                  <Hammer className="w-4 h-4" />
                  <span>Tool Manager</span>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {editTool ? "Edit Tool" : "Create New Tool"}
                </h2>
              </div>
              <div className="flex gap-2">
                {editTool && (
                  <button
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                    onClick={handleDeleteTool}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}
                <button
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/75 text-slate-300 hover:text-white transition-colors"
                  onClick={handleExit}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Tool Name Field */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Tool Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hammer className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/60 border ${
                        errors.name ? "border-rose-500" : "border-slate-600"
                      } text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                      placeholder="Enter tool name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-rose-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Icon URL Field */}
                <div className="relative">
                  <label
                    htmlFor="iconUrl"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Icon URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileImage className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      id="iconUrl"
                      name="iconUrl"
                      value={formData.iconUrl}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/60 border ${
                        errors.iconUrl ? "border-rose-500" : "border-slate-600"
                      } text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  {errors.iconUrl && (
                    <p className="mt-1 text-rose-500 text-sm">
                      {errors.iconUrl}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="relative">
                  <label
                    htmlFor="note"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={3}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/60 border ${
                        errors.note ? "border-rose-500" : "border-slate-600"
                      } text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                      placeholder="Enter tool description"
                    />
                  </div>
                  {errors.note && (
                    <p className="mt-1 text-rose-500 text-sm">{errors.note}</p>
                  )}
                </div>

                {/* Tool Link Field */}
                <div className="relative">
                  <label
                    htmlFor="link"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Tool Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/60 border ${
                        errors.link ? "border-rose-500" : "border-slate-600"
                      } text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                      placeholder="https://example.com/tool"
                    />
                  </div>
                  {errors.link && (
                    <p className="mt-1 text-rose-500 text-sm">{errors.link}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {editTool ? "Save Changes" : "Create Tool"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-slate-800/60 backdrop-blur-sm border-t border-slate-600/30 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTool;
