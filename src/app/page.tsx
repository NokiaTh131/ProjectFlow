"use client";

import "./home.css";
import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateProject from "./create-project";
import axios from "axios";

export interface Project {
  id: number;
  name: string;
  githubUrl?: string;
  deadLine: Date;
}

function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/projects"
        );
        setProjects(projects.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [showCreateProject]);

  const handleShowCreateProject = () => {
    setShowCreateProject(true);
  };

  const handleClickProject = (projectId: number) => {
    setLoading(true);
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      router.push("/project/" + projectId);
      setLoading(false);
    }
  };

  const getDeadlineStatus = (deadline: Date) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff > 7)
      return {
        text: `${dayDiff} days left`,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      };
    if (dayDiff > 3)
      return {
        text: `${dayDiff} days left`,
        color: "text-amber-500",
        bg: "bg-amber-50",
      };
    if (dayDiff > 0)
      return {
        text: `${dayDiff} day${dayDiff !== 1 ? "s" : ""} left`,
        color: "text-red-500",
        bg: "bg-red-50",
      };
    if (dayDiff === 0)
      return { text: "Due today", color: "text-red-600", bg: "bg-red-100" };
    return {
      text: `Overdue by ${Math.abs(dayDiff)} day${
        Math.abs(dayDiff) !== 1 ? "s" : ""
      }`,
      color: "text-red-700",
      bg: "bg-red-200",
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl mb-6 shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <svg
              className="w-10 h-10 text-white"
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
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-teal-100 to-blue-200 bg-clip-text text-transparent mb-4">
            PROJECT FLOW
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Organize, track, and manage your projects with modern elegance
          </p>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <motion.div
                className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg
                  className="w-12 h-12 text-gray-500"
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
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No projects yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first project to get started on your journey
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowCreateProject}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Project
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => {
                const deadlineStatus = project.deadLine
                  ? getDeadlineStatus(project.deadLine)
                  : null;

                return (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClickProject(project.id)}
                    className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-teal-500/30 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-1">
                      <div className="h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-teal-100 transition-colors line-clamp-2 flex-1">
                          {project.name}
                        </h3>
                        <motion.div
                          className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg
                            className="w-4 h-4 text-teal-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </div>

                      <div className="space-y-4">
                        {/* Deadline Display */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {project.deadLine
                              ? new Date(project.deadLine).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "No deadline"}
                          </span>
                        </div>

                        {/* Deadline Status Badge */}
                        {deadlineStatus && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${
                              deadlineStatus.color.includes("emerald")
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : deadlineStatus.color.includes("amber")
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            <motion.div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                deadlineStatus.color.includes("emerald")
                                  ? "bg-emerald-400"
                                  : deadlineStatus.color.includes("amber")
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                              animate={{
                                scale: deadlineStatus.color.includes("red")
                                  ? [1, 1.2, 1]
                                  : 1,
                              }}
                              transition={{
                                duration: 1,
                                repeat: deadlineStatus.color.includes("red")
                                  ? Infinity
                                  : 0,
                              }}
                            />
                            {deadlineStatus.text}
                          </motion.div>
                        )}
                      </div>

                      {/* Project Stats */}
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Project #{project.id}</span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.5,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShowCreateProject}
          className="fixed right-6 bottom-6 z-10"
        >
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300 cursor-pointer">
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Create Project Modal */}
        <AnimatePresence>
          {showCreateProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <CreateProject exitClicked={setShowCreateProject} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-3 border-teal-500/20 border-t-teal-400 rounded-full mx-auto mb-4"
                />
                <p className="text-white font-medium">
                  Loading your project...
                </p>
                <p className="text-gray-400 text-sm mt-1">Please wait</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your projects...</p>
          </div>
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}
