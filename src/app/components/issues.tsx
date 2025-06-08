import React, { useState, useEffect, useMemo } from "react";
import { fetchIssues } from "../lib/github";

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  comments: number;
  html_url: string;
}

interface IssuesDisplayProps {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  perPage?: number;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const IssuesDisplay: React.FC<IssuesDisplayProps> = ({
  owner,
  repo,
  state = "open",
  perPage = 20,
}) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchIssues(owner, repo, state, perPage);
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch issues");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [owner, repo, state, perPage]);

  // Memoized filtered issues for performance
  const filteredIssues = useMemo(() => {
    if (!filter) return issues;
    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(filter.toLowerCase()) ||
        issue.body?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [issues, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading issues...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Issues ({filteredIssues.length})
        </h2>
        <input
          type="text"
          placeholder="Filter issues..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Issues list */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No issues found</div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

// Memoized issue card component to prevent unnecessary re-renders
const IssueCard = React.memo<{ issue: GitHubIssue }>(({ issue }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 group-hover:border-teal-500/30 group-hover:bg-gray-800/70 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Issue title and number */}
          <div className="flex items-center gap-2 mb-2">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-teal-400 hover:underline truncate"
            >
              {issue.title}
            </a>
            <span className="text-gray-500 text-sm">#{issue.number}</span>
          </div>

          {/* Issue body preview */}
          {issue.body && (
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {issue.body.substring(0, 150)}
              {issue.body.length > 150 && "..."}
            </p>
          )}

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {issue.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                    border: `1px solid #${label.color}40`,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Issue metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-200">
            <div className="flex items-center gap-1">
              <img
                src={issue.user.avatar_url}
                alt={issue.user.login}
                className="w-4 h-4 rounded-full"
              />
              <span>{issue.user.login}</span>
            </div>
            <span>opened {formatDate(issue.created_at)}</span>
            {issue.comments > 0 && (
              <span>
                {issue.comments} comment{issue.comments !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Issue state */}
        <div className="ml-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              issue.state === "open"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {issue.state}
          </span>
        </div>
      </div>
    </div>
  );
});

IssueCard.displayName = "IssueCard";

export default IssuesDisplay;
