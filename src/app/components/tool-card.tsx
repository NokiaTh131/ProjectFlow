// components/ToolCard.tsx
import React from "react";
import { Pencil, ExternalLink, Settings } from "lucide-react";

interface ToolCardProps {
  id: number;
  name: string;
  iconUrl?: string;
  note?: string;
  link?: string;
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
  onEdit,
}) => {
  return (
    <div className="group relative">
      {/* Hover glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-teal-500/30 rounded-2xl opacity-0"></div>

      <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-6 hover:border-slate-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 max-w-sm overflow-hidden">
        {/* Header with icon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icon container with gradient background */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600/50 shadow-lg">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={`${name} icon`}
                    className="w-8 h-8 object-contain filter drop-shadow-sm"
                  />
                ) : (
                  <Settings className="w-6 h-6 text-slate-400" />
                )}
              </div>
              {/* Status indicator dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>

            {/* Tool name */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
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
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-xl bg-slate-700/50 hover:bg-indigo-500/80 text-slate-300 hover:text-white hover:scale-110 hover:shadow-lg"
            title="Edit tool"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Note section */}
        {note && (
          <div className="mb-4">
            <div className="bg-slate-900/50 border border-slate-600/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                {note}
              </p>
            </div>
          </div>
        )}

        {/* Link section */}
        {link && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm font-medium"
            >
              <span>Explore Tool</span>
              <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
            </a>

            {/* Quick stats or metadata could go here */}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
              <span>Active</span>
            </div>
          </div>
        )}

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-teal-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default ToolCard;
