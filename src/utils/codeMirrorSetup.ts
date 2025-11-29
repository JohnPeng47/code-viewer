import { Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap, highlightActiveLine, drawSelection, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { java } from "@codemirror/lang-java";
import { markdown } from "@codemirror/lang-markdown";

export const theme = oneDark;

export const baseExtensions: Extension[] = [
  lineNumbers(),
  highlightActiveLine(),
  drawSelection(),
  keymap.of(defaultKeymap),
  EditorState.readOnly.of(true), // Always read-only for this viewer
];

const languageMap: Record<string, () => Extension> = {
  javascript: javascript,
  jsx: () => javascript({ jsx: true }),
  typescript: () => javascript({ typescript: true }),
  tsx: () => javascript({ typescript: true, jsx: true }),
  python: python,
  json: json,
  html: html,
  css: css,
  java: java,
  markdown: markdown,
  bash: () => [], // Fallback or find specific package
  text: () => [],
};

export const getLanguageExtension = (lang: string): Extension => {
  const factory = languageMap[lang.toLowerCase()] || languageMap.text;
  return factory();
};

