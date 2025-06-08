/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GitGraph.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchCommits } from "@/app/lib/github";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, Clock, User, ExternalLink, GitBranch } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto p-6"
      >
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-400 font-semibold">
                Error Loading Commits
              </h3>
              <p className="text-red-300/70 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {owner}/{repo}
              </h2>
              <div className="flex items-center space-x-2 text-teal-300/80">
                <span className="text-sm">Branch: main</span>
                <span className="w-1 h-1 bg-teal-400 rounded-full"></span>
                <span className="text-sm">{commits.length} commits</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-teal-500/20 border-t-teal-400 rounded-full mx-auto mb-4"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-teal-300/60 text-sm"
            >
              Fetching commit history...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commits Timeline */}
      <AnimatePresence>
        {!loading && commits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Timeline gradient line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal-400 via-teal-500 to-transparent opacity-30"></div>

            <div className="space-y-6">
              {commits.map((commit, index) => (
                <motion.div
                  key={commit.sha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="group relative"
                >
                  <div className="flex items-start space-x-6">
                    {/* Commit Node */}
                    <div className="relative flex-shrink-0 z-10">
                      <Link
                        href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-teal-400/20 transition-all duration-300"
                        >
                          <GitCommit className="w-5 h-5 text-white" />
                        </motion.div>
                      </Link>
                    </div>

                    {/* Commit Content */}
                    <div className="flex-1 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 group-hover:border-teal-500/30 group-hover:bg-gray-800/70 transition-all duration-300"
                      >
                        {/* Commit SHA */}
                        <div className="flex items-center justify-between mb-3">
                          <motion.code
                            whileHover={{ scale: 1.05 }}
                            className="text-xs font-mono bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-lg border border-teal-500/30"
                          >
                            {commit.sha}
                          </motion.code>
                          <Link
                            href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <ExternalLink className="w-4 h-4 text-teal-400 hover:text-teal-300" />
                          </Link>
                        </div>

                        {/* Commit Message */}
                        <p className="text-white font-medium mb-4 leading-relaxed">
                          {commit.message}
                        </p>

                        {/* Commit Meta */}
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{commit.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{commit.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {!loading && commits.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <GitCommit className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No commits found
            </h3>
            <p className="text-gray-500 text-sm">
              This repository doesn&apos;t have any commits on the main branch.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
