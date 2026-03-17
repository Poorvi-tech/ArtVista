import React, { useMemo } from "react";

export default function LevelPicker({ progress, totalLevels = 10, onSelectLevel }) {
  const unlockedUpTo = progress?.level ?? 1;
  const current = progress?.level ?? 1;

  const levels = useMemo(
    () => {
      const completedLevels = progress?.completedLevels || {};
      return Array.from({ length: totalLevels }, (_, i) => {
        const n = i + 1;
        const isUnlocked = n <= unlockedUpTo;
        const isCompleted = !!completedLevels[n];
        const isCurrent = n === current;
        return { n, isUnlocked, isCompleted, isCurrent };
      });
    },
    [totalLevels, unlockedUpTo, progress, current]
  );

  return (
    <div className="levelPicker" role="group" aria-label="Select level">
      {levels.map((l) => (
        <button
          key={l.n}
          type="button"
          className={`levelBtn${l.isCurrent ? " levelBtnCurrent" : ""}${l.isUnlocked ? "" : " levelBtnLocked"}`}
          onClick={() => {
            if (!l.isUnlocked) return;
            onSelectLevel?.(l.n);
          }}
          disabled={!l.isUnlocked}
          aria-disabled={!l.isUnlocked}
          aria-label={
            l.isUnlocked
              ? `Level ${l.n}${l.isCompleted ? ", completed" : ""}${l.isCurrent ? ", current" : ""}`
              : `Level ${l.n}, locked`
          }
          title={!l.isUnlocked ? "Win the previous level to unlock" : l.isCompleted ? "Completed" : "Unlocked"}
        >
          <span className="levelBtnNum">{l.n}</span>
          <span className="levelBtnMark" aria-hidden="true">
            {l.isUnlocked ? (l.isCompleted ? "✓" : "") : "🔒"}
          </span>
        </button>
      ))}
    </div>
  );
}

