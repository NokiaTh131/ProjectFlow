"use client";

import React from "react";
import { Pencil, ExternalLink, Settings } from "lucide-react";
import { useThemeClasses } from "../hooks/useThemeClasses";

interface ToolCardProps {
  id: number;
  name: string;
  iconUrl?: string;
  note?: string;
  link?: string;
  viewMode?: "grid" | "list";
  onEdit?: (tool: {
    id: number;
    name: string;
    iconUrl: string;
    note: string;
    link: string;
  }) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  iconUrl,
  note,
  link,
  viewMode = "grid",
  onEdit,
}) => {
  const theme = useThemeClasses();
  
  if (viewMode === "list") {
    return (
      <div className="group relative">
        <div
          className={`relative ${theme.bg.card} ${theme.border.primary} ${theme.border.hover} border rounded-lg p-4 transition-all duration-300 hover:${theme.shadow.sm} w-full`}
        >
          <div className="flex items-center justify-between">
            {/* Left section - Icon and details */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon container */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-10 h-10 ${theme.bg.tertiary} rounded-lg flex items-center justify-center ${theme.border.primary} border transition-colors duration-300`}
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={`${name} icon`}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <Settings
                      className={`w-5 h-5 ${theme.text.muted} transition-colors duration-300`}
                    />
                  )}
                </div>
                {/* Status indicator dot */}
                <div
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 ${theme.bg.card.replace(
                    "bg",
                    "border"
                  )} transition-colors duration-300`}
                ></div>
              </div>

              {/* Tool details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className={`text-base font-medium ${theme.text.primary} transition-colors duration-300 truncate`}
                  >
                    {name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-xs ${theme.text.muted} transition-colors duration-300`}
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
                
                {note && (
                  <p
                    className={`text-sm ${theme.text.secondary} leading-relaxed line-clamp-2 transition-colors duration-300`}
                  >
                    {note}
                  </p>
                )}
              </div>
            </div>

            {/* Right section - Link and actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <span>Explore</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                </a>
              )}

              {/* Edit button */}
              <button
                onClick={() =>
                  onEdit?.({
                    id,
                    name,
                    iconUrl: iconUrl || "",
                    note: note || "",
                    link: link || "",
                  })
                }
                className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 rounded-lg ${theme.bg.tertiary} ${theme.bg.hoverSecondary} ${theme.text.secondary} hover:${theme.text.primary}`}
                title="Edit tool"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="group relative">
      <div
        className={`relative ${theme.bg.card} ${theme.border.primary} ${theme.border.hover} border rounded-lg p-4 transition-all duration-300 hover:${theme.shadow.sm} max-w-sm overflow-hidden`}
      >
        {/* Header with icon and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            <div className="relative">
              <div
                className={`w-10 h-10 ${theme.bg.tertiary} rounded-lg flex items-center justify-center ${theme.border.primary} border transition-colors duration-300`}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={`${name} icon`}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Settings
                    className={`w-5 h-5 ${theme.text.muted} transition-colors duration-300`}
                  />
                )}
              </div>
              {/* Status indicator dot */}
              <div
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 ${theme.bg.card.replace(
                  "bg",
                  "border"
                )} transition-colors duration-300`}
              ></div>
            </div>

            {/* Tool name */}
            <div className="flex-1">
              <h3
                className={`text-base font-medium ${theme.text.primary} transition-colors duration-300`}
              >
                {name}
              </h3>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() =>
              onEdit?.({
                id,
                name,
                iconUrl: iconUrl || "",
                note: note || "",
                link: link || "",
              })
            }
            className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 rounded-lg ${theme.bg.tertiary} ${theme.bg.hoverSecondary} ${theme.text.secondary} hover:${theme.text.primary}`}
            title="Edit tool"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Note section */}
        {note && (
          <div className="mb-3">
            <div
              className={`${theme.bg.secondary} ${theme.border.primary} border rounded-lg p-3 transition-colors duration-300`}
            >
              <p
                className={`text-sm ${theme.text.secondary} leading-relaxed line-clamp-3 transition-colors duration-300`}
              >
                {note}
              </p>
            </div>
          </div>
        )}

        {/* Link section */}
        {link && (
          <div
            className={`flex items-center justify-between pt-3 border-t ${theme.border.primary} transition-colors duration-300`}
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <span>Explore Tool</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
            </a>

            {/* Quick stats or metadata could go here */}
            <div
              className={`flex items-center gap-1 text-xs ${theme.text.muted} transition-colors duration-300`}
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
