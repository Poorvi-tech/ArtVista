import React, { useEffect, useMemo, useState } from "react";
import { useGameProgress } from "../games/progress/useGameProgress";
import LevelPicker from "../games/ui/LevelPicker";

// Target colors for different difficulties
const TARGET_COLORS_BY_DIFFICULTY = {
  easy: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"],
  medium: [
    "#FF8000", "#80FF00", "#00FF80", "#0080FF", "#8000FF", "#FF0080",
    "#FFBF00", "#BFFF00", "#00FFBF", "#00BFFF", "#BF00FF", "#FF00BF"
  ],
  hard: [
    "#FF4000", "#40FF00", "#00FF40", "#0040FF", "#4000FF", "#FF0040",
    "#FFA000", "#A0FF00", "#00FFA0", "#00A0FF", "#A000FF", "#FF00A0",
    "#FFC000", "#C0FF00", "#00FFC0", "#00C0FF", "#C000FF", "#FF00C0"
  ]
};

const ColorMixing = ({ difficulty = "easy", onComplete }) => {
  const mode = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";
  const TOTAL_LEVELS = 10;
  const progress = useGameProgress({ gameId: "color-mixing", difficulty: mode, totalLevels: TOTAL_LEVELS });

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  function colorDistance(color1, color2) {
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);

    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);

    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  }

  const [targetColor, setTargetColor] = useState("");
  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(255);
  const [blue, setBlue] = useState(255);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checking, setChecking] = useState(false);

  const levelTargets = useMemo(() => {
    const list = TARGET_COLORS_BY_DIFFICULTY[mode] || TARGET_COLORS_BY_DIFFICULTY.easy;
    // deterministic 10-level path (repeat if list shorter)
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => list[i % list.length]);
  }, [mode]);

  const thresholds = useMemo(() => {
    // Smaller is stricter; hard starts stricter.
    const base = mode === "hard" ? 28 : mode === "medium" ? 34 : 40;
    const end = mode === "hard" ? 10 : mode === "medium" ? 12 : 14;
    const steps = TOTAL_LEVELS - 1;
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => Math.round(base + ((end - base) * i) / steps));
  }, [mode]);

  const clamp255 = (n) => Math.max(0, Math.min(255, n));

  const currentHex = useMemo(() => rgbToHex(clamp255(red), clamp255(green), clamp255(blue)), [red, green, blue]);
  const distance = useMemo(() => (targetColor ? colorDistance(currentHex, targetColor) : null), [currentHex, targetColor]);

  const levelIndex = progress.level - 1;
  const currentThreshold = thresholds[levelIndex] ?? thresholds[0];
  const closeness = useMemo(() => {
    if (distance == null) return 0;
    // normalize: 0..~442 possible in RGB space; use 260 for nicer meter
    const max = 260;
    return Math.max(0, Math.min(100, Math.round((1 - Math.min(distance, max) / max) * 100)));
  }, [distance]);

  const closenessTone = useMemo(() => {
    if (distance == null) return { label: "Adjust sliders to begin", variant: "" };
    if (distance <= currentThreshold) return { label: "Ready to submit (within threshold)", variant: "Success" };
    if (distance <= currentThreshold * 1.8) return { label: "Very close", variant: "Warn" };
    return { label: "Keep tuning", variant: "Danger" };
  }, [distance, currentThreshold]);

  const initializeGame = () => {
    setGameStarted(true);
    setTotalScore(0);
    setRed(255);
    setGreen(255);
    setBlue(255);
    progress.setLevelNumber(1);
    setFeedback(null);
  };

  useEffect(() => {
    if (!gameStarted) return;
    setTargetColor(levelTargets[levelIndex] || levelTargets[0]);
    setFeedback(null);
    setChecking(false);
    // reset sliders each level for fairness
    setRed(255);
    setGreen(255);
    setBlue(255);
  }, [gameStarted, levelIndex, levelTargets]);

  // Handle color slider changes
  const handleColorChange = (color, value) => {
    const numValue = parseInt(value);
    if (color === "red") setRed(numValue);
    if (color === "green") setGreen(numValue);
    if (color === "blue") setBlue(numValue);
  };

  const scoreForDistance = (d, threshold) => {
    if (d == null) return 0;
    // Score curve: within threshold gets 100..70; beyond still gives small points.
    if (d <= threshold) {
      const ratio = 1 - d / Math.max(1, threshold);
      return Math.round(70 + ratio * 30);
    }
    const softMax = 160;
    const ratio = 1 - Math.min(d, softMax) / softMax;
    return Math.max(5, Math.round(ratio * 40));
  };

  const checkMatch = () => {
    if (checking) return;
    setChecking(true);

    const submittedLevel = progress.level;
    const d = distance ?? 999;
    const earned = scoreForDistance(d, currentThreshold);
    const passed = d <= currentThreshold;

    setTotalScore((prev) => prev + earned);
    setFeedback({
      passed,
      earned,
      distance: d,
      threshold: currentThreshold,
    });

    if (!passed) {
      setTimeout(() => setChecking(false), 500);
      return;
    }

    // Level complete: unlock next
    progress.markLevelComplete({ levelNumber: submittedLevel, score: totalScore + earned });

    setTimeout(() => {
      setChecking(false);
      if (submittedLevel === TOTAL_LEVELS) {
        if (onComplete) onComplete(totalScore + earned, TOTAL_LEVELS, mode);
      }
    }, 600);
  };

  const startCard = (
    <div className="gameCard gameCardPad" style={{ textAlign: "center" }}>
      <p style={{ margin: "0 0 14px", color: "rgba(15, 23, 42, 0.72)", fontSize: "1.05rem", lineHeight: 1.6 }}>
        Mix RGB to match the target color. Each difficulty has <strong>10 levels</strong> and gets stricter as you progress.
      </p>
      <button className="gameBtn gameBtnPrimary" onClick={initializeGame}>
        Start 10-Level Challenge
      </button>
      <div style={{ marginTop: 12, color: "rgba(15, 23, 42, 0.55)", fontSize: "0.95rem" }}>
        Progress is saved automatically for this difficulty.
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      {!gameStarted ? (
        startCard
      ) : (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <LevelPicker
            progress={progress}
            totalLevels={TOTAL_LEVELS}
            onSelectLevel={(n) => {
              setFeedback(null);
              setChecking(false);
              progress.setLevelNumber(n);
            }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
            <span className="gamePill">
              <strong>Level</strong> {progress.level}/{TOTAL_LEVELS}
            </span>
            <span className="gamePill">
              <strong>Score</strong> {totalScore}
            </span>
            <span className="gamePill">
              <strong>Pass</strong> distance ≤ {currentThreshold}
            </span>
            <button
              className="gameBtn"
              onClick={() => {
                progress.resetProgress();
                setGameStarted(false);
                setTotalScore(0);
                setFeedback(null);
                setChecking(false);
              }}
            >
              Reset Progress
            </button>
          </div>

          <div className="gameGrid2">
          <div className="gameCard gameCardPad">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ minWidth: 250 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Target</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      background: targetColor,
                      border: "1px solid rgba(15,23,42,0.10)",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 750, letterSpacing: 0.2 }}>{targetColor?.toUpperCase()}</div>
                    <div style={{ color: "rgba(15, 23, 42, 0.62)", fontSize: "0.95rem" }}>
                      Threshold: ≤ {currentThreshold}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ minWidth: 250 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Your mix</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      background: currentHex,
                      border: "1px solid rgba(15,23,42,0.10)",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 750, letterSpacing: 0.2 }}>{currentHex.toUpperCase()}</div>
                    <div style={{ color: "rgba(15, 23, 42, 0.62)", fontSize: "0.95rem" }}>
                      RGB({red}, {green}, {blue})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <div style={{ fontWeight: 800 }}>Closeness</div>
                <div style={{ color: "rgba(15, 23, 42, 0.68)", fontWeight: 700 }}>
                  {distance == null ? "—" : `${closeness}%`}{" "}
                  <span style={{ color: "rgba(15, 23, 42, 0.45)", fontWeight: 650 }}>
                    {distance == null ? "" : `(distance ${Math.round(distance)})`}
                  </span>
                </div>
              </div>
              <div className="gameMeter" aria-hidden="true" style={{ marginTop: 8 }}>
                <div
                  className="gameMeterFill"
                  style={{
                    width: `${closeness}%`,
                    background:
                      closenessTone.variant === "Success"
                        ? "linear-gradient(90deg, rgba(22,163,74,0.9), rgba(34,197,94,0.9))"
                        : closenessTone.variant === "Warn"
                        ? "linear-gradient(90deg, rgba(245,158,11,0.9), rgba(251,191,36,0.9))"
                        : "linear-gradient(90deg, rgba(239,68,68,0.9), rgba(248,113,113,0.9))",
                  }}
                />
              </div>
              <div style={{ marginTop: 10 }} className={`gameToast${closenessTone.variant ? ` gameToast${closenessTone.variant}` : ""}`}>
                <strong>{closenessTone.label}</strong>
                <div style={{ marginTop: 6, color: "rgba(15, 23, 42, 0.70)" }}>
                  Tip: the fastest way is to match the strongest channel first (R, G, or B) based on the target.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="gameBtn gameBtnPrimary" onClick={checkMatch} disabled={checking || distance == null}>
                {checking ? "Checking..." : "Submit Level"}
              </button>
              <button
                className="gameBtn"
                onClick={() => {
                  setRed(255);
                  setGreen(255);
                  setBlue(255);
                  setFeedback(null);
                }}
                disabled={checking}
              >
                Reset sliders
              </button>
            </div>

            {feedback ? (
              <div style={{ marginTop: 14 }} className={`gameToast ${feedback.passed ? "gameToastSuccess" : "gameToastDanger"}`}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800 }}>
                    {feedback.passed ? "Level passed" : "Not quite"} · +{feedback.earned} points
                  </div>
                  <div style={{ color: "rgba(15, 23, 42, 0.68)", fontWeight: 700 }}>
                    distance {Math.round(feedback.distance)} / threshold {feedback.threshold}
                  </div>
                </div>
                {!feedback.passed ? (
                  <div style={{ marginTop: 8, color: "rgba(15, 23, 42, 0.70)" }}>
                    Keep adjusting and submit again. You can retry as many times as you want.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="gameCard gameCardPad">
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Controls</div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 750 }}>
                  <span style={{ color: "#ef4444" }}>Red</span>
                  <span>{red}</span>
                </div>
                <input type="range" min="0" max="255" value={red} onChange={(e) => handleColorChange("red", e.target.value)} style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 750 }}>
                  <span style={{ color: "#22c55e" }}>Green</span>
                  <span>{green}</span>
                </div>
                <input type="range" min="0" max="255" value={green} onChange={(e) => handleColorChange("green", e.target.value)} style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 750 }}>
                  <span style={{ color: "#3b82f6" }}>Blue</span>
                  <span>{blue}</span>
                </div>
                <input type="range" min="0" max="255" value={blue} onChange={(e) => handleColorChange("blue", e.target.value)} style={{ width: "100%" }} />
              </div>

              <div className="gameToast" style={{ marginTop: 6 }}>
                <div style={{ fontWeight: 850, marginBottom: 6 }}>Unlocked</div>
                <div style={{ color: "rgba(15, 23, 42, 0.70)", lineHeight: 1.6 }}>
                  Completed: <strong>{progress.completedCount}</strong> / {TOTAL_LEVELS}
                  <br />
                  Best score: <strong>{progress.bestScore}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default ColorMixing;