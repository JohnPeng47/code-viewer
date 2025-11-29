import React, { useRef, useEffect } from "react";
import { CodeSnapshot } from "../../types";
import { useFileContent } from "../../hooks/useFileContent";
import { useSnapshotNavigation } from "../../hooks/useSnapshotNavigation";
import { CodePanel } from "./CodePanel";
import { ViewerControls } from "./ViewerControls";

export interface CodeViewerProps {
  snapshots: CodeSnapshot[];
  initialIndex?: number;
  githubToken?: string;
  className?: string;
  height?: string | number;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  snapshots,
  initialIndex = 0,
  githubToken,
  className = "",
  height = "600px",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    currentSnapshot,
    goToNext,
    goToPrevious,
    goToIndex
  } = useSnapshotNavigation(snapshots, initialIndex, githubToken);

  const {
    content,
    language,
    loading,
    error
  } = useFileContent(currentSnapshot?.githubUrl, currentSnapshot?.cachedContent, githubToken);

  // Keyboard navigation scoped to component
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if container or children have focus
      if (!container.contains(document.activeElement)) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    // Use global listener but check focus, or attach to container with tabIndex
    // Attaching to container is safer for accessibility
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!snapshots.length) return null;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-lg border border-slate-800 bg-slate-950 overflow-hidden outline-none ring-offset-2 focus-within:ring-2 ring-blue-500/50 ${className}`}
      style={{ height }}
      tabIndex={0}
      aria-label="Code Snapshot Viewer"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">
          {currentSnapshot?.githubUrl.split('/').pop()?.split('#')[0]}
        </span>
        <a
          href={currentSnapshot?.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Open GitHub ↗
        </a>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 min-h-0">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 text-slate-300">
            Loading...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
            <span className="text-red-400 font-medium">Failed to load content</span>
            <span className="text-sm text-slate-500 mt-2">{error.message}</span>
          </div>
        )}

        {content && (
          <CodePanel
            content={content}
            language={language}
            lineNumber={currentSnapshot?.lineNumber}
            highlightRange={currentSnapshot?.highlightRange}
          />
        )}
      </div>

      <ViewerControls
        currentIndex={currentIndex}
        totalSnapshots={snapshots.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        description={currentSnapshot?.description}
      />
    </div>
  );
};

