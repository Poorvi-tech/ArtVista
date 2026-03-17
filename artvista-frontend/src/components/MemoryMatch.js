import React, { useEffect, useMemo, useState } from "react";
import { useGameProgress } from "../games/progress/useGameProgress";
import LevelPicker from "../games/ui/LevelPicker";

const MemoryMatch = ({ difficulty = "easy", onComplete }) => {
  const mode = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";
  const TOTAL_LEVELS = 10;
  const progress = useGameProgress({ gameId: "memory-match", difficulty: mode, totalLevels: TOTAL_LEVELS });

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [lastLevelScore, setLastLevelScore] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);

  const symbolPool = useMemo(
    () => [
      "🎨", "🖌️", "🖼️", "🧩", "🗿", "🏺", "🎭", "🎟️", "🧠", "📚",
      "🧵", "🪡", "🪶", "🕯️", "🪞", "🧿", "🧪", "🧊", "🧸", "🎻",
      "🎷", "🎺", "🎹", "🪈", "🧭", "⏳", "🗺️", "🪴", "🌙", "⭐",
      "☀️", "🌈", "🌊", "🌸", "🍃", "🔥", "💎", "🧱", "🪵", "🖍️",
    ],
    []
  );

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const levelIndex = progress.level - 1;
  const pairsForLevel = useMemo(() => {
    // scale pairs by difficulty and level (cap to pool)
    const base = mode === "hard" ? 6 : mode === "medium" ? 5 : 4;
    const pairs = base + levelIndex; // L1..L10 => base..base+9
    return clamp(pairs, 4, Math.min(14, Math.floor(symbolPool.length)));
  }, [mode, levelIndex, symbolPool.length]);

  const timeLimitSec = useMemo(() => {
    const base = mode === "hard" ? 60 : mode === "medium" ? 75 : 90;
    const step = mode === "hard" ? 3 : mode === "medium" ? 2 : 2;
    return clamp(base - step * levelIndex, 35, base);
  }, [mode, levelIndex]);

  const gridCols = useMemo(() => {
    // choose visually balanced columns
    const n = pairsForLevel * 2;
    if (n <= 10) return 5;
    if (n <= 12) return 6;
    if (n <= 16) return 8;
    if (n <= 20) return 10;
    return 10;
  }, [pairsForLevel]);

  useEffect(() => {
    if (!gameStarted) return;
    // Initialize (or re-initialize) current level
    const symbols = symbolPool.slice(0, pairsForLevel);
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setIsRunning(true);
    setLevelComplete(false);
    setLastLevelScore(null);
    setLockBoard(false);
  }, [gameStarted, mode, progress.level, symbolPool, pairsForLevel]);

  useEffect(() => {
    let interval;
    if (isRunning && !levelComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, levelComplete]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setIsRunning(false);
      const base = mode === "easy" ? 140 : mode === "medium" ? 180 : 220;
      const completionBonus = pairsForLevel * 12;
      const timeBonus = Math.max(0, (timeLimitSec - timer) * 3);
      const movePenalty = Math.max(0, moves - pairsForLevel * 2) * 3;
      const score = Math.max(40, Math.round(base + completionBonus + timeBonus - movePenalty));
      setLastLevelScore(score);
      setTotalScore((prev) => prev + score);
      setLevelComplete(true);
      progress.markLevelComplete({ levelNumber: progress.level, score: totalScore + score });

      const submittedLevel = progress.level;
      if (submittedLevel === TOTAL_LEVELS) {
        if (onComplete) onComplete(totalScore + score, TOTAL_LEVELS, mode);
      }
    }
  }, [matched, cards, moves, timer, onComplete, mode, pairsForLevel, timeLimitSec, totalScore, progress]);

  useEffect(() => {
    if (!gameStarted) return;
    if (timer >= timeLimitSec && isRunning) {
      setIsRunning(false);
      setLockBoard(true);
    }
  }, [timer, timeLimitSec, isRunning, gameStarted]);

  const handleFlip = (id) => {
    if (!isRunning || lockBoard || levelComplete) return;
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(prev => prev + 1);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setMatched(prev => [...prev, firstId, secondId]);
          setFlipped([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: 20 }}>
      {!gameStarted ? (
        <div className="gameCard gameCardPad" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 14px", color: "rgba(15, 23, 42, 0.72)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Flip two cards to find matching pairs. Each difficulty has <strong>10 levels</strong> with more pairs and less time.
          </p>
          <button className="gameBtn gameBtnPrimary" onClick={() => { setGameStarted(true); setTotalScore(0); progress.setLevelNumber(1); }}>
            Start 10-Level Challenge
          </button>
          <div style={{ marginTop: 12, color: "rgba(15, 23, 42, 0.55)", fontSize: "0.95rem" }}>
            Progress is saved automatically for this difficulty.
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <LevelPicker
            progress={progress}
            totalLevels={TOTAL_LEVELS}
            onSelectLevel={(n) => {
              setLevelComplete(false);
              setLockBoard(false);
              setLastLevelScore(null);
              progress.setLevelNumber(n);
            }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
            <span className="gamePill">
              <strong>Level</strong> {progress.level}/{TOTAL_LEVELS}
            </span>
            <span className="gamePill">
              <strong>Pairs</strong> {pairsForLevel}
            </span>
            <span className="gamePill">
              <strong>Moves</strong> {moves}
            </span>
            <span className="gamePill">
              <strong>Time</strong> {formatTime(timer)} / {formatTime(timeLimitSec)}
            </span>
            <span className="gamePill">
              <strong>Total</strong> {totalScore}
            </span>
            <button className="gameBtn" onClick={() => { progress.resetProgress(); setGameStarted(false); setTotalScore(0); }}>
              Reset Progress
            </button>
          </div>

          <div className="gameCard gameCardPad">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
              <div style={{ fontWeight: 900 }}>Find all matches</div>
              <div style={{ color: "rgba(15, 23, 42, 0.68)", fontWeight: 750 }}>
                Matched {matched.length / 2} / {cards.length / 2}
              </div>
            </div>

            <div style={{ marginTop: 12 }} className="gameMeter" aria-hidden="true">
              <div
                className="gameMeterFill"
                style={{
                  width: `${cards.length ? Math.round((matched.length / cards.length) * 100) : 0}%`,
                  background: "linear-gradient(90deg, rgba(255,154,139,0.95), rgba(255,106,136,0.95))",
                }}
              />
            </div>

            {lockBoard && !levelComplete ? (
              <div style={{ marginTop: 14 }} className="gameToast gameToastDanger">
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Time’s up</div>
                <div style={{ color: "rgba(15, 23, 42, 0.72)", lineHeight: 1.6 }}>
                  You ran out of time for this level. Try again to unlock the next one.
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="gameBtn gameBtnPrimary"
                    onClick={() => {
                      setLockBoard(false);
                      setIsRunning(true);
                      setTimer(0);
                      setMoves(0);
                      setFlipped([]);
                      setMatched([]);
                      const symbols = symbolPool.slice(0, pairsForLevel);
                      const deck = [...symbols, ...symbols]
                        .sort(() => Math.random() - 0.5)
                        .map((symbol, index) => ({ id: index, symbol }));
                      setCards(deck);
                    }}
                  >
                    Retry Level
                  </button>
                </div>
              </div>
            ) : null}

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                gap: 10,
              }}
            >
              {cards.map((card) => {
                const isUp = flipped.includes(card.id) || matched.includes(card.id);
                const isMatched = matched.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    className="gameBtn"
                    onClick={() => handleFlip(card.id)}
                    disabled={lockBoard || levelComplete || isMatched}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: 14,
                      border: "1px solid rgba(15,23,42,0.10)",
                      background: isUp ? "linear-gradient(135deg, rgba(255,154,139,0.95), rgba(255,106,136,0.95))" : "rgba(255,255,255,0.85)",
                      color: isUp ? "white" : "rgba(15,23,42,0.80)",
                      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(1.25rem, 2.2vw, 1.9rem)",
                      fontWeight: 900,
                      cursor: lockBoard || levelComplete || isMatched ? "not-allowed" : "pointer",
                      transform: isMatched ? "scale(0.98)" : "none",
                      opacity: isMatched ? 0.92 : 1,
                    }}
                    aria-label={isUp ? `Card ${card.symbol}` : "Hidden card"}
                  >
                    {isUp ? card.symbol : "?"}
                  </button>
                );
              })}
            </div>
          </div>

          {levelComplete ? (
            <div style={{ marginTop: 14 }} className="gameToast gameToastSuccess">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                <div style={{ fontWeight: 950 }}>Level complete · +{lastLevelScore ?? 0} points</div>
                <div style={{ color: "rgba(15, 23, 42, 0.70)", fontWeight: 750 }}>
                  Moves {moves} · Time {formatTime(timer)}
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="gameBtn gameBtnPrimary"
                  onClick={() => {
                    if (progress.level >= TOTAL_LEVELS) {
                      setGameStarted(false);
                      return;
                    }
                    setLevelComplete(false);
                    setLockBoard(false);
                    // next level will auto-init from effect when progress.level changes
                  }}
                >
                  {progress.level >= TOTAL_LEVELS ? "Back to menu" : "Next level"}
                </button>
                <button
                  className="gameBtn"
                  onClick={() => {
                    // replay current unlocked level (no score reset)
                    setLevelComplete(false);
                    setLockBoard(false);
                    setIsRunning(true);
                    setTimer(0);
                    setMoves(0);
                    setFlipped([]);
                    setMatched([]);
                    const symbols = symbolPool.slice(0, pairsForLevel);
                    const deck = [...symbols, ...symbols]
                      .sort(() => Math.random() - 0.5)
                      .map((symbol, index) => ({ id: index, symbol }));
                    setCards(deck);
                  }}
                >
                  Replay level
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;