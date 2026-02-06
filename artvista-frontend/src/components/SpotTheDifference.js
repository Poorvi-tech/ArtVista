import React, { useState, useEffect, useRef, useCallback } from "react";

const SpotTheDifference = ({ difficulty = "easy", onComplete }) => {
  const [differences, setDifferences] = useState([]);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameActive, setGameActive] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const canvasRef = useRef(null);

  // Image pairs for different difficulties
  const imagePairs = {
    easy: [
      {
        id: 1,
        name: "Simple Landscape",
        differences: [
          { x: 150, y: 80, radius: 20, description: "Missing bird in sky" },
          { x: 320, y: 200, radius: 15, description: "Extra flower" },
          { x: 450, y: 120, radius: 25, description: "Different tree shape" }
        ]
      },
      {
        id: 2,
        name: "Basic Portrait",
        differences: [
          { x: 200, y: 150, radius: 18, description: "Different earring" },
          { x: 300, y: 180, radius: 12, description: "Missing mole" },
          { x: 250, y: 220, radius: 22, description: "Different necklace" }
        ]
      }
    ],
    medium: [
      {
        id: 3,
        name: "Complex Building",
        differences: [
          { x: 180, y: 100, radius: 15, description: "Window size difference" },
          { x: 350, y: 160, radius: 12, description: "Missing flag" },
          { x: 280, y: 220, radius: 18, description: "Different door color" },
          { x: 420, y: 140, radius: 14, description: "Extra decoration" },
          { x: 120, y: 180, radius: 16, description: "Sign placement" }
        ]
      },
      {
        id: 4,
        name: "Detailed Still Life",
        differences: [
          { x: 160, y: 120, radius: 13, description: "Fruit position" },
          { x: 280, y: 180, radius: 11, description: "Glass reflection" },
          { x: 380, y: 140, radius: 17, description: "Bowl pattern" },
          { x: 220, y: 240, radius: 14, description: "Tablecloth fold" },
          { x: 320, y: 90, radius: 12, description: "Light shadow" }
        ]
      }
    ],
    hard: [
      {
        id: 5,
        name: "Intricate Architecture",
        differences: [
          { x: 140, y: 80, radius: 10, description: "Column detail" },
          { x: 260, y: 130, radius: 8, description: "Window frame" },
          { x: 380, y: 170, radius: 12, description: "Roof ornament" },
          { x: 200, y: 220, radius: 9, description: "Door handle" },
          { x: 320, y: 90, radius: 11, description: "Balcony railing" },
          { x: 440, y: 150, radius: 7, description: "Gargoyle position" },
          { x: 180, y: 190, radius: 13, description: "Staircase step" }
        ]
      },
      {
        id: 6,
        name: "Elaborate Interior",
        differences: [
          { x: 130, y: 110, radius: 9, description: "Picture frame" },
          { x: 250, y: 160, radius: 7, description: "Chair cushion" },
          { x: 370, y: 130, radius: 11, description: "Lamp shade" },
          { x: 190, y: 210, radius: 8, description: "Carpet pattern" },
          { x: 310, y: 80, radius: 10, description: "Curtain pleat" },
          { x: 430, y: 180, radius: 6, description: "Book spine" },
          { x: 160, y: 150, radius: 12, description: "Mirror reflection" }
        ]
      }
    ]
  };

  // Initialize game
  const initializeGame = () => {
    const pairs = imagePairs[difficulty];
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    
    setDifferences(randomPair.differences);
    setFoundDifferences([]);
    setMistakes(0);
    setHintUsed(false);
    setTimeLeft(difficulty === "easy" ? 120 : difficulty === "medium" ? 180 : 240);
    setGameStarted(true);
    setGameActive(true);
    
    // Draw initial images
    setTimeout(drawImages, 100);
  };

  // Draw the comparison images
  const drawImages = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw dividing line
    ctx.strokeStyle = '#FF6A88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#FF6A88';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Image A', width * 0.25, 30);
    ctx.fillText('Image B', width * 0.75, 30);
    
    // Draw differences for Image A (left side)
    differences.forEach((diff, index) => {
      if (!foundDifferences.includes(index)) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(diff.x, diff.y, diff.radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    
    // Draw found differences
    foundDifferences.forEach(foundIndex => {
      const diff = differences[foundIndex];
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.radius + 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw checkmark
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(diff.x - 5, diff.y);
      ctx.lineTo(diff.x - 1, diff.y + 4);
      ctx.lineTo(diff.x + 7, diff.y - 6);
      ctx.stroke();
    });
  }, [canvasRef, differences, foundDifferences]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameActive && timeLeft > 0 && foundDifferences.length < differences.length) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 || foundDifferences.length === differences.length) {
      setGameActive(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft, foundDifferences.length, differences.length]);

  // Redraw when differences change
  useEffect(() => {
    if (gameStarted) {
      drawImages();
    }
  }, [foundDifferences, gameStarted, differences, drawImages]);

  // Handle canvas click
  const handleCanvasClick = (e) => {
    if (!gameActive || foundDifferences.length === differences.length) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is near any difference
    let found = false;
    differences.forEach((diff, index) => {
      if (foundDifferences.includes(index)) return;
      
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      if (distance <= diff.radius) {
        setFoundDifferences(prev => [...prev, index]);
        found = true;
      }
    });
    
    // If no difference found, increment mistakes
    if (!found) {
      setMistakes(prev => prev + 1);
    }
  };

  // Use hint
  const useHint = () => {
    if (hintUsed || foundDifferences.length === differences.length) return;
    
    const unfoundIndices = differences
      .map((_, index) => index)
      .filter(index => !foundDifferences.includes(index));
    
    if (unfoundIndices.length > 0) {
      const randomIndex = unfoundIndices[Math.floor(Math.random() * unfoundIndices.length)];
      setFoundDifferences(prev => [...prev, randomIndex]);
      setHintUsed(true);
    }
  };

  // Calculate score
  const calculateScore = useCallback(() => {
    const baseScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
    const foundBonus = foundDifferences.length * 20;
    const timeBonus = Math.max(0, timeLeft * 2);
    const mistakePenalty = mistakes * 5;
    const hintPenalty = hintUsed ? 20 : 0;
    
    return Math.max(0, baseScore + foundBonus + timeBonus - mistakePenalty - hintPenalty);
  }, [difficulty, foundDifferences.length, timeLeft, mistakes, hintUsed]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Game completion effect
  useEffect(() => {
    if (!gameActive && gameStarted && (timeLeft <= 0 || foundDifferences.length === differences.length)) {
      const score = calculateScore();
      if (onComplete) {
        setTimeout(() => {
          onComplete(score, foundDifferences.length, mistakes, hintUsed);
        }, 1000);
      }
    }
  }, [gameActive, gameStarted, timeLeft, foundDifferences.length, differences.length, mistakes, hintUsed, onComplete, calculateScore]);

  if (!gameStarted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
          Spot the Differences - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h2>
        <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
          Find all the differences between the two images! Click on the differences you spot.
        </p>
        <div style={{ marginBottom: "25px", fontSize: "1rem", color: "#666" }}>
          <p><strong>Rules:</strong></p>
          <p>• Find all hidden differences between the images</p>
          <p>• {difficulty === "easy" ? "3 differences" : difficulty === "medium" ? "5 differences" : "7 differences"} to find</p>
          <p>• Penalty for incorrect clicks</p>
          <p>• One hint available per game</p>
        </div>
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
          Start Finding Differences
        </button>
      </div>
    );
  }

  const gameOver = timeLeft <= 0 || foundDifferences.length === differences.length;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
        Spot the Differences - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
          <strong>Found:</strong> {foundDifferences.length}/{differences.length}
        </div>
        <div style={{ 
          background: timeLeft < 30 ? "#FFEBEE" : "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: `1px solid ${timeLeft < 30 ? "#F44336" : "#FFE5EC"}`
        }}>
          <strong>Time:</strong> {formatTime(timeLeft)}
        </div>
        <div style={{ 
          background: mistakes > 2 ? "#FFF3E0" : "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: `1px solid ${mistakes > 2 ? "#FF9800" : "#FFE5EC"}`
        }}>
          <strong>Mistakes:</strong> {mistakes}
        </div>
      </div>

      {/* Game canvas */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "20px" 
      }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          style={{
            border: "3px solid #FF6A88",
            borderRadius: "10px",
            cursor: gameActive ? "crosshair" : "default",
            maxWidth: "100%",
            height: "auto"
          }}
        />
      </div>

      {/* Hint button */}
      {!hintUsed && gameActive && foundDifferences.length < differences.length && (
        <button
          onClick={useHint}
          style={{
            background: "#FFA726",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "30px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}
        >
          💡 Use Hint
        </button>
      )}

      {/* Game over screen */}
      {gameOver && (
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
          border: "2px solid #FF6A88",
          maxWidth: "500px",
          width: "90%"
        }}>
          <h3 style={{ color: "#FF6A88", marginBottom: "20px" }}>
            {timeLeft <= 0 ? "⏰ Time's Up!" : "🎉 Great Job!"}
          </h3>
          <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
            {timeLeft <= 0 
              ? `You found ${foundDifferences.length} out of ${differences.length} differences`
              : `You found all ${differences.length} differences!`
            }
          </p>
          <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
            <strong>Score:</strong> {calculateScore()} points
          </p>
          <div style={{ marginBottom: "25px", fontSize: "1rem" }}>
            <p>Correct: {foundDifferences.length}</p>
            <p>Mistakes: {mistakes}</p>
            <p>Hint used: {hintUsed ? "Yes" : "No"}</p>
            <p>Time remaining: {formatTime(timeLeft)}</p>
          </div>
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

      {/* Instructions overlay */}
      {gameActive && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "15px 25px",
          borderRadius: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "2px solid #FF6A88",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#FF6A88"
        }}>
          🔍 Click on the differences you spot between the two images!
        </div>
      )}
    </div>
  );
};

export default SpotTheDifference;