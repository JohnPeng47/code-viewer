export interface CodeSnapshot {
  /**
   * GitHub URL pointing to a blob view such as
   * https://github.com/{owner}/{repo}/blob/{ref}/{path}#L{line}
   */
  githubUrl: string;
  /**
   * Line number that should be centered/highlighted.
   */
  lineNumber: number;
  /**
   * Optional cached file contents to skip fetching.
   */
  cachedContent?: string;
  /**
   * Optional textual description for navigation footer.
   */
  description?: string;
  /**
   * Optional range of lines to highlight.
   */
  highlightRange?: [number, number];
  /**
   * Number of lines to display around the focused line.
   * Defaults to 15.
   */
  numLinesContext?: number;
}

export interface GitHubFileInfo {
  owner: string;
  repo: string;
  ref: string;
  path: string;
  lineNumber?: number;
}

export interface SnapshotPaneProps {
  content: string;
  language: string;
  lineNumber: number;
  highlightRange?: [number, number];
  numLinesContext?: number;
  onContentReady?: () => void;
}
