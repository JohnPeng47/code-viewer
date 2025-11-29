# Code Snapshot Widget

A lightweight React component that renders sequential GitHub code snippets with syntax highlighting, contextual descriptions, and smooth navigation controls.

## Getting Started

```bash
npm install
npm run dev        # launches the demo playground
npm run build      # builds the library in dist/
```

### Basic Usage

```tsx
import { CodeSnapshotWidget } from "code-snapshot-widget";
import "code-snapshot-widget/styles.css";

const snapshots = [
  {
    githubUrl: "https://github.com/owner/repo/blob/main/file.ts#L42",
    lineNumber: 42,
    description: "Important initialization"
  }
];

function Example() {
  return <CodeSnapshotWidget snapshots={snapshots} />;
}
```

## Features

- Prism powered syntax highlighting with line centering and range highlighting.
- Keyboard and button navigation between steps.
- Optional GitHub token support for private repositories.
- Demo app built with Vite for quick manual testing.

## Development Notes

- The widget consumes GitHub blob URLs, fetches raw file contents, and caches responses locally for snappy navigation.
- Tailwind CSS powers the styling; importing `code-snapshot-widget/styles.css` ensures required utility classes are present.
