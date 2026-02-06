import React, { useState, useEffect, useCallback } from "react";

const MemoryMatch = ({ difficulty = "easy", onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  // Card sets for different difficulties
  const cardSets = {
    easy: [
      { id: 1, emoji: "🎨", name: "Palette" },
      { id: 2, emoji: "🖌️", name: "Brush" },
      { id: 3, emoji: "🖼️", name: "Frame" },
      { id: 4, emoji: "🎭", name: "Mask" },
      { id: 5, emoji: "🖍️", name: "Crayon" },
      { id: 6, emoji: "🧵", name: "Thread" }
    ],
    medium: [
      { id: 1, emoji: "🎨", name: "Palette" },
      { id: 2, emoji: "🖌️", name: "Brush" },
      { id: 3, emoji: "🖼️", name: "Frame" },
      { id: 4, emoji: "🎭", name: "Mask" },
      { id: 5, emoji: "🖍️", name: "Crayon" },
      { id: 6, emoji: "🧵", name: "Thread" },
      { id: 7, emoji: "✂️", name: "Scissors" },
      { id: 8, emoji: "📐", name: "Ruler" },
      { id: 9, emoji: "📎", name: "Clip" },
      { id: 10, emoji: "📌", name: "Pin" }
    ],
    hard: [
      { id: 1, emoji: "🎨", name: "Palette" },
      { id: 2, emoji: "🖌️", name: "Brush" },
      { id: 3, emoji: "🖼️", name: "Frame" },
      { id: 4, emoji: "🎭", name: "Mask" },
      { id: 5, emoji: "🖍️", name: "Crayon" },
      { id: 6, emoji: "🧵", name: "Thread" },
      { id: 7, emoji: "✂️", name: "Scissors" },
      { id: 8, emoji: "📐", name: "Ruler" },
      { id: 9, emoji: "📎", name: "Clip" },
      { id: 10, emoji: "📌", name: "Pin" },
      { id: 11, emoji: "📏", name: "Scale" },
      { id: 12, emoji: "🔨", name: "Hammer" },
      { id: 13, emoji: "🔧", name: "Wrench" },
      { id: 14, emoji: "⚙️", name: "Gear" }
    ]
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameActive && matched.length < cards.length / 2) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, matched.length, cards.length]);

  // Initialize game
  const initializeGame = () => {
    const baseCards = cardSets[difficulty];
    const gameCards = [...baseCards, ...baseCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`
      }));
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(true);
    setGameActive(true);
  };

  // Handle card flip
  const handleFlip = (uniqueId) => {
    if (flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId)) {
      return;
    }

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);
    setMoves(prev => prev + 1);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.uniqueId === firstId);
      const secondCard = cards.find(card => card.uniqueId === secondId);

      if (firstCard.id === secondCard.id) {
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

  // Check win condition
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameActive(false);
      const score = calculateScore();
      if (onComplete) {
        onComplete(score, moves, timer);
      }
    }
  }, [matched, cards, moves, timer, onComplete]);

  const calculateScore = useCallback(() => {
    const baseScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
    const timeBonus = Math.max(0, 300 - timer);
    const movePenalty = moves * 2;
    return Math.max(50, baseScore + timeBonus - movePenalty);
  }, [difficulty, timer, moves]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
          Memory Match - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h2>
        <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
          Match pairs of art-related items! Flip two cards at a time to find matches.
        </p>
        <button
          onClick={initializeGame}
          style={{
            background: "#FF6A88",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

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
          const isFlipped = flipped.includes(card.uniqueId);
          const isMatched = matched.includes(card.uniqueId);
          
          return (
            <div
              key={card.uniqueId}
              onClick={() => handleFlip(card.uniqueId)}
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
                {card.emoji}
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