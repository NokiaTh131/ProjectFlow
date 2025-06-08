"use client";

import React from "react";
import { motion } from "framer-motion";
import { Feature } from "../project/[id]/page";

interface FeatureProgressProps {
  features: Feature[];
  mode: string;
}

const FeatureProgress: React.FC<FeatureProgressProps> = ({
  features,
  mode,
}) => {
  let completedFeatures = 0;
  let totalFeatures = 0;
  let tasks = 0;
  let doing_task = 0;
  if (mode === "Tasks") {
    features.forEach((feature) => {
      tasks += feature.tasks.length;
      completedFeatures += feature.tasks.filter(
        (task) => task.status === "done"
      ).length;
      doing_task += feature.tasks.filter(
        (task) => task.status === "in-progress"
      ).length;
    });
    totalFeatures = tasks;
  } else {
    completedFeatures = features.filter(
      (feature) =>
        feature.tasks.filter((task) => task.status === "done").length ===
          feature.tasks.length &&
        feature.tasks.filter((task) => task.status === "done").length != 0
    ).length;
    totalFeatures = features.length;
  }
  const percentage =
    totalFeatures > 0
      ? Math.round((completedFeatures / totalFeatures) * 100)
      : 0;

  // Circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Dynamic colors based on completion
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "#2dd4bf"; // Green
    if (percent >= 60) return "#60a5fa"; // Amber
    if (percent >= 40) return "#c084fc"; // Orange
    return "#fb7185"; // Red
  };

  const progressColor = getProgressColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {mode} Completion
      </h2>

      {/* Circular Progress */}
      <div className="relative">
        <svg
          className="transform -rotate-90"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#374151"
            strokeWidth="12"
            fill="transparent"
            className="opacity-30"
          />

          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke={progressColor}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${progressColor}40)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-white mb-1">
              {percentage}%
            </div>
            <div className="text-gray-300 text-sm">Complete</div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-6 flex justify-between w-full max-w-xs"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-400">
            {completedFeatures}
          </div>
          <div className="text-gray-400 text-xs">Completed</div>
        </div>
        {mode === "Tasks" && (
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {doing_task}
            </div>
            <div className="text-gray-400 text-xs">Doing</div>
          </div>
        )}

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-300">
            {totalFeatures - completedFeatures}
          </div>
          <div className="text-gray-400 text-xs">Remaining</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {totalFeatures}
          </div>
          <div className="text-gray-400 text-xs">Total</div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureProgress;
