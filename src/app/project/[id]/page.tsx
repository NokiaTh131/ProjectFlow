"use client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import GitGraph from "@/app/components/git-graph";
import FeatureProgress from "@/app/components/features-progress";
import { useParams, useRouter } from "next/navigation";
import IssuesDisplay from "@/app/components/issues";
import axios from "axios";
import ConfirmDeleteModal from "@/app/components/remove-modal";
import CreateFeatureModal from "@/app/components/create-feature";
import _ from "lodash";
import { MarkGithubIcon } from "@primer/octicons-react";
import {
  Folder,
  Plus,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import ThemeToggle from "../../components/ThemeToggle";

interface Project {
  id: number;
  name: string;
  progress: number;
  githubUrl?: string;
  deadLine: Date;
  features: Feature[];
}

export interface Feature {
  id: number;
  name: string;
  tasks: Task[];
}

interface GitDetails {
  owner: string;
  repo: string;
}

export interface Task {
  id: number;
  name: string;
  status: "done" | "in-progress" | "not-started";
}

function Project() {
  const [mode, setMode] = useState<string>("features");
  const [project, setProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [gitDetails, setGitDetails] = useState<GitDetails>();
  const [reload, setReload] = useState(false);
  const themeClasses = useThemeClasses();

  const debouncedFetchProject = useMemo(
    () =>
      _.debounce(async (id) => {
        try {
          const project = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + "/projects/" + id
          );
          setProject(project.data);
          setGitDetails({
            owner: project.data.githubUrl?.split("/")[3],
            repo: project.data.githubUrl?.split("/")[4],
          });
        } catch (error) {
          console.error("Error fetching features:", error);
        }
      }, 100), // 300ms debounce
    [setProject, setGitDetails]
  );

  useEffect(() => {
    if (projectId) {
      setReload(false);
      debouncedFetchProject(projectId);
    }

    return () => {
      debouncedFetchProject.cancel();
    };
  }, [projectId, reload, debouncedFetchProject]);

  const handleAddFeature = async (name: string) => {
    // Logic to add a new feature
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/features`, {
        name,
        projectId: projectId as unknown as number,
      });
      setReload(true);
    } catch (error) {
      console.error("Error adding feature:", error);
    }
  };

  const handleAddTask = async (name: string) => {
    // Logic to add a new task
    if (activeFeatureId === null) {
      console.error("No active feature selected for task creation.");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        name,
        status: "not-started",
        featureId: activeFeatureId,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus =
      task.status == "done"
        ? "not-started"
        : task.status === "in-progress"
        ? "done"
        : "in-progress";
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        name: task.name,
        status: newStatus,
        featureId: activeFeatureId,
      });
      setReload(true);
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const handleDeleteFeatures = async (featureId: number) => {
    // Logic to delete features
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/features/${featureId}`
      );
      setReload(true);
    } catch (error) {
      console.error("Error deleting features:", error);
    }
  };

  const handleDeleteTasks = async (taskId: number) => {
    // Logic to delete tasks
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      setReload(true);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`
      );
      router.push("/");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg.primary} transition-colors duration-300`}
    >
      <div
        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} border-b transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`cursor-pointer w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-300`}
                onClick={() => router.push("/")}
              >
                <Folder className={`w-5 h-5 text-white`} />
              </div>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-semibold ${themeClasses.text.primary} transition-colors duration-300`}
                >
                  {project?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span
                    className={`${themeClasses.text.secondary} text-sm transition-colors duration-300`}
                  >
                    Active Project
                  </span>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div
            className={`inline-flex items-center gap-3 ${themeClasses.bg.tertiary} ${themeClasses.border.primary} border rounded-lg py-2 px-3 transition-colors duration-300`}
          >
            <MarkGithubIcon
              className={`w-4 h-4 ${themeClasses.text.secondary}`}
            />
            <a
              href={project?.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors flex items-center gap-2 text-sm`}
            >
              {project?.githubUrl?.replace("https://github.com/", "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-3">
            <div
              className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} border rounded-lg overflow-hidden ${themeClasses.shadow.sm} transition-colors duration-300`}
            >
              <div
                className={`p-6 ${themeClasses.bg.tertiary} ${themeClasses.border.primary} border-b transition-colors duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-300`}
                      >
                        {mode === "features" ? (
                          <Folder className={`w-5 h-5 text-white`} />
                        ) : (
                          <BarChart3 className={`w-5 h-5 text-white`} />
                        )}
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 ${themeClasses.bg.secondary}`}
                      ></div>
                    </div>
                    <div>
                      <h2
                        className={`text-xl font-semibold ${themeClasses.text.primary} transition-colors duration-300`}
                      >
                        {mode === "features"
                          ? "Features"
                          : project?.features.find(
                              (feature) => feature.id === activeFeatureId
                            )?.name ?? ""}
                      </h2>
                      <p
                        className={`${themeClasses.text.secondary} text-sm transition-colors duration-300`}
                      >
                        {mode === "features"
                          ? `${project?.features.length || 0} features total`
                          : `${
                              project?.features.find(
                                (f) => f.id === activeFeatureId
                              )?.tasks.length || 0
                            } tasks`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {mode === "tasks" && (
                      <button
                        onClick={() => setMode("features")}
                        className={`w-9 h-9 ${themeClasses.button.secondary} rounded-lg flex items-center justify-center transition-all duration-200`}
                      >
                        <ArrowLeft
                          className={`w-4 h-4 ${themeClasses.text.secondary}`}
                        />
                      </button>
                    )}

                    <button
                      onClick={() => setShowCreateModal(true)}
                      className={`w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center transition-all duration-200`}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {mode === "features"
                    ? project?.features.map((feature) => (
                        <div
                          key={feature.id}
                          className={`group ${themeClasses.bg.tertiary} ${themeClasses.border.primary} hover:${themeClasses.border.secondary} border rounded-lg p-4 transition-all duration-200`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className="flex items-center gap-3 cursor-pointer flex-1"
                              onClick={() => {
                                setMode("tasks");
                                setActiveFeatureId(feature.id);
                              }}
                            >
                              <div>
                                {feature.tasks.filter(
                                  (task) => task.status === "done"
                                ).length === feature.tasks.length &&
                                feature.tasks.length > 0 ? (
                                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div
                                    className={`w-8 h-8 ${themeClasses.button.secondary} rounded-lg flex items-center justify-center transition-colors duration-200`}
                                  >
                                    <Folder
                                      className={`w-4 h-4 ${themeClasses.text.secondary}`}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`${themeClasses.text.primary} font-medium transition-colors duration-300`}
                                >
                                  {feature.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <p
                                    className={`${themeClasses.text.secondary} text-sm transition-colors duration-300`}
                                  >
                                    {feature.tasks.length} tasks
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-12 h-2 ${
                                        themeClasses.bg.primary === "bg-white"
                                          ? "bg-gray-200"
                                          : "bg-gray-600"
                                      } rounded-full overflow-hidden transition-colors duration-300`}
                                    >
                                      <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{
                                          width: `${
                                            feature.tasks.length > 0
                                              ? (feature.tasks.filter(
                                                  (t) => t.status === "done"
                                                ).length /
                                                  feature.tasks.length) *
                                                100
                                              : 0
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span
                                      className={`text-xs ${themeClasses.text.secondary} transition-colors duration-300`}
                                    >
                                      {feature.tasks.length > 0
                                        ? Math.round(
                                            (feature.tasks.filter(
                                              (t) => t.status === "done"
                                            ).length /
                                              feature.tasks.length) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteFeatures(feature.id)}
                              className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))
                    : project?.features
                        .find((f) => f.id === activeFeatureId)
                        ?.tasks.sort((a, b) => a.id - b.id)
                        .map((task) => (
                          <div
                            key={task.id}
                            className={`group ${themeClasses.bg.tertiary} ${themeClasses.border.primary} hover:${themeClasses.border.secondary} border rounded-lg p-4 transition-all duration-200`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <button
                                  onClick={() => handleToggleTaskStatus(task)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
                                >
                                  {task.status === "done" ? (
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                  ) : task.status === "in-progress" ? (
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                      <Clock className="w-4 h-4 text-white" />
                                    </div>
                                  ) : (
                                    <div
                                      className={`w-8 h-8 ${themeClasses.button.secondary} rounded-lg flex items-center justify-center transition-colors duration-200`}
                                    >
                                      <Circle
                                        className={`w-4 h-4 ${themeClasses.text.secondary}`}
                                      />
                                    </div>
                                  )}
                                </button>

                                <div className="flex-1">
                                  <h3
                                    className={`${themeClasses.text.primary} font-medium cursor-pointer hover:text-blue-600 transition-colors`}
                                    onClick={() =>
                                      router.push(
                                        `${projectId}/task/${task.id}`
                                      )
                                    }
                                  >
                                    {task.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        task.status === "done"
                                          ? "bg-green-100 text-green-700"
                                          : task.status === "in-progress"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : themeClasses.bg.primary ===
                                            "bg-white"
                                          ? "bg-gray-100 text-gray-700"
                                          : "bg-gray-700 text-gray-300"
                                      }`}
                                    >
                                      {task.status.replace("-", " ")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteTasks(task.id)}
                                className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                </div>

                {gitDetails && gitDetails.owner && gitDetails.repo && (
                  <div
                    className={`mt-6 pt-6 ${themeClasses.border.primary} border-t transition-colors duration-300`}
                  >
                    <GitGraph owner={gitDetails.owner} repo={gitDetails.repo} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 col-span-3 lg:col-span-2">
            <div
              className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} border rounded-lg p-6 ${themeClasses.shadow.sm} transition-colors duration-300`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-300`}
                >
                  <BarChart3 className={`w-4 h-4 text-white`} />
                </div>
                <h3
                  className={`text-lg font-medium ${themeClasses.text.primary} transition-colors duration-300`}
                >
                  Progress Overview
                </h3>
              </div>
              <div className="space-y-6">
                <FeatureProgress
                  features={project?.features ?? []}
                  mode="Features"
                />
                <FeatureProgress
                  features={project?.features ?? []}
                  mode="Tasks"
                />
              </div>
            </div>

            {gitDetails && gitDetails.owner && gitDetails.repo && (
              <div
                className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} border rounded-lg p-6 ${themeClasses.shadow.sm} transition-colors duration-300`}
              >
                <IssuesDisplay
                  owner={gitDetails.owner}
                  repo={gitDetails.repo}
                  state="open"
                  perPage={20}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg px-6 py-3 text-red-700 hover:text-red-800 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
        </div>

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteProject}
        />

        {showCreateModal && (
          <div
            className={`fixed inset-0 ${
              themeClasses.bg.primary === "bg-white"
                ? "bg-black/20"
                : "bg-black/40"
            } backdrop-blur-sm flex items-center justify-center z-50 transition-colors duration-300`}
          >
            {mode === "features" ? (
              <CreateFeatureModal
                Label="Feature"
                isOpen={showCreateModal}
                onClose={() => {
                  setReload(true);
                  setShowCreateModal(false);
                }}
                onCreate={(name) => {
                  handleAddFeature(name);
                  setShowCreateModal(false);
                  setReload(true);
                }}
              />
            ) : (
              <CreateFeatureModal
                Label="Task"
                isOpen={showCreateModal}
                onClose={() => {
                  setReload(true);
                  setShowCreateModal(false);
                }}
                onCreate={(name) => {
                  handleAddTask(name);
                  setShowCreateModal(false);
                  setReload(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Project />
    </Suspense>
  );
}
