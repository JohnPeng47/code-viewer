import React from "react";
import { CodeSnapshotWidget } from "../../src";
import { sampleSnapshots } from "./sampleData";
import "../../src/styles.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-4xl font-bold mb-2">Code Snapshot Widget Demo</h1>
          <p className="text-slate-400">
            Use the arrow keys or buttons below the widget to move between snapshots.
          </p>
        </header>
        <CodeSnapshotWidget snapshots={sampleSnapshots} height="720px" />
      </div>
    </div>
  );
};

export default App;
