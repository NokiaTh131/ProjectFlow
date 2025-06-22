"use client";

import CodeBlock from "@/app/components/CodeBlock";
import ToolCard from "@/app/components/tool-card";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Text_editor from "@/app/components/text-editor";
import CreateTool from "@/app/components/create-tool";
import CodeEditor from "@/app/components/code-editor";
import {
  Plus,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  Settings,
  Code2,
  BookOpen,
  Grid3X3,
  List,
  Search,
} from "lucide-react";
import { useThemeClasses } from "../../../../hooks/useThemeClasses";
import ThemeToggle from "../../../../components/ThemeToggle";

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
  const projectId = useParams().id;
  const router = useRouter();
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
  const [activeTab, setActiveTab] = useState("description");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const themeClasses = useThemeClasses();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return themeClasses.status.successDark;
      case "in-progress":
        return themeClasses.status.warningDark;
      default:
        return `${themeClasses.bg.tertiary} ${themeClasses.text.secondary} ${themeClasses.border.primary}`;
    }
  };

  const filteredTools =
    task?.taskTools?.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.note.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredSnippets =
    task?.taskMessages?.filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div
      className={`min-h-screen ${themeClasses.bg.secondary} transition-colors duration-300`}
    >
      {/* Enhanced Header with Navigation */}
      <div
        className={`${themeClasses.bg.primary} ${themeClasses.border.primary} border-b sticky top-0 z-40 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/project/${projectId}`)}
                className={`w-10 h-10 ${themeClasses.bg.tertiary} ${themeClasses.bg.hover} rounded-lg flex items-center justify-center transition-colors duration-200`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${themeClasses.text.secondary}`}
                />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${themeClasses.button.primary} rounded-xl flex items-center justify-center transition-colors duration-300`}
                >
                  <svg
                    className={`w-6 h-6 text-white`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    className={`text-xl font-semibold ${themeClasses.text.primary} transition-colors duration-300`}
                  >
                    {task?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    {task?.status && getStatusIcon(task.status)}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        task?.status || "not-started"
                      )} transition-colors duration-300`}
                    >
                      {task?.status?.replace("-", " ") || "Not Started"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted}`}
                />
                <input
                  type="text"
                  placeholder="Search tools & snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 ${themeClasses.input.secondary} rounded-lg text-sm ${themeClasses.ring.primary} transition-all duration-200 w-64`}
                />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div
            className={`${themeClasses.border.primary} border-b transition-colors duration-300`}
          >
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "description", label: "Description", icon: BookOpen },
                {
                  id: "tools",
                  label: "Tools",
                  icon: Settings,
                  count: task?.taskTools?.length,
                },
                {
                  id: "code",
                  label: "Code Snippets",
                  icon: Code2,
                  count: task?.taskMessages?.length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? `${themeClasses.button.tab}`
                        : `border-transparent ${
                            themeClasses.text.secondary
                          } ${themeClasses.text.primary.replace(
                            "text-",
                            "hover:text-"
                          )} ${themeClasses.border.secondary.replace(
                            "border-",
                            "hover:border-"
                          )}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                          activeTab === tab.id
                            ? themeClasses.button.primary
                            : `${themeClasses.bg.tertiary} ${themeClasses.text.secondary}`
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div
              className={`${themeClasses.bg.card} ${themeClasses.border.primary} border rounded-xl p-6 ${themeClasses.shadow.sm} transition-colors duration-300`}
            >
              <div className="mb-4">
                <h2
                  className={`text-lg font-semibold ${themeClasses.text.primary} mb-2 transition-colors duration-300`}
                >
                  Task Description
                </h2>
                <p
                  className={`${themeClasses.text.secondary} text-sm transition-colors duration-300`}
                >
                  Document your task details, requirements, and progress notes.
                </p>
              </div>
              <div
                className={`${themeClasses.bg.tertiary} ${themeClasses.border.primary} border rounded-lg transition-colors duration-300`}
              >
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
          )}

          {/* Tools Tab */}
          {activeTab === "tools" && (
            <div className="space-y-4">
              <div
                className={`${themeClasses.bg.card} ${themeClasses.border.primary} border rounded-xl p-6 ${themeClasses.shadow.sm} transition-colors duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className={`text-lg font-semibold ${themeClasses.text.primary} transition-colors duration-300`}
                    >
                      Tools & Resources
                    </h2>
                    <p
                      className={`${themeClasses.text.secondary} text-sm mt-1 transition-colors duration-300`}
                    >
                      Manage tools and resources for this task
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1 ${themeClasses.bg.tertiary} rounded-lg p-1 transition-colors duration-300`}
                    >
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                          viewMode === "grid"
                            ? `${themeClasses.bg.card} ${themeClasses.shadow.sm} ${themeClasses.text.primary}`
                            : `${
                                themeClasses.text.muted
                              } ${themeClasses.text.secondary.replace(
                                "text-",
                                "hover:text-"
                              )}`
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                          viewMode === "list"
                            ? `${themeClasses.bg.card} ${themeClasses.shadow.sm} ${themeClasses.text.primary}`
                            : `${
                                themeClasses.text.muted
                              } ${themeClasses.text.secondary.replace(
                                "text-",
                                "hover:text-"
                              )}`
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowCreateTool(true)}
                      className={`${themeClasses.button.primary} px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Tool</span>
                    </button>
                  </div>
                </div>

                {filteredTools.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`w-16 h-16 ${themeClasses.bg.tertiary} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}
                    >
                      <Settings
                        className={`w-8 h-8 ${themeClasses.text.muted} transition-colors duration-300`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium ${themeClasses.text.primary} mb-2 transition-colors duration-300`}
                    >
                      No tools yet
                    </h3>
                    <p
                      className={`${themeClasses.text.muted} mb-6 transition-colors duration-300`}
                    >
                      Add tools and resources to help with this task
                    </p>
                    <button
                      onClick={() => setShowCreateTool(true)}
                      className={`${themeClasses.button.primary} px-6 py-3 rounded-lg font-medium transition-colors duration-200`}
                    >
                      Add First Tool
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
                        : "flex flex-col gap-3"
                    }
                  >
                    {filteredTools.map((tool, index) => (
                      <ToolCard
                        key={index}
                        {...tool}
                        viewMode={viewMode}
                        onEdit={handleEditTool}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Snippets Tab */}
          {activeTab === "code" && (
            <div className="space-y-4">
              <div
                className={`${themeClasses.bg.card} ${themeClasses.border.primary} border rounded-xl p-6 ${themeClasses.shadow.sm} transition-colors duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className={`text-lg font-semibold ${themeClasses.text.primary} transition-colors duration-300`}
                    >
                      Code Snippets
                    </h2>
                    <p
                      className={`${themeClasses.text.secondary} text-sm mt-1 transition-colors duration-300`}
                    >
                      Store and manage code snippets for this task
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateCode(true)}
                    className={`${themeClasses.button.primary} px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Snippet</span>
                  </button>
                </div>

                {filteredSnippets.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`w-16 h-16 ${themeClasses.bg.tertiary} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}
                    >
                      <Code2
                        className={`w-8 h-8 ${themeClasses.text.muted} transition-colors duration-300`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium ${themeClasses.text.primary} mb-2 transition-colors duration-300`}
                    >
                      No code snippets yet
                    </h3>
                    <p
                      className={`${themeClasses.text.muted} mb-6 transition-colors duration-300`}
                    >
                      Add code snippets to document solutions and examples
                    </p>
                    <button
                      onClick={() => setShowCreateCode(true)}
                      className={`${themeClasses.button.primary} px-6 py-3 rounded-lg font-medium transition-colors duration-200`}
                    >
                      Add First Snippet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSnippets
                      .sort((a, b) => a.id - b.id)
                      .map((snippet, index) => (
                        <div key={index} className="group">
                          <div
                            onDoubleClick={() => {
                              setShowCreateCode(true);
                              setEditingMessage(snippet);
                            }}
                            className={`${themeClasses.bg.tertiary} ${themeClasses.border.primary} ${themeClasses.border.hover} border rounded-lg transition-colors duration-200 overflow-hidden cursor-pointer`}
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <button
          onClick={() => setShowCreateCode(true)}
          className={`w-14 h-14 ${themeClasses.button.primary} rounded-full ${themeClasses.shadow.lg} hover:shadow-xl transition-all duration-200 flex items-center justify-center group`}
          title="Add Code Snippet"
        >
          <Code2 className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowCreateTool(true)}
          className={`w-14 h-14 ${themeClasses.button.secondary} ${themeClasses.border.primary} border-2 ${themeClasses.border.hover} rounded-full ${themeClasses.shadow.lg} hover:shadow-xl transition-all duration-200 flex items-center justify-center group`}
          title="Add Tool"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      {showCreateCode && (
        <div
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50`}
        >
          <div
            className={`${themeClasses.bg.card} ${themeClasses.border.primary} border rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto ${themeClasses.shadow.lg} transition-colors duration-300`}
          >
            <CodeEditor
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
        <div
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50`}
        >
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
      )}
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
