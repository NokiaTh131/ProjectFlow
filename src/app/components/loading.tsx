"use client";

import { useThemeClasses } from "../hooks/useThemeClasses";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function Loading({ size = "medium", color }: LoadingProps) {
  const theme = useThemeClasses();
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-6 h-6 border-2",
    large: "w-8 h-8 border-2",
  };

  const defaultColor = theme.text.primary.replace("text", "border");

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${color || defaultColor} ${
          theme.border.primary
        } rounded-full animate-spin border-t-current transition-colors duration-300`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
