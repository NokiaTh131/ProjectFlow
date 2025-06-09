"use client";

import CodeBlock from "@/app/components/CodeBlock";
import ToolCard from "@/app/components/tool-card";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import axios from "axios";
import { useParams } from "next/navigation";
import Text_editor from "@/app/components/text-editor";
import CreateTool from "@/app/components/create-tool";
import TextEditor from "@/app/components/code-editor";
import { Plus } from "lucide-react";

interface Task {
  id: number;
  name: string;
  status: "done" | "in-progress" | "not-started";
  time_spent: number;
  descriptions: TaskDescription[];
  taskTools: TaskTool[];
  taskMessages: TaskMessage[];
}

interface TaskDescription {
  id: number;
  description: string;
}

interface TaskTool {
  id: number;
  name: string;
  iconUrl: string;
  note: string;
  link: string;
}

interface TaskMessage {
  id: number;
  name: string;
  code: string;
  language: string;
}

function TaskDetail() {
  const [task, setTask] = useState<Task>();
  const taskId = useParams().task_id;
  const [description, setDescription] = useState("type some description.");
  const [reload, setReload] = useState(false);
  const [showCreateTool, setShowCreateTool] = useState(false);
  const [editingTool, setEditingTool] = useState<TaskTool | undefined>(
    undefined
  );
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TaskMessage | null>(
    null
  );

  const handleEditTool = (tool: TaskTool) => {
    setEditingTool(tool);
    setShowCreateTool(true);
  };

  const debouncedUpdateDescription = useMemo(
    () =>
      _.debounce(async (content: string) => {
        if (!task) return;
        try {
          if (task.descriptions.length > 0) {
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/task_description/${task?.descriptions[0].id}`,
              {
                description: content,
                taskId,
              }
            );
          }
        } catch (error) {
          console.error("Error updating description:", error);
        }
      }, 1000),
    [task, taskId]
  );

  const debouncedFetchTask = useMemo(
    () =>
      _.debounce(async (id) => {
        try {
          const task = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + "/tasks/task/" + id
          );
          setTask(task.data);
          if (task.data.descriptions.length > 0)
            setDescription(task.data.descriptions[0].description);
          else {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/task_description`,
              {
                description: "type some description.",
                taskId,
              }
            );
            setReload(true);
          }
        } catch (error) {
          console.error("Error fetching features:", error);
        }
      }, 100), // 300ms debounce
    [setTask, taskId]
  );

  useEffect(() => {
    if (taskId) {
      debouncedFetchTask(taskId);
    }
    setReload(false);
    return () => {
      debouncedFetchTask.cancel();
    };
  }, [taskId, debouncedFetchTask, reload, showCreateTool, showCreateCode]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-W-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-3">
                {task?.name}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-sm font-medium">Active</span>
            </div>
          </div>

          {/* Description Editor */}
          <div className="bg-slate-900/50 border border-slate-600/30 rounded-xl p-6 backdrop-blur-sm">
            {task && (
              <Text_editor
                content={description}
                onChange={(updatedContent) => {
                  setDescription(updatedContent);
                  debouncedUpdateDescription(updatedContent);
                }}
              />
            )}
          </div>
        </div>

        {/* Tools Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Tools Collection
              </h2>
              <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full">
                <span className="text-indigo-300 text-sm font-medium">
                  {task?.taskTools?.length || 0} tools
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateTool(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-2">
                <Plus />
                <span>Add Tool</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {task &&
              task.taskTools.map((tool, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 "></div>
                  <div className="relative bg-slate-800/80 border border-slate-600/30 rounded-xl p-1 backdrop-blur-sm">
                    <ToolCard {...tool} onEdit={handleEditTool} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
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
              <h2 className="text-2xl font-bold text-white">Code Snippets</h2>
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <span className="text-purple-300 text-sm font-medium">
                  {task?.taskMessages?.length || 0} snippets
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateCode(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center space-x-2">
                <Plus />
                <span>Add Code</span>
              </div>
            </button>
          </div>

          <div className="space-y-6">
            {task &&
              task.taskMessages
                .sort((a, b) => a.id - b.id)
                .map((snippet, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div
                      onDoubleClick={() => {
                        setShowCreateCode(true);
                        setEditingMessage(snippet);
                      }}
                      className="relative bg-slate-900/50 border border-slate-600/30 rounded-xl p-6 backdrop-blur-sm cursor-pointer hover:border-slate-500/50 transition-colors duration-300"
                    >
                      <CodeBlock
                        code={snippet.code}
                        language={snippet.language}
                        name={snippet.name}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="fixed bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Modals */}
        {showCreateCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
              <TextEditor
                taskId={taskId as string}
                onClose={() => {
                  setShowCreateCode(false);
                  setEditingMessage(null);
                }}
                isEdit={!!editingMessage}
                value={editingMessage?.code}
                initialName={editingMessage?.name}
                initialLanguage={editingMessage?.language}
                messageId={editingMessage?.id?.toString()}
              />
            </div>
          </div>
        )}

        {showCreateTool && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-600 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
              <CreateTool
                taskId={taskId as unknown as number}
                exitClicked={(value) => {
                  setShowCreateTool(value);
                  if (!value) {
                    setEditingTool(undefined);
                  }
                }}
                editTool={editingTool}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskDetail />
    </Suspense>
  );
}
