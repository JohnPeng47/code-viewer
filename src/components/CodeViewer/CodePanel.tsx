import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet, lineNumbers } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { baseExtensions, getLanguageExtension, theme } from "../../utils/codeMirrorSetup";

export interface CodePanelProps {
  content: string;
  language: string;
  lineNumber?: number;
  highlightRange?: [number, number];
  numLinesContext?: number;
}

// Effect to set the highlight range
const setHighlightRange = StateEffect.define<[number, number] | null>();

// Field to manage line highlighting decorations
const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setHighlightRange)) {
        if (!e.value) return Decoration.none;

        const [startLine, endLine] = e.value;
        const builder = new RangeSetBuilder<Decoration>();

        for (let i = startLine; i <= endLine; i++) {
          if (i > tr.state.doc.lines) break;
          const line = tr.state.doc.line(i);
          builder.add(
            line.from,
            line.from,
            Decoration.line({ class: "cm-highlight-range" })
          );
        }
        return builder.finish();
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Approximate line height in pixels (based on font-size 13px, line-height 1.6)
const LINE_HEIGHT_PX = 21;

export const CodePanel: React.FC<CodePanelProps> = ({
  content,
  language,
  lineNumber,
  highlightRange,
  numLinesContext = 27,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Calculate fixed height based on numLinesContext
  const editorHeight = numLinesContext * LINE_HEIGHT_PX;

  // Initialize / Re-initialize Editor with FULL content
  useEffect(() => {
    if (!editorRef.current) return;
    if (viewRef.current) viewRef.current.destroy();

    const extensions = [
      theme,
      ...baseExtensions,
      lineNumbers(),
      getLanguageExtension(language),
      highlightField,
      EditorView.lineWrapping,
      EditorView.theme({
        "&": { height: `${editorHeight}px` },
        ".cm-scroller": {
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
          fontSize: "13px",
          lineHeight: "1.6",
          overflow: "auto",
        },
        ".cm-content": { padding: "12px 0" },
        ".cm-line": { padding: "0 16px" },
        ".cm-activeLine": { backgroundColor: "rgba(255, 213, 79, 0.15)" },
        ".cm-highlight-range": { backgroundColor: "rgba(33, 150, 243, 0.15)" },
        ".cm-gutters": {
          backgroundColor: "#1e1e1e",
          borderRight: "1px solid #333",
        },
        ".cm-lineNumbers .cm-gutterElement": {
          padding: "0 12px 0 8px",
          minWidth: "3em",
          color: "#858585",
        },
      }),
    ];

    const startState = EditorState.create({
      doc: content, // Full file content
      extensions,
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [content, language, editorHeight]);

  // Handle initial scroll to target line and highlighting
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    // Scroll to target line
    if (lineNumber && lineNumber > 0 && lineNumber <= view.state.doc.lines) {
      const lineInfo = view.state.doc.line(lineNumber);
      view.dispatch({
        selection: { anchor: lineInfo.from },
        effects: EditorView.scrollIntoView(lineInfo.from, { y: "center" }),
      });
    }

    // Set highlight range (using original line numbers since we have full content)
    view.dispatch({
      effects: setHighlightRange.of(highlightRange || null),
    });
  }, [lineNumber, highlightRange, content]);

  return (
    <Box
      ref={editorRef}
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#1e1e1e",
      }}
    />
  );
};
