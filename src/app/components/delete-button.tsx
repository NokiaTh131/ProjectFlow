/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Trash2 } from "lucide-react";
import React, { Component } from "react";
import { useThemeClasses } from "../hooks/useThemeClasses";

// Wrapper function to use hooks with class component
function DeleteButtonWithTheme(props: any) {
  const theme = useThemeClasses();
  return <DeleteButton theme={theme} {...props} />;
}

interface DeleteButtonProps {
  theme?: ReturnType<typeof useThemeClasses>;
}

export class DeleteButton extends Component<DeleteButtonProps> {
  render() {
    const { theme } = this.props;
    if (!theme) return null;

    return (
      <button className="cursor-pointer w-[32px] h-[32px] bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 flex justify-center items-center rounded-lg transition-colors duration-300">
        <Trash2 size={16} />
      </button>
    );
  }
}

export default DeleteButtonWithTheme;
