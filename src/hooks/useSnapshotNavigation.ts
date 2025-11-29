import { useState, useCallback, useEffect } from 'react';
import { CodeSnapshot } from '../types';
import { contentCache } from '../services/contentService';

export function useSnapshotNavigation(
  snapshots: CodeSnapshot[],
  initialIndex: number = 0,
  token?: string
) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Bounds checking
  useEffect(() => {
    if (currentIndex >= snapshots.length && snapshots.length > 0) {
      setCurrentIndex(snapshots.length - 1);
    }
  }, [snapshots.length, currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, snapshots.length - 1));
  }, [snapshots.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < snapshots.length) {
      setCurrentIndex(index);
    }
  }, [snapshots.length]);

  // Prefetch adjacent
  useEffect(() => {
    const indicesToPrefetch = [currentIndex + 1, currentIndex - 1];

    indicesToPrefetch.forEach(idx => {
      if (idx >= 0 && idx < snapshots.length) {
        const snapshot = snapshots[idx];
        if (!snapshot.cachedContent) {
          contentCache.fetchContent(snapshot.githubUrl, token).catch(err => {
            // Log prefetch errors but don't disrupt UI
            console.warn(`[Prefetch] Failed to prefetch ${snapshot.githubUrl}`, err);
          });
        }
      }
    });
  }, [currentIndex, snapshots, token]);

  return {
    currentIndex,
    currentSnapshot: snapshots[currentIndex],
    goToNext,
    goToPrevious,
    goToIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === snapshots.length - 1
  };
}

