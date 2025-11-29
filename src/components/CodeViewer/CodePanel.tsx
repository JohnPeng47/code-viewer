import React, { useEffect, useRef } from "react";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { baseExtensions, getLanguageExtension, theme } from "../../utils/codeMirrorSetup";

export interface CodePanelProps {
  content: string;
  language: string;
  lineNumber?: number;
  highlightRange?: [number, number];
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

        // Iterate through lines in the range
        for (let i = startLine; i <= endLine; i++) {
          // Clamp to document bounds
          if (i > tr.state.doc.lines) break;

          const line = tr.state.doc.line(i);
          builder.add(line.from, line.from, Decoration.line({
            class: "cm-highlight-range bg-blue-500/20" // Tailwind class + backup
          }));
        }
        return builder.finish();
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const CodePanel: React.FC<CodePanelProps> = ({
  content,
  language,
  lineNumber,
  highlightRange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // 1. Initialize / Re-initialize Editor on Content/Language change
  useEffect(() => {
    if (!editorRef.current) return;

    // Cleanup old view
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const startState = EditorState.create({
      doc: content,
      extensions: [
        theme,
        baseExtensions,
        getLanguageExtension(language),
        highlightField, // Add our custom highlight field
        EditorView.theme({
          ".cm-scroller": { fontFamily: "inherit" },
          ".cm-content": { padding: "16px 0" },
          ".cm-line": { padding: "0 16px" },
          ".cm-activeLine": { backgroundColor: "rgba(234, 179, 8, 0.15)" }, // Yellow tint
          ".cm-highlight-range": { backgroundColor: "rgba(59, 130, 246, 0.15)" } // Blue tint
        })
      ],
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
  }, [content, language]);

  // 2. Handle Scrolling and Highlighting Updates
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const effects: StateEffect<any>[] = [];

    // Scroll to target line
    if (lineNumber && lineNumber > 0 && lineNumber <= view.state.doc.lines) {
      const lineInfo = view.state.doc.line(lineNumber);

      effects.push(EditorView.scrollIntoView(lineInfo.from, { y: "center" }));

      // Also move cursor to that line to trigger `highlightActiveLine`
      view.dispatch({
        selection: { anchor: lineInfo.from },
        effects
      });
    }

    // Update Highlight Range
    view.dispatch({
      effects: setHighlightRange.of(highlightRange || null)
    });

  }, [lineNumber, highlightRange, content]); // Re-run when these change (content dependency ensures it runs after init)

  return (
    <div
      ref={editorRef}
      className="h-full w-full overflow-hidden bg-[#282c34]"
    />
  );
};
