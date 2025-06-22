/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GitGraph.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchCommits } from "@/app/lib/github";
import Link from "next/link";
import { GitCommit, Clock, User, ExternalLink, GitBranch } from "lucide-react";
import { useThemeClasses } from "../hooks/useThemeClasses";

type CommitNode = {
  sha: string;
  message: string;
  author: string;
  date: string;
};

export default function GitGraph({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [commits, setCommits] = useState<CommitNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useThemeClasses();

  useEffect(() => {
    setLoading(true);
    fetchCommits(owner, repo)
      .then((data: any[]) => {
        const mapped = data.map((commit: any) => ({
          sha: commit.sha.substring(0, 7),
          message: commit.commit.message.split("\n")[0],
          author: commit.commit.author.name,
          date: new Date(commit.commit.author.date).toLocaleString(),
        }));
        setCommits(mapped);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [owner, repo]);

  if (error) {
    return (
      <div className="mx-auto p-6">
        <div
          className={`${theme.status.error} border rounded-lg p-4 transition-colors duration-300`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-700 font-medium">
                Error Loading Commits
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div
          className={`${theme.bg.card} ${theme.border.primary} border rounded-lg p-4 transition-colors duration-300`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 ${theme.bg.tertiary} rounded-lg flex items-center justify-center transition-colors duration-300`}
            >
              <GitBranch
                className={`w-4 h-4 ${theme.text.secondary} transition-colors duration-300`}
              />
            </div>
            <div>
              <h2
                className={`text-lg font-medium ${theme.text.primary} transition-colors duration-300`}
              >
                {owner}/{repo}
              </h2>
              <div
                className={`flex items-center space-x-2 ${theme.text.muted} text-sm transition-colors duration-300`}
              >
                <span>main branch</span>
                <span
                  className={`w-1 h-1 ${theme.text.muted.replace(
                    "text",
                    "bg"
                  )} rounded-full`}
                ></span>
                <span>{commits.length} commits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div
            className={`w-6 h-6 border-2 ${
              theme.border.primary
            } ${theme.text.primary.replace(
              "text",
              "border-t"
            )} rounded-full mx-auto mb-3 animate-spin transition-colors duration-300`}
          ></div>
          <p
            className={`${theme.text.muted} text-sm transition-colors duration-300`}
          >
            Loading commits...
          </p>
        </div>
      )}

      {!loading && commits.length > 0 && (
        <div className="relative">
          <div
            className={`absolute left-4 top-0 bottom-0 w-px ${theme.border.primary.replace(
              "border",
              "bg"
            )} transition-colors duration-300`}
          ></div>

          <div className="space-y-3">
            {commits.map((commit) => (
              <div key={commit.sha} className="group relative">
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0 z-10">
                    <Link
                      href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div
                        className={`w-8 h-8 ${theme.bg.tertiary} ${theme.bg.hoverSecondary} rounded-full flex items-center justify-center transition-colors duration-300`}
                      >
                        <GitCommit
                          className={`w-4 h-4 ${theme.text.secondary} transition-colors duration-300`}
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`${theme.bg.card} ${theme.border.primary} ${theme.border.hover} border rounded-lg p-3 transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code
                          className={`text-xs font-mono ${theme.bg.tertiary} ${theme.text.secondary} px-2 py-1 rounded transition-colors duration-300`}
                        >
                          {commit.sha}
                        </code>
                        <Link
                          href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <ExternalLink
                            className={`w-4 h-4 ${theme.text.muted} hover:${theme.text.secondary} transition-colors duration-300`}
                          />
                        </Link>
                      </div>

                      <p
                        className={`${theme.text.primary} font-medium mb-2 text-sm transition-colors duration-300`}
                      >
                        {commit.message}
                      </p>

                      <div
                        className={`flex items-center space-x-4 text-xs ${theme.text.muted} transition-colors duration-300`}
                      >
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{commit.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{commit.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && commits.length === 0 && !error && (
        <div className="text-center py-12">
          <div
            className={`w-12 h-12 ${theme.bg.tertiary} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}
          >
            <GitCommit
              className={`w-6 h-6 ${theme.text.muted} transition-colors duration-300`}
            />
          </div>
          <h3
            className={`text-lg font-medium ${theme.text.primary} mb-1 transition-colors duration-300`}
          >
            No commits found
          </h3>
          <p
            className={`${theme.text.muted} text-sm transition-colors duration-300`}
          >
            This repository doesn&apos;t have any commits.
          </p>
        </div>
      )}
    </div>
  );
}
