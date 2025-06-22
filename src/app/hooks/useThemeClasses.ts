"use client";

import { useThemeSafe } from "../contexts/ThemeContext";

export function useThemeClasses() {
  const { isDark } = useThemeSafe();

  return {
    // Background classes
    bg: {
      primary: isDark ? "bg-gray-900" : "bg-white",
      secondary: isDark ? "bg-gray-800" : "bg-gray-50",
      tertiary: isDark ? "bg-gray-700" : "bg-gray-100",
      accent: isDark ? "bg-gray-600" : "bg-gray-200",
      hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
      hoverSecondary: isDark ? "hover:bg-gray-600" : "hover:bg-gray-200",
      card: isDark
        ? "bg-gray-800 border border-gray-600"
        : "bg-white border border-gray-200",
      cardHover: isDark ? "hover:bg-gray-750" : "hover:bg-gray-50",
      submit: isDark
        ? "bg-gray-800 hover:bg-gray-700 text-white"
        : "bg-gray-900 hover:bg-gray-800 text-white",
    },

    // Text classes
    text: {
      primary: isDark ? "text-white" : "text-gray-900",
      secondary: isDark ? "text-gray-300" : "text-gray-600",
      tertiary: isDark ? "text-gray-400" : "text-gray-500",
      muted: isDark ? "text-gray-500" : "text-gray-400",
      inverse: isDark ? "text-gray-900" : "text-white",
    },

    // Border classes
    border: {
      primary: isDark ? "border-gray-700" : "border-gray-200",
      secondary: isDark ? "border-gray-600" : "border-gray-300",
      hover: isDark ? "hover:border-gray-600" : "hover:border-gray-300",
      focus: isDark ? "focus:border-gray-500" : "focus:border-gray-900",
    },

    // Input classes
    input: {
      base: isDark
        ? "bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
        : "bg-gray-200 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-900 focus:border-gray-900",
      secondary: isDark
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-gray-100 border-0 text-gray-900 placeholder-gray-500",
    },

    // Button classes
    button: {
      primary: isDark
        ? "bg-gray-900 text-white hover:bg-gray-700"
        : "bg-gray-900 text-white hover:bg-gray-700",
      secondary: isDark
        ? "bg-gray-700 text-white hover:bg-gray-600"
        : "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: isDark
        ? "text-gray-300 hover:text-white hover:bg-gray-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
      tab: isDark ? "border-white text-white" : "border-gray-900 text-gray-900",
    },

    // Status colors (these remain consistent across themes)
    status: {
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      error: "bg-red-100 text-red-800 border-red-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
      successDark: isDark
        ? "bg-green-900/30 text-green-400 border-green-800"
        : "bg-green-100 text-green-800 border-green-200",
      warningDark: isDark
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
        : "bg-yellow-100 text-yellow-800 border-yellow-200",
    },

    // Ring classes for focus states
    ring: {
      primary: isDark ? "focus:ring-gray-500" : "focus:ring-gray-900",
      secondary: isDark ? "focus:ring-gray-600" : "focus:ring-gray-500",
    },

    // Shadow classes
    shadow: {
      sm: isDark ? "shadow-gray-900/20" : "shadow-sm",
      md: isDark ? "shadow-gray-900/30" : "shadow-md",
      lg: isDark ? "shadow-gray-900/40" : "shadow-lg",
    },
  };
}
