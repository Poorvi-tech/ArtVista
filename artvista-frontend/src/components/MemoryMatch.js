import React, { useState, useEffect, useCallback } from "react";

const MemoryMatch = ({ difficulty = "easy", onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const calculateScore = useCallback(() => {
    const baseScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
    const timeBonus = Math.max(0, 300 - timer);
    const movePenalty = moves * 2;
    return Math.max(50, baseScore + timeBonus - movePenalty);
  }, [difficulty, timer, moves]);

  useEffect(() => {
    // Initialize game
    const symbols = ["🎨", "🖌️", "🖼️", "🎭", "🎪", "🎨", "🖌️", "🖼️", "🎭", "🎪"];
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    const gameCards = shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false
    }));
    setCards(gameCards);
    setIsRunning(true);
  }, [difficulty]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setIsRunning(false);
      const score = calculateScore();
      onComplete(score, moves, timer);
    }
  }, [matched, cards, moves, timer, onComplete, calculateScore]);

  const handleFlip = (id) => {
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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
        Memory Match - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </h2>
      
      {/* Game stats */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Moves:</strong> {moves}
        </div>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Time:</strong> {formatTime(timer)}
        </div>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Matches:</strong> {matched.length / 2} / {cards.length / 2}
        </div>
      </div>

      {/* Game board */}
      <div style={{
        display: "grid",
        gridTemplateColumns: difficulty === "easy" ? "repeat(4, 1fr)" : 
                           difficulty === "medium" ? "repeat(5, 1fr)" : "repeat(6, 1fr)",
        gap: "15px",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px"
      }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.id);
          
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                height: "100px",
                background: isFlipped || isMatched ? "#FF6A88" : "#FFE5EC",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transform: isFlipped || isMatched ? "rotateY(0deg)" : "rotateY(180deg)",
                transition: "transform 0.3s, background 0.3s",
                border: "2px solid #FF6A88",
                transformStyle: "preserve-3d"
              }}
            >
              <div style={{ 
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden"
              }}>
                ❓
              </div>
              <div style={{ 
                position: "absolute",
                backfaceVisibility: "hidden"
              }}>
                {card.symbol}
              </div>
            </div>
          );
        })}
      </div>

      {/* Win screen */}
      {matched.length === cards.length && cards.length > 0 && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
          zIndex: 1000,
          border: "2px solid #FF6A88"
        }}>
          <h3 style={{ color: "#FF6A88", marginBottom: "20px" }}>🎉 Congratulations! 🎉</h3>
          <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
            You completed the {difficulty} level!
          </p>
          <p style={{ marginBottom: "15px" }}>
            <strong>Final Score:</strong> {calculateScore()} points
          </p>
          <p style={{ marginBottom: "20px" }}>
            Moves: {moves} | Time: {formatTime(timer)}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#FF6A88",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;