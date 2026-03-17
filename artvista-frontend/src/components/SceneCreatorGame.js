import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useGameProgress } from "../games/progress/useGameProgress";
import LevelPicker from "../games/ui/LevelPicker";

const SceneCreatorGame = ({ difficulty = "beginner", onComplete }) => {
  const { user } = useAuth();
  const mode = ["beginner", "intermediate", "expert"].includes(difficulty) ? difficulty : "beginner";
  const TOTAL_LEVELS = 10;
  const progress = useGameProgress({ gameId: "scene-creator", difficulty: mode, totalLevels: TOTAL_LEVELS });

  const [gameId, setGameId] = useState(null);
  const [background, setBackground] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [placedItems, setPlacedItems] = useState([]);
  const [runScore, setRunScore] = useState(0);
  const [submitState, setSubmitState] = useState({ status: "idle", text: "" }); // idle|ok|fail
  const [pendingElement, setPendingElement] = useState(null); // element type waiting for click-to-place

  const canvasRef = useRef(null);
  const dragRef = useRef(null); // { id, dx, dy }

  // Colors and icons for elements
  const elementStyles = {
    Tree: { color: "#4CAF50", icon: "🌳" },
    River: { color: "#2196F3", icon: "🌊" },
    House: { color: "#795548", icon: "🏠" },
    Sun: { color: "#FFEB3B", icon: "☀️" },
    Mountain: { color: "#9E9E9E", icon: "⛰️" },
    Cloud: { color: "#E0E0E0", icon: "☁️" },
    Flower: { color: "#E91E63", icon: "🌸" },
    Bird: { color: "#FF9800", icon: "🦅" },
    Bridge: { color: "#5D4037", icon: "🌉" },
    Boat: { color: "#FF5722", icon: "⛵" },
    Castle: { color: "#9C27B0", icon: "🏰" },
    Star: { color: "#FFC107", icon: "⭐" },
  };
  
  const bgColors = {
    Mountain: "linear-gradient(to bottom, #87CEEB, #E0E0E0, #9E9E9E)",
    Beach: "linear-gradient(to bottom, #87CEEB, #2196F3, #FFD54F)",
    Forest: "linear-gradient(to bottom, #87CEEB, #4CAF50, #2E7D32)",
    City: "linear-gradient(to bottom, #757575, #9E9E9E, #616161)",
    Space: "linear-gradient(to bottom, #000000, #1A237E, #311B92)"
  };

  const fetchSuggestions = useCallback(async (id = gameId) => {
    if (!id) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/scene-creator/get_suggestions/${id}`);
      const data = await response.json();
      setAiSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  }, [gameId]);

  const startGame = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/scene-creator/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: user?.displayName || "Guest",
          user_id: user?.uid || user?.id || 1,
        }),
      });
      const data = await response.json();
      if (data.game_id) {
        setGameId(data.game_id);
        setMessage(data.message);
        fetchSuggestions(data.game_id);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error starting game.");
    }
    setLoading(false);
  }, [fetchSuggestions, user]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const levelTargets = useCallback(() => {
    // frontend-only targets: scale expectations with level + difficulty
    const li = Math.max(0, (progress.level || 1) - 1);
    const basePoints = mode === "expert" ? 90 : mode === "intermediate" ? 75 : 60;
    const baseElements = mode === "expert" ? 6 : mode === "intermediate" ? 5 : 4;
    return {
      targetPoints: basePoints + li * (mode === "expert" ? 12 : 10),
      targetElements: baseElements + li,
    };
  }, [mode, progress.level]);

  const handleSelectBackground = async (bg) => {
    if (!gameId) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/scene-creator/choose_background/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: bg }),
      });
      const data = await response.json();
      setBackground(data.background);
      setMessage(data.message);
      setPlacedItems([]);
      setRunScore(0);
      setSubmitState({ status: "idle", text: "" });
      setPendingElement(null);
      // Backend may take a moment to switch from background->element suggestions.
      fetchSuggestions();
      setTimeout(() => fetchSuggestions(), 500);
      setTimeout(() => fetchSuggestions(), 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const getCanvasSize = () => {
    const el = canvasRef.current;
    if (!el) return { w: 1, h: 1 };
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const selectElementToPlace = (type) => {
    if (!background) return;
    setPendingElement(type);
    setSubmitState({ status: "idle", text: "" });
  };

  const placePendingElementAt = (x, y) => {
    if (!pendingElement) return;
    const { w, h } = getCanvasSize();
    const margin = 28; // keep emoji away from edges
    const id = `${pendingElement}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setPlacedItems((prev) => [
      ...prev,
      {
        id,
        type: pendingElement,
        x: clamp(x, margin, w - margin),
        y: clamp(y, margin, h - margin),
      },
    ]);
    setPendingElement(null);
    setSubmitState({ status: "idle", text: "" });
  };

  const removeItem = (id) => setPlacedItems((prev) => prev.filter((p) => p.id !== id));

  const placementRules = useMemo(() => {
    // Very simple, readable scoring rules by background.
    // Score is based on which zone the element is placed into.
    // Zones: top, mid, bottom; left, center, right (3x3 grid).
    const forBg = {
      Mountain: {
        Sun: ["top-center", "top-right"],
        Cloud: ["top-left", "top-center", "top-right"],
        Bird: ["top-left", "top-center", "top-right"],
        Mountain: ["mid-left", "mid-center", "mid-right"],
        Tree: ["bottom-left", "bottom-right"],
        River: ["bottom-center", "bottom-left", "bottom-right"],
        House: ["bottom-left", "bottom-right"],
        Flower: ["bottom-left", "bottom-right"],
        Bridge: ["bottom-center"],
        Boat: ["bottom-center"],
        Castle: ["mid-left", "mid-right"],
        Star: ["top-left", "top-center", "top-right"],
      },
      Beach: {
        Sun: ["top-right", "top-center"],
        Cloud: ["top-left", "top-center"],
        Bird: ["top-left", "top-center", "top-right"],
        Boat: ["bottom-center", "bottom-right"],
        River: ["bottom-left", "bottom-center"],
        Bridge: ["mid-center"],
        Flower: ["bottom-left", "bottom-right"],
        Tree: ["bottom-left", "bottom-right"],
        House: ["mid-right", "mid-left"],
        Castle: ["mid-center"],
        Star: ["top-left", "top-center", "top-right"],
        Mountain: ["mid-left", "mid-right"],
      },
      Forest: {
        Sun: ["top-center"],
        Cloud: ["top-left", "top-center", "top-right"],
        Bird: ["top-left", "top-center", "top-right"],
        Tree: ["bottom-left", "bottom-center", "bottom-right", "mid-left", "mid-right"],
        River: ["bottom-center", "mid-center"],
        House: ["mid-left", "mid-right", "bottom-right"],
        Flower: ["bottom-left", "bottom-right", "bottom-center"],
        Bridge: ["mid-center"],
        Boat: ["mid-center", "bottom-center"],
        Castle: ["mid-center"],
        Star: ["top-left", "top-center", "top-right"],
        Mountain: ["mid-left", "mid-right"],
      },
      City: {
        Sun: ["top-right", "top-center"],
        Cloud: ["top-left", "top-center"],
        Bird: ["top-left", "top-center", "top-right"],
        House: ["bottom-left", "bottom-center", "bottom-right"],
        Castle: ["mid-center", "mid-left", "mid-right"],
        Bridge: ["mid-center"],
        River: ["bottom-center"],
        Boat: ["bottom-center"],
        Tree: ["bottom-left", "bottom-right"],
        Flower: ["bottom-left", "bottom-right"],
        Star: ["top-left", "top-center", "top-right"],
        Mountain: ["mid-left", "mid-right"],
      },
      Space: {
        Star: ["top-left", "top-center", "top-right", "mid-left", "mid-center", "mid-right"],
        Sun: ["mid-center"],
        Cloud: [],
        Bird: [],
        Mountain: [],
        River: [],
        Tree: [],
        House: [],
        Flower: [],
        Bridge: [],
        Boat: [],
        Castle: ["mid-center"],
      },
    };
    return forBg;
  }, []);

  const getZone = (x, y) => {
    const { w, h } = getCanvasSize();
    const col = x < w / 3 ? "left" : x < (2 * w) / 3 ? "center" : "right";
    const row = y < h / 3 ? "top" : y < (2 * h) / 3 ? "mid" : "bottom";
    return `${row}-${col}`;
  };

  const scorePlacement = (item) => {
    if (!background) return 0;
    const rules = placementRules[background] || {};
    const preferred = rules[item.type] || [];
    const z = getZone(item.x, item.y);
    if (preferred.includes(z)) return 30;
    // small partial credit if correct row only
    const row = z.split("-")[0];
    const rowMatch = preferred.some((p) => p.startsWith(row));
    return rowMatch ? 18 : 8;
  };

  useEffect(() => {
    const sum = placedItems.reduce((acc, it) => acc + scorePlacement(it), 0);
    setRunScore(sum);
  }, [placedItems, background]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitLevel = () => {
    if (!background) {
      setSubmitState({ status: "fail", text: "Select a background first." });
      return;
    }
    if (placedItems.length < targetElements) {
      setSubmitState({ status: "fail", text: `Place at least ${targetElements} elements to submit.` });
      return;
    }

    const earned = runScore;
    const passed = earned >= targetPoints;
    if (!passed) {
      setSubmitState({ status: "fail", text: `Not enough points. You got ${earned}/${targetPoints}. Replay this level.` });
      // replay same level (reset run), do NOT unlock next
      setPlacedItems([]);
      setRunScore(0);
      setGameCompleted(false);
      setGameStats({ points: earned, status: "failed" });
      return;
    }

    setSubmitState({ status: "ok", text: `Great! You scored ${earned}/${targetPoints}. Level unlocked.` });
    setGameCompleted(true);
    setGameStats({ points: earned, status: "completed", badges: [] });

    const submittedLevel = progress.level;
    const nextTotal = totalScore + earned;
    setTotalScore(nextTotal);
    progress.markLevelComplete({ levelNumber: submittedLevel, score: nextTotal });
    if (submittedLevel === TOTAL_LEVELS) {
      if (onComplete) onComplete(nextTotal, [], mode);
    }
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onPointerMove = (e) => {
      if (!dragRef.current) return;
      const { id, dx, dy } = dragRef.current;
      const rect = el.getBoundingClientRect();
      const margin = 28;
      const x = clamp(e.clientX - rect.left - dx, margin, rect.width - margin);
      const y = clamp(e.clientY - rect.top - dy, margin, rect.height - margin);
      setPlacedItems((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
    };
    const onPointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [canvasRef]);

  if (!gameId && loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading Game...</div>;
  }

  const { targetPoints, targetElements } = levelTargets();
  const pointsPct = Math.max(0, Math.min(100, Math.round((runScore / Math.max(1, targetPoints)) * 100)));
  const elementsPct = Math.max(0, Math.min(100, Math.round((placedItems.length / Math.max(1, targetElements)) * 100)));

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="gameCard gameCardPad" style={{ marginBottom: 14 }}>
          <LevelPicker
            progress={progress}
            totalLevels={TOTAL_LEVELS}
            onSelectLevel={(n) => {
              setGameCompleted(false);
              setBackground(null);
              setGameStats(null);
              setMessage("");
              setPlacedItems([]);
              setRunScore(0);
              setSubmitState({ status: "idle", text: "" });
              progress.setLevelNumber(n);
              startGame();
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 950, fontSize: "1.2rem" }}>
                AI Scene Creator · Level {progress.level}/{TOTAL_LEVELS}
              </div>
              <div style={{ color: "rgba(15, 23, 42, 0.68)", marginTop: 4 }}>
                10 Levels · Complete scenes by following AI suggestions.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span className="gamePill">
                <strong>Total</strong> {totalScore}
              </span>
              <span className="gamePill">
                <strong>Unlocked</strong> {progress.completedCount}/{TOTAL_LEVELS}
              </span>
              <button
                className="gameBtn"
                onClick={() => {
                  progress.resetProgress();
                  setTotalScore(0);
                  setGameCompleted(false);
                  setBackground(null);
                  setPlacedItems([]);
                  setRunScore(0);
                  setSubmitState({ status: "idle", text: "" });
                  setPendingElement(null);
                  startGame();
                }}
              >
                Reset Progress
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
            <div className="gameToast">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Level goals</div>
              <div style={{ color: "rgba(15, 23, 42, 0.72)", lineHeight: 1.6 }}>
                Target points: <strong>{targetPoints}</strong>
                <br />
                Target elements: <strong>{targetElements}</strong>
              </div>
            </div>
            <div className="gameToast">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Current run</div>
              <div style={{ color: "rgba(15, 23, 42, 0.72)", lineHeight: 1.6 }}>
                Points: <strong>{runScore}</strong> · Elements: <strong>{placedItems.length}</strong>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 750, color: "rgba(15, 23, 42, 0.75)" }}>
                  <span>Points</span><span>{pointsPct}%</span>
                </div>
                <div className="gameMeter" aria-hidden="true" style={{ marginTop: 6 }}>
                  <div className="gameMeterFill" style={{ width: `${pointsPct}%`, background: "linear-gradient(90deg, rgba(255,154,139,0.95), rgba(255,106,136,0.95))" }} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 750, color: "rgba(15, 23, 42, 0.75)" }}>
                  <span>Elements</span><span>{elementsPct}%</span>
                </div>
                <div className="gameMeter" aria-hidden="true" style={{ marginTop: 6 }}>
                  <div className="gameMeterFill" style={{ width: `${elementsPct}%`, background: "linear-gradient(90deg, rgba(34,197,94,0.92), rgba(22,163,74,0.92))" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Board */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14, alignItems: "start" }}>
        
        {/* Canvas Area */}
          <div className="gameCard gameCardPad" style={{ minHeight: 420 }}>
            <div style={{
              width: "100%", height: 360,
              background: background ? bgColors[background] : "rgba(15,23,42,0.04)",
              borderRadius: 16, position: "relative",
              boxShadow: "0 14px 42px rgba(15,23,42,0.12)",
              border: background ? "2px solid rgba(255,106,136,0.45)" : "2px dashed rgba(15,23,42,0.18)",
              overflow: "hidden",
              transition: "all 0.35s ease"
            }}>
              <div
                ref={canvasRef}
                style={{ position: "absolute", inset: 0 }}
                onPointerDown={(e) => {
                  if (!pendingElement) return;
                  const el = canvasRef.current;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  placePendingElementAt(e.clientX - rect.left, e.clientY - rect.top);
                }}
                role={pendingElement ? "button" : undefined}
                aria-label={pendingElement ? `Place ${pendingElement}` : undefined}
                title={pendingElement ? `Click to place ${pendingElement}` : undefined}
              />
              {!background ? (
                <div style={{ alignSelf: "center", color: "rgba(15,23,42,0.55)", width: "100%", textAlign: "center", fontSize: "1.05rem", fontWeight: 700 }}>
                  Pick a background from the AI suggestions to begin
                </div>
              ) : (
                <>
                  {placedItems.map((it) => (
                    <div
                      key={it.id}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(e) => {
                        const el = canvasRef.current;
                        if (!el) return;
                        const rect = el.getBoundingClientRect();
                        const localX = it.x;
                        const localY = it.y;
                        const dx = (e.clientX - rect.left) - localX;
                        const dy = (e.clientY - rect.top) - localY;
                        dragRef.current = { id: it.id, dx, dy };
                      }}
                      style={{
                        position: "absolute",
                        left: it.x,
                        top: it.y,
                        transform: "translate(-50%, -50%)",
                        fontSize: "3rem",
                        cursor: "grab",
                        userSelect: "none",
                        filter: "drop-shadow(2px 6px 10px rgba(15,23,42,0.25))",
                      }}
                      title={`Drag to place · ${it.type}`}
                    >
                      {elementStyles[it.type]?.icon || "❓"}
                      <button
                        type="button"
                        className="gameBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(it.id);
                        }}
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                        aria-label={`Remove ${it.type}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {message && !gameCompleted ? (
              <div style={{ marginTop: 12 }} className="gameToast">
                <strong>Status</strong>
                <div style={{ marginTop: 6, color: "rgba(15, 23, 42, 0.70)" }}>{message}</div>
              </div>
            ) : null}

            {submitState.status !== "idle" ? (
              <div
                style={{ marginTop: 12 }}
                className={`gameToast ${
                  submitState.status === "ok" ? "gameToastSuccess" : "gameToastDanger"
                }`}
              >
                <strong>{submitState.status === "ok" ? "Success" : "Try again"}</strong>
                <div style={{ marginTop: 6, color: "rgba(15, 23, 42, 0.70)" }}>{submitState.text}</div>
              </div>
            ) : null}

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="gameBtn gameBtnPrimary" onClick={submitLevel} disabled={!background}>
                Submit Level
              </button>
              <button
                className="gameBtn"
                onClick={() => {
                  setPlacedItems([]);
                  setRunScore(0);
                  setSubmitState({ status: "idle", text: "" });
                  setPendingElement(null);
                }}
                disabled={!background}
              >
                Replay level
              </button>
              {pendingElement ? (
                <div className="gamePill" style={{ marginLeft: "auto" }}>
                  <strong>Placing</strong> {elementStyles[pendingElement]?.icon} {pendingElement}
                  <button
                    className="gameBtn"
                    style={{ padding: "6px 10px", marginLeft: 8 }}
                    onClick={() => setPendingElement(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </div>

        {/* AI Suggestions Board */}
          <div className="gameCard gameCardPad">
            <div style={{ fontWeight: 950, marginBottom: 10 }}>AI Suggestions</div>
            {!aiSuggestions || gameCompleted ? (
              <div style={{ color: "rgba(15, 23, 42, 0.65)" }}>
                {gameCompleted ? "Complete the level to unlock the next one." : "Loading suggestions..."}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {aiSuggestions.suggestion_type === "background" && aiSuggestions.suggestions.map(bg => (
                  <button key={bg} onClick={() => handleSelectBackground(bg)} className="gameBtn gameBtnPrimary">
                    Set {bg}
                  </button>
                ))}
                {aiSuggestions.suggestion_type === "element" && aiSuggestions.suggestions.map(el => (
                  <button
                    key={el}
                    onClick={() => selectElementToPlace(el)}
                    className={`gameBtn${pendingElement === el ? " gameBtnPrimary" : ""}`}
                  >
                    {elementStyles[el]?.icon} Place {el}
                  </button>
                ))}
              </div>
            )}

            {/* Always-available fallback so the game is playable even if AI suggestions don't switch */}
            {!gameCompleted ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Add elements</div>
                {!background ? (
                  <div style={{ color: "rgba(15, 23, 42, 0.65)" }}>
                    Select a background first to start adding elements.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {Object.keys(elementStyles).map((el) => (
                      <button
                        key={el}
                        onClick={() => selectElementToPlace(el)}
                        className={`gameBtn${pendingElement === el ? " gameBtnPrimary" : ""}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                      >
                        <span style={{ fontSize: "1.15rem" }}>{elementStyles[el]?.icon}</span>
                        Place {el}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

        {/* Win Screen */}
        {gameCompleted && (
          <div className="gameToast gameToastSuccess" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 950, fontSize: "1.15rem" }}>
              Level complete · +{Number(gameStats?.points || 0)} points
            </div>
            <div style={{ marginTop: 6, color: "rgba(15, 23, 42, 0.75)", lineHeight: 1.6 }}>
              Level {progress.level}/{TOTAL_LEVELS} unlocked.
              {gameStats?.badges?.length ? (
                <>
                  <br />
                  Badges: <strong>{gameStats.badges.join(", ")}</strong>
                </>
              ) : null}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="gameBtn gameBtnPrimary"
                onClick={() => {
                  setGameCompleted(false);
                  setBackground(null);
                  setPlacedItems([]);
                  setRunScore(0);
                  setSubmitState({ status: "idle", text: "" });
                  startGame();
                }}
              >
                {progress.level >= TOTAL_LEVELS ? "Play again" : "Next level"}
              </button>
              <button
                className="gameBtn"
                onClick={() => {
                  setGameCompleted(false);
                  setBackground(null);
                  setPlacedItems([]);
                  setRunScore(0);
                  setSubmitState({ status: "idle", text: "" });
                  startGame();
                }}
              >
                Replay
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default SceneCreatorGame;
