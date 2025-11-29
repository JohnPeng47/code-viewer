import { GitHubFileInfo } from "../types";

const GITHUB_BLOB_REGEX =
  /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+?)(?:#L(\d+))?$/;

export function parseGitHubUrl(url: string): GitHubFileInfo {
  const match = url.match(GITHUB_BLOB_REGEX);
  if (!match) {
    throw new Error(`Invalid GitHub URL format: ${url}`);
  }

  const [, owner, repo, ref, path, line] = match;
  return {
    owner,
    repo,
    ref,
    path,
    lineNumber: line ? Number.parseInt(line, 10) : undefined
  };
}

export function toRawGitHubUrl(info: GitHubFileInfo): string {
  return `https://raw.githubusercontent.com/${info.owner}/${info.repo}/${info.ref}/${info.path}`;
}

const LANGUAGE_MAP: Record<string, string> = {
  py: "python",
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
  rs: "rust",
  go: "go",
  rb: "ruby",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  md: "markdown",
  sh: "bash",
  yaml: "yaml",
  yml: "yaml"
};

export function detectLanguage(filepath: string): string {
  const ext = filepath.split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGE_MAP[ext] ?? "text";
}
