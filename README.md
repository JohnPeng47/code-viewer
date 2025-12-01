# Code Snapshot Widget

A powerful React component for creating "Code Flow" presentations. It renders sequential GitHub code snapshots with professional syntax highlighting (via CodeMirror 6), smooth scrolling navigation, and contextual descriptions.

Ideal for technical blog posts, tutorials, or documentation where walking through a codebase is necessary.

## Features

- 🚀 **CodeMirror 6 Engine**: High-performance rendering with true syntax analysis (not just regex).
- ⚡ **Smart Caching**: Built-in global service layer handles request deduplication and caching (1-hour TTL).
- 🎯 **Precise Navigation**: Auto-scrolls to specific lines and highlights ranges (e.g., `L30-L45`).
- 🔒 **Private Repo Support**: Optional GitHub token integration for fetching content from private repositories.
- ⌨️ **Accessible**: Scoped keyboard navigation (Arrow keys) and ARIA-compliant controls.
- 🎨 **One Dark Theme**: Professional, dark-mode aesthetic by default.

## Installation

```bash
npm install code-snapshot-widget
# or
yarn add code-snapshot-widget
```

## Usage

1. Import the component and styles:

```tsx
import { CodeSnapshotWidget } from "code-snapshot-widget";
// Import main styles (includes Tailwind utilities if not already present)
import "code-snapshot-widget/styles.css";
```

2. Define your snapshots and render:

```tsx
const mySnapshots = [
  {
    githubUrl: "https://github.com/facebook/react/blob/main/packages/react/src/ReactHooks.js#L42",
    lineNumber: 42,
    description: "This is where the hook dispatcher is initialized.",
    highlightRange: [42, 45] // Optional: highlights lines 42-45
  },
  {
    githubUrl: "https://github.com/facebook/react/blob/main/packages/react/src/ReactHooks.js#L88",
    lineNumber: 88,
    description: "Here we see the useState implementation."
  }
];

function MyTutorial() {
  return (
    <div style={{ height: '600px' }}>
      <CodeSnapshotWidget 
        snapshots={mySnapshots} 
        githubToken={process.env.GITHUB_TOKEN} // Optional
      />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `snapshots` | `CodeSnapshot[]` | Array of snapshot objects (see below). |
| `initialIndex` | `number` | Index to start on (default: 0). |
| `githubToken` | `string` | GitHub Personal Access Token for increased rate limits or private repos. |
| `height` | `string \| number` | Height of the widget (default: "600px"). |
| `className` | `string` | Custom classes for the container. |

### CodeSnapshot Interface

```typescript
interface CodeSnapshot {
  githubUrl: string;       // Full GitHub blob URL
  lineNumber: number;      // Line to focus/center
  description?: string;    // Contextual text shown in footer
  highlightRange?: [number, number]; // [start, end] inclusive range to highlight
  cachedContent?: string;  // Optional: provide content directly to skip fetch
}
```

## Architecture

This project is built with performance and reliability in mind:

- **`ContentCacheService`**: A singleton service that manages all network requests, providing request deduplication and in-memory caching.
- **CodeMirror 6**: Uses the latest CodeMirror for robust, accessible, and performant text rendering.
- **Scoped Events**: Keyboard listeners are scoped to the widget container to prevent conflicts with other page elements.

## Development

```bash
# Install dependencies
npm install

# Run the demo playground
npm run dev

# Build the library
npm run build
```
