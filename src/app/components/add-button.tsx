/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus } from "lucide-react";
import React, { Component } from "react";
import { useThemeClasses } from "../hooks/useThemeClasses";

// Wrapper function to use hooks with class component
function AddButtonWithTheme(props: any) {
  const theme = useThemeClasses();
  return <AddButton theme={theme} {...props} />;
}

interface AddButtonProps {
  theme?: ReturnType<typeof useThemeClasses>;
}

export class AddButton extends Component<AddButtonProps> {
  render() {
    const { theme } = this.props;
    if (!theme) return null;

    return (
      <button
        className={`cursor-pointer w-[40px] h-[40px] border ${theme.border.primary} ${theme.border.hover} ${theme.bg.hover} flex justify-center items-center rounded-lg transition-colors duration-300 ${theme.bg.primary} ${theme.text.secondary} hover:${theme.text.primary}`}
      >
        <Plus size={18} />
      </button>
    );
  }
}

export default AddButtonWithTheme;
