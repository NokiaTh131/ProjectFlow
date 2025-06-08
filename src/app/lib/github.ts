// lib/github.ts
export const fetchCommits = async (
  owner: string,
  repo: string,
  branch = "main",
  per_page = 20
) => {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
};

export const fetchIssues = async (
  owner: string,
  repo: string,
  state = "open",
  per_page = 20
) => {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
};
