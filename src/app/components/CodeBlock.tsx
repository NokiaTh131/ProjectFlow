"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Clipboard,
  ClipboardCheck,
  Code2,
  Terminal,
  FileCode,
} from "lucide-react";
import { useState } from "react";
import { useThemeClasses } from '../hooks/useThemeClasses';

interface CodeBlockProps {
  code: string;
  language?: string;
  name: string;
}

export default function CodeBlock({ code, language, name }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const theme = useThemeClasses();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case "javascript":
      case "js":
      case "jsx":
      case "typescript":
      case "ts":
      case "tsx":
        return <Code2 className="w-4 h-4" />;
      case "bash":
      case "shell":
      case "zsh":
        return <Terminal className="w-4 h-4" />;
      default:
        return <FileCode className="w-4 h-4" />;
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case "javascript":
      case "js":
      case "jsx":
        return "bg-yellow-100 text-yellow-700";
      case "typescript":
      case "ts":
      case "tsx":
        return "bg-blue-100 text-blue-700";
      case "python":
        return "bg-green-100 text-green-700";
      case "bash":
      case "shell":
        return "bg-gray-100 text-gray-700";
      case "css":
        return "bg-cyan-100 text-cyan-700";
      case "html":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="group relative w-full max-w-6xl">
      <div className={`relative ${theme.bg.card} ${theme.border.primary} border rounded-lg overflow-hidden ${theme.shadow.sm} hover:${theme.shadow.md} transition-all duration-300`}>
        {/* Header */}
        <div className={`${theme.bg.secondary} ${theme.border.primary} border-b px-6 py-4 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Language badge */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getLanguageColor(
                  language || "javascript"
                )}`}
              >
                {getLanguageIcon(language || "javascript")}
                <span className="capitalize">{language || "javascript"}</span>
              </div>

              {/* File name */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className={`text-lg font-semibold ${theme.text.primary} transition-colors duration-300`}>
                  {name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className={`flex items-center gap-4 text-sm ${theme.text.muted} transition-colors duration-300`}>
                <span className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 ${theme.text.muted.replace('text', 'bg')} rounded-full transition-colors duration-300`}></div>
                  {lineCount} lines
                </span>
                <span className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 ${theme.text.muted.replace('text', 'bg')} rounded-full transition-colors duration-300`}></div>
                  {code.length} chars
                </span>
              </div>

              {/* Copy button */}
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                  copied
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : `${theme.bg.tertiary} ${theme.bg.hoverSecondary} ${theme.text.secondary} ${theme.border.primary} ${theme.border.hover} border`
                }`}
                title="Copy to clipboard"
              >
                <div className="flex items-center gap-2">
                  {copied ? (
                    <>
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Code content */}
        <div className="relative">
          {/* Scrollable code area */}
          <div className="max-h-[600px] overflow-auto">
            <SyntaxHighlighter
              language={language || "javascript"}
              style={theme.bg.primary.includes('bg-white') ? oneLight : oneDark}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: "3rem",
                paddingRight: "1rem",
                paddingLeft: "1rem",
                color: theme.text.muted.includes('text-gray-500') ? "#6b7280" : "#9ca3af",
                backgroundColor: theme.bg.secondary.includes('bg-gray-50') ? "#f9fafb" : "#374151",
                borderRight: theme.border.primary.includes('border-gray-200') ? "1px solid #e5e7eb" : "1px solid #4b5563",
                fontSize: "0.75rem",
                textAlign: "right",
              }}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }}
              wrapLongLines={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Footer */}
        <div className={`${theme.bg.secondary} ${theme.border.primary} border-t px-6 py-3 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-4 text-xs ${theme.text.muted} transition-colors duration-300`}>
              <span>Syntax highlighting powered by Prism</span>
            </div>
            <div className={`flex items-center gap-2 text-xs ${theme.text.muted} transition-colors duration-300`}>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
