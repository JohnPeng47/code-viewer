import React, { useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CodeSnapshot } from "../../types";
import { useFileContent } from "../../hooks/useFileContent";
import { useSnapshotNavigation } from "../../hooks/useSnapshotNavigation";
import { CodePanel } from "./CodePanel";
import { ViewerControls } from "./ViewerControls";

export interface CodeViewerProps {
  snapshots: CodeSnapshot[];
  initialIndex?: number;
  githubToken?: string;
  height?: string | number;
  width?: string | number;
  sx?: object;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  snapshots,
  initialIndex = 0,
  githubToken,
  height = 600,
  width = "80%",
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    currentSnapshot,
    goToNext,
    goToPrevious,
  } = useSnapshotNavigation(snapshots, initialIndex, githubToken);

  const {
    content,
    language,
    loading,
    error,
  } = useFileContent(
    currentSnapshot?.githubUrl,
    currentSnapshot?.cachedContent,
    githubToken
  );

  // Keyboard navigation scoped to component
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!container.contains(document.activeElement)) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!snapshots.length) return null;

  const fileName = currentSnapshot?.githubUrl.split("/").pop()?.split("#")[0] || "file";

  return (
    <Paper
      ref={containerRef}
      elevation={8}
      tabIndex={0}
      aria-label="Code Snapshot Viewer"
      sx={{
        display: "flex",
        flexDirection: "column",
        height,
        width,
        overflow: "hidden",
        bgcolor: "#1e1e1e",
        borderRadius: 2,
        outline: "none",
        "&:focus-within": {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
        },
        ...sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "#252526",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            color: "grey.400",
          }}
        >
          {fileName}
        </Typography>
        <Link
          href={currentSnapshot?.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontSize: "0.75rem" }}
        >
          Open on GitHub ↗
        </Link>
      </Box>

      {/* Main Content */}
      <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(30, 30, 30, 0.9)",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}

        {error && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#1e1e1e",
              p: 3,
            }}
          >
            <Alert severity="error" sx={{ maxWidth: 400 }}>
              {error.message}
            </Alert>
          </Box>
        )}

        {content && (
          <CodePanel
            content={content}
            language={language}
            lineNumber={currentSnapshot?.lineNumber}
            highlightRange={currentSnapshot?.highlightRange}
            numLinesContext={currentSnapshot?.numLinesContext}
          />
        )}
      </Box>

      <ViewerControls
        currentIndex={currentIndex}
        totalSnapshots={snapshots.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        description={currentSnapshot?.description}
      />
    </Paper>
  );
};
