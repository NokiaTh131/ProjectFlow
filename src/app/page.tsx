"use client";

import "./home.css";
import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import CreateProject from "./create-project";
import axios from "axios";
import { useThemeClasses } from "./hooks/useThemeClasses";
import ThemeToggle from "./components/ThemeToggle";

export interface Project {
  id: number;
  name: string;
  githubUrl?: string;
  deadLine: Date;
  finished: string;
}

function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const themeClasses = useThemeClasses();

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

  return (
    <div
      className={`min-h-screen ${themeClasses.bg.secondary} transition-colors duration-300`}
    >
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 ${themeClasses.button.primary} rounded-xl mb-6 transition-colors duration-300`}
          >
            <svg
              className={`w-7 h-7 text-white`}
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
          </div>
          <h1
            className={`text-3xl md:text-4xl font-light ${themeClasses.text.primary} mb-3 transition-colors duration-300`}
          >
            Project Flow
          </h1>
          <p
            className={`${themeClasses.text.secondary} max-w-md mx-auto transition-colors duration-300`}
          >
            Simple project management
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div
              className={`w-16 h-16 ${themeClasses.bg.tertiary} rounded-xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}
            >
              <svg
                className={`w-8 h-8 ${themeClasses.text.muted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-medium ${themeClasses.text.primary} mb-2 transition-colors duration-300`}
            >
              No projects yet
            </h3>
            <p
              className={`${themeClasses.text.secondary} mb-8 transition-colors duration-300`}
            >
              Create your first project to get started
            </p>
            <button
              onClick={handleShowCreateProject}
              className={`inline-flex items-center gap-2 ${themeClasses.button.primary} px-5 py-2.5 rounded-lg font-medium transition-all duration-200`}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const deadlineStatus = project.deadLine
                ? project.finished === "finish"
                  ? null
                  : getDeadlineStatus(project.deadLine)
                : null;

              return (
                <div
                  key={project.id}
                  onClick={() => handleClickProject(project.id)}
                  className={`group ${themeClasses.bg.card} ${themeClasses.border.primary} ${themeClasses.border.hover} ${themeClasses.shadow.md} hover:shadow-lg rounded-lg transition-all duration-200 cursor-pointer p-5`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className={`text-lg font-medium ${themeClasses.text.primary} flex-1 transition-colors duration-300`}
                    >
                      {project.name}
                    </h3>
                    <div className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className={`w-4 h-4 ${themeClasses.text.muted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary} transition-colors duration-300`}
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
                          strokeWidth={1.5}
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

                    {deadlineStatus && (
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          deadlineStatus.color.includes("emerald")
                            ? "bg-green-100 text-green-700"
                            : deadlineStatus.color.includes("amber")
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            deadlineStatus.color.includes("emerald")
                              ? "bg-green-500"
                              : deadlineStatus.color.includes("amber")
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        {deadlineStatus.text}
                      </div>
                    )}
                  </div>

                  <div
                    className={`mt-4 pt-4 ${themeClasses.border.primary} border-t transition-colors duration-300`}
                  >
                    <div
                      className={`flex items-center justify-between text-xs ${themeClasses.text.muted} transition-colors duration-300`}
                    >
                      <span>#{project.id}</span>
                      <span className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 ${themeClasses.text.muted} rounded-full`}
                        ></div>
                        {project.finished === "finish" ? (
                          <span className="text-green-600">Done</span>
                        ) : (
                          "Active"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleShowCreateProject}
          className={`fixed right-6 bottom-6 z-10 ${themeClasses.button.primary} p-3 rounded-full ${themeClasses.shadow.lg} transition-all duration-200`}
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
        </button>

        {showCreateProject && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <CreateProject exitClicked={setShowCreateProject} />
          </div>
        )}

        {loading && (
          <div
            className={`fixed inset-0 ${themeClasses.bg.secondary}/80 backdrop-blur-sm flex items-center justify-center z-50 transition-colors duration-300`}
          >
            <div
              className={`${themeClasses.bg.card} ${themeClasses.border.primary} rounded-xl p-6 text-center ${themeClasses.shadow.lg} transition-colors duration-300`}
            >
              <div
                className={`w-6 h-6 border-2 ${themeClasses.border.primary} ${
                  themeClasses.button.primary.includes("bg-white")
                    ? "border-t-gray-900"
                    : "border-t-white"
                } rounded-full mx-auto mb-3 animate-spin`}
              ></div>
              <p
                className={`${themeClasses.text.primary} font-medium transition-colors duration-300`}
              >
                Loading...
              </p>
            </div>
          </div>
        )}
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
