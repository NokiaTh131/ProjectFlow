"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Clipboard,
  ClipboardCheck,
  Code2,
  Terminal,
  FileCode,
} from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  name: string;
}

export default function CodeBlock({ code, language, name }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

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
        return "from-yellow-400 to-yellow-600";
      case "typescript":
      case "ts":
      case "tsx":
        return "from-blue-400 to-blue-600";
      case "python":
        return "from-green-400 to-green-600";
      case "bash":
      case "shell":
        return "from-gray-400 to-gray-600";
      case "css":
        return "from-cyan-400 to-cyan-600";
      case "html":
        return "from-orange-400 to-orange-600";
      default:
        return "from-purple-400 to-purple-600";
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="group relative w-full max-w-6xl">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-600/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Language badge */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getLanguageColor(
                  language || "javascript"
                )} rounded-lg text-white text-sm font-medium shadow-lg`}
              >
                {getLanguageIcon(language || "javascript")}
                <span className="capitalize">{language || "javascript"}</span>
              </div>

              {/* File name */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                  {name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  {lineCount} lines
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  {code.length} chars
                </span>
              </div>

              {/* Copy button */}
              <button
                onClick={copyToClipboard}
                className={`group/btn relative overflow-hidden px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                  copied
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                    : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-indigo-500 hover:to-purple-600 text-slate-200 hover:text-white"
                }`}
                title="Copy to clipboard"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center gap-2">
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
          {/* Line numbers background */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-slate-800/60 border-r border-slate-600/30 backdrop-blur-sm"></div>

          {/* Scrollable code area */}
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
            <div className="relative">
              <SyntaxHighlighter
                language={language || "javascript"}
                style={{
                  ...coldarkDark,
                  'pre[class*="language-"]': {
                    ...coldarkDark['pre[class*="language-"]'],
                    background: "transparent",
                    margin: 0,
                    padding: "1.5rem 1.5rem 1.5rem 4rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  },
                  'code[class*="language-"]': {
                    ...coldarkDark['code[class*="language-"]'],
                    background: "transparent",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  },
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                  minWidth: "3rem",
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  color: "#64748b",
                  backgroundColor: "transparent",
                  borderRight: "none",
                  fontSize: "0.75rem",
                  textAlign: "right",
                }}
                wrapLongLines={false}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  borderRadius: 0,
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-900/60 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/60 backdrop-blur-sm border-t border-slate-600/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Syntax highlighting powered by Prism</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}
