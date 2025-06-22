"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const themeClasses = useThemeClasses();

  return (
    <button
      onClick={toggleTheme}
      className={`relative cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${themeClasses.bg.tertiary} ${themeClasses.bg.hover} ${themeClasses.border.primary} border`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute w-5 h-5 transition-all duration-300 ${
            themeClasses.text.primary
          } ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          }`}
        />
        <Moon
          className={`absolute w-5 h-5 transition-all duration-300 ${
            themeClasses.text.primary
          } ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
