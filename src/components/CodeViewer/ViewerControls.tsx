import React, { useEffect, useRef } from "react";

interface ViewerControlsProps {
  currentIndex: number;
  totalSnapshots: number;
  onPrevious: () => void;
  onNext: () => void;
  description?: string;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  currentIndex,
  totalSnapshots,
  onPrevious,
  onNext,
  description,
}) => {
  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="rounded px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          aria-label="Previous snapshot"
        >
          ← Prev
        </button>

        <div className="flex-1 text-center">
          <div className="text-sm font-medium text-slate-200">
            {currentIndex + 1} <span className="text-slate-500">/</span> {totalSnapshots}
          </div>
          {description && (
            <div className="mt-1 text-xs text-slate-400 truncate max-w-xl mx-auto">
              {description}
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={currentIndex === totalSnapshots - 1}
          className="rounded px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          aria-label="Next snapshot"
        >
          Next →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / totalSnapshots) * 100}%` }}
        />
      </div>
    </div>
  );
};

