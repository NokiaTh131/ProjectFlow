"use client";

import React from "react";
import { Feature } from "../project/[id]/page";
import { motion } from "framer-motion";
import { useThemeClasses } from '../hooks/useThemeClasses';

interface FeatureProgressProps {
  features: Feature[];
  mode: string;
}

const FeatureProgress: React.FC<FeatureProgressProps> = ({
  features,
  mode,
}) => {
  const theme = useThemeClasses();
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
  const radius = 45;
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
    <div className="flex flex-col items-center justify-center p-6 w-full mx-auto">
      <h3 className={`text-lg font-medium ${theme.text.primary} mb-6 text-center transition-colors duration-300`}>
        {mode} Progress
      </h3>

      {/* <div className="relative">
        <svg
          className="transform -rotate-90"
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="#f3f4f6"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke={progressColor}
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {percentage}%
            </div>
            <div className="text-gray-500 text-xs">Complete</div>
          </div>
        </div>
      </div> */}

      <div className="relative">
        <svg
          className="transform -rotate-90"
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={theme.text.muted.includes('text-gray-500') ? '#6b7280' : '#374151'}
            strokeWidth="6"
            fill="transparent"
            className="opacity-30"
          />

          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke={progressColor}
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.1,
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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="text-center"
          >
            <div className={`text-2xl font-semibold ${theme.text.primary} mb-1 transition-colors duration-300`}>
              {percentage}%
            </div>
            <div className={`${theme.text.muted} text-xs transition-colors duration-300`}>Complete</div>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 w-full max-w-xs text-center">
        <div>
          <div className="text-base font-medium text-green-600">
            {completedFeatures}
          </div>
          <div className={`${theme.text.muted} text-xs transition-colors duration-300`}>Done</div>
        </div>
        {mode === "Tasks" && (
          <div>
            <div className="text-base font-medium text-yellow-600">
              {doing_task}
            </div>
            <div className={`${theme.text.muted} text-xs transition-colors duration-300`}>Active</div>
          </div>
        )}
        <div>
          <div className="text-base font-medium text-gray-600">
            {totalFeatures - completedFeatures}
          </div>
          <div className={`${theme.text.muted} text-xs transition-colors duration-300`}>Left</div>
        </div>
        <div>
          <div className="text-base font-medium text-blue-600">
            {totalFeatures}
          </div>
          <div className={`${theme.text.muted} text-xs transition-colors duration-300`}>Total</div>
        </div>
      </div>
    </div>
  );
};

export default FeatureProgress;
