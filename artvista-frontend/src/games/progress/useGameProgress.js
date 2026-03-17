import { useEffect, useMemo, useState } from "react";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function useGameProgress({ gameId, difficulty, totalLevels = 10 }) {
  const storageKey = useMemo(() => {
    const d = difficulty || "default";
    return `artvista_game_progress:${gameId}:${d}`;
  }, [gameId, difficulty]);

  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const parsed = safeJsonParse(raw);
    if (parsed && typeof parsed === "object") {
      const nextLevel = typeof parsed.level === "number" ? parsed.level : 1;
      const nextBest = typeof parsed.bestScore === "number" ? parsed.bestScore : 0;
      const nextCompleted = parsed.completedLevels && typeof parsed.completedLevels === "object" ? parsed.completedLevels : {};
      setLevel(clamp(nextLevel, 1, totalLevels));
      setBestScore(Math.max(0, nextBest));
      setCompletedLevels(nextCompleted);
    } else {
      setLevel(1);
      setBestScore(0);
      setCompletedLevels({});
    }
  }, [storageKey, totalLevels]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        level,
        bestScore,
        completedLevels,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [storageKey, level, bestScore, completedLevels]);

  const markLevelComplete = ({ levelNumber, score }) => {
    const ln = clamp(levelNumber, 1, totalLevels);
    setCompletedLevels((prev) => ({ ...prev, [ln]: true }));
    if (typeof score === "number") setBestScore((prev) => Math.max(prev, score));
    setLevel((prev) => clamp(Math.max(prev, ln + 1), 1, totalLevels));
  };

  const setLevelNumber = (next) => setLevel(clamp(next, 1, totalLevels));

  const resetProgress = () => {
    setLevel(1);
    setBestScore(0);
    setCompletedLevels({});
    localStorage.removeItem(storageKey);
  };

  const completedCount = Object.keys(completedLevels).filter((k) => completedLevels[k]).length;

  return {
    level,
    setLevelNumber,
    totalLevels,
    bestScore,
    completedLevels,
    completedCount,
    markLevelComplete,
    resetProgress,
    storageKey,
  };
}

