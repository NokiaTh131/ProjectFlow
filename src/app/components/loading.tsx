"use client";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function Loading({
  size = "medium",
  color = "border-blue-600",
}: LoadingProps) {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${color} rounded-full animate-spin border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
