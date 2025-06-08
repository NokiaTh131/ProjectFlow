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
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 p-6 flex justify-center items-center"
      >
        <div className="max-w-7xl mx-auto mt-8">
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {project?.name}
              </motion.h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">Active Project</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl py-3 px-4 shadow-lg"
          >
            <MarkGithubIcon className="w-5 h-5 text-slate-400" />
            <a
              href={project?.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              {project?.githubUrl?.replace("https://github.com/", "")}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-screen flex items-center justify-center">
        <div className="w-full max-w-[1400px] flex flex-col justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Panel - Features/Tasks */}
            <div className="col-span-3">
              <motion.div
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ borderColor: "rgba(20, 184, 166, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Panel Header with Glass Effect */}
                <div className="p-6 bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm border-b border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          {mode === "features" ? (
                            <Folder className="w-6 h-6 text-white" />
                          ) : (
                            <BarChart3 className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {mode === "features"
                            ? "Features"
                            : project?.features.find(
                                (feature) => feature.id === activeFeatureId
                              )?.name ?? ""}
                        </h2>
                        <p className="text-slate-400 text-sm">
                          {mode === "features"
                            ? `${project?.features.length || 0} features total`
                            : `${
                                project?.features.find(
                                  (f) => f.id === activeFeatureId
                                )?.tasks.length || 0
                              } tasks`}
                        </p>
                      </div>
                    </motion.div>

                    <div className="flex justify-center items-center gap-3">
                      <AnimatePresence>
                        {mode === "tasks" && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMode("features")}
                            className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg"
                          >
                            <ArrowLeft className="w-5 h-5 text-white" />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -2, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="w-11 h-11 cursor-pointer bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Content List */}
                <div className="p-6">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {mode === "features"
                        ? project?.features.map((feature, index) => (
                            <motion.div
                              key={feature.id}
                              initial={{ opacity: 0, x: -20, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -20, scale: 0.95 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="group relative bg-slate-700/30 backdrop-blur-sm border border-slate-600/40 hover:border-green-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              {/* Hover Glow Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              <div className="relative flex items-center justify-between">
                                <div
                                  className="flex items-center gap-4 cursor-pointer flex-1"
                                  onClick={() => {
                                    setMode("tasks");
                                    setActiveFeatureId(feature.id);
                                  }}
                                >
                                  <div className="relative">
                                    {feature.tasks.filter(
                                      (task) => task.status === "done"
                                    ).length === feature.tasks.length &&
                                    feature.tasks.length > 0 ? (
                                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-slate-600/50 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300">
                                        <Folder className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors">
                                      {feature.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                      <p className="text-slate-400 text-sm">
                                        {feature.tasks.length} tasks
                                      </p>
                                      <div className="flex items-center gap-1">
                                        <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
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
                                        <span className="text-xs text-slate-400">
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

                                <motion.button
                                  whileHover={{ scale: 1.1, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleDeleteFeatures(feature.id)
                                  }
                                  className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </motion.button>
                              </div>
                            </motion.div>
                          ))
                        : project?.features
                            .find((f) => f.id === activeFeatureId)
                            ?.tasks.sort((a, b) => a.id - b.id)
                            .map((task, index) => (
                              <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="group relative bg-slate-700/30 backdrop-blur-sm border border-slate-600/40 hover:border-blue-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                {/* Status-based Glow Effect */}
                                <div
                                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    task.status === "done"
                                      ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                                      : task.status === "in-progress"
                                      ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                                      : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                                  }`}
                                ></div>

                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() =>
                                        handleToggleTaskStatus(task)
                                      }
                                      className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
                                    >
                                      {task.status === "done" ? (
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                          <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                      ) : task.status === "in-progress" ? (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                          }}
                                          className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                                        >
                                          <Clock className="w-5 h-5 text-white" />
                                        </motion.div>
                                      ) : (
                                        <div className="w-10 h-10 bg-slate-600/50 hover:bg-gradient-to-br hover:from-blue-400 hover:to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300">
                                          <Circle className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                                        </div>
                                      )}
                                    </motion.button>

                                    <div className="flex-1">
                                      <h3
                                        className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                                        onClick={() =>
                                          router.push(
                                            `${projectId}/task/${task.id}`
                                          )
                                        }
                                      >
                                        {task.name}
                                      </h3>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span
                                          className={`text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm ${
                                            task.status === "done"
                                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                              : task.status === "in-progress"
                                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                                          }`}
                                        >
                                          {task.status.replace("-", " ")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteTasks(task.id)}
                                    className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                    </AnimatePresence>
                  </div>

                  {/* Git Graph Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                  >
                    {gitDetails && gitDetails.owner && gitDetails.repo && (
                      <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6">
                        <GitGraph
                          owner={gitDetails.owner}
                          repo={gitDetails.repo}
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right Panel - Progress & Issues */}
            <div className="space-y-6 col-span-3 lg:col-span-2">
              {/* Feature Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
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
              </motion.div>

              {/* Issues Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl"
              >
                {gitDetails && gitDetails.owner && gitDetails.repo && (
                  <IssuesDisplay
                    owner={gitDetails.owner}
                    repo={gitDetails.repo}
                    state="open"
                    perPage={20}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Delete Project Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-2xl px-8 py-4 text-red-400 hover:text-red-300 transition-all duration-300 backdrop-blur-sm shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
              Delete Project
            </motion.button>
          </motion.div>

          {/* Modals */}
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteProject}
          />

          <AnimatePresence>
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Project />
    </Suspense>
  );
}
