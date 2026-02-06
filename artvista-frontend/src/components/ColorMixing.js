import React, { useState, useEffect } from "react";

const ColorMixing = ({ difficulty = "easy", onComplete }) => {
  const [targetColor, setTargetColor] = useState("");
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(255);
  const [blue, setBlue] = useState(255);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Target colors for different difficulties
  const targetColors = {
    easy: [
      "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
    ],
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

  // Initialize game
  const initializeGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setCurrentColor("#FFFFFF");
    setRed(255);
    setGreen(255);
    setBlue(255);
    generateTargetColor();
  };

  // Generate new target color
  const generateTargetColor = () => {
    const colors = targetColors[difficulty];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomColor);
    setFeedback("");
    setShowFeedback(false);
  };

  // Handle color slider changes
  const handleColorChange = (color, value) => {
    const numValue = parseInt(value);
    if (color === "red") setRed(numValue);
    if (color === "green") setGreen(numValue);
    if (color === "blue") setBlue(numValue);
    
    const newColor = `rgb(${red}${color === "red" ? numValue : red}, ${green}${color === "green" ? numValue : green}, ${blue}${color === "blue" ? numValue : blue})`;
    setCurrentColor(newColor);
  };

  // Check if current color matches target
  const checkMatch = () => {
    const currentRGB = rgbToHex(red, green, blue);
    const distance = colorDistance(currentRGB, targetColor);
    
    let roundScore = 0;
    let feedbackMsg = "";
    
    if (distance < 10) {
      roundScore = 100;
      feedbackMsg = "🎯 Perfect Match!";
    } else if (distance < 30) {
      roundScore = 75;
      feedbackMsg = "👍 Very Close!";
    } else if (distance < 60) {
      roundScore = 50;
      feedbackMsg = "👌 Good Attempt!";
    } else {
      roundScore = 25;
      feedbackMsg = "🤔 Keep Trying!";
    }
    
    setScore(prev => prev + roundScore);
    setFeedback(feedbackMsg);
    setShowFeedback(true);
    
    // Move to next round after delay
    setTimeout(() => {
      if (round < 5) {
        setRound(prev => prev + 1);
        generateTargetColor();
      } else {
        // Game completed
        const finalScore = score + roundScore;
        if (onComplete) {
          onComplete(finalScore, round);
        }
      }
    }, 2000);
  };

  // Helper functions
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const colorDistance = (color1, color2) => {
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);
    
    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);
    
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
  };

  if (!gameStarted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
          Color Mixing Challenge - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h2>
        <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
          Mix RGB colors to match the target color! Adjust the sliders to create the perfect blend.
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
          Start Mixing Colors
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
        Color Mixing - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
      </h2>
      
      {/* Game stats */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Round:</strong> {round}/5
        </div>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Score:</strong> {score}
        </div>
      </div>

      {/* Target and Current Colors */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "40px", 
        marginBottom: "40px",
        flexWrap: "wrap"
      }}>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#666", marginBottom: "10px" }}>Target Color</h3>
          <div 
            style={{
              width: "120px",
              height: "120px",
              background: targetColor,
              borderRadius: "10px",
              border: "3px solid #333",
              margin: "0 auto"
            }}
          />
          <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
            {targetColor.toUpperCase()}
          </p>
        </div>
        
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#666", marginBottom: "10px" }}>Your Mix</h3>
          <div 
            style={{
              width: "120px",
              height: "120px",
              background: currentColor,
              borderRadius: "10px",
              border: "3px solid #333",
              margin: "0 auto"
            }}
          />
          <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
            RGB({red}, {green}, {blue})
          </p>
        </div>
      </div>

      {/* Color Sliders */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto 30px",
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC"
      }}>
        <h3 style={{ color: "#FF6A88", marginBottom: "20px" }}>Adjust Colors</h3>
        
        <div style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "8px" 
          }}>
            <span style={{ fontWeight: "bold", color: "#FF0000" }}>Red</span>
            <span>{red}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={red}
            onChange={(e) => handleColorChange("red", e.target.value)}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              background: "#FFE5EC",
              outline: "none",
              appearance: "none"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "8px" 
          }}>
            <span style={{ fontWeight: "bold", color: "#00FF00" }}>Green</span>
            <span>{green}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={green}
            onChange={(e) => handleColorChange("green", e.target.value)}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              background: "#E0F7FA",
              outline: "none",
              appearance: "none"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "8px" 
          }}>
            <span style={{ fontWeight: "bold", color: "#0000FF" }}>Blue</span>
            <span>{blue}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={blue}
            onChange={(e) => handleColorChange("blue", e.target.value)}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              background: "#E3F2FD",
              outline: "none",
              appearance: "none"
            }}
          />
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={checkMatch}
        disabled={showFeedback}
        style={{
          background: showFeedback ? "#ccc" : "#FF6A88",
          color: "white",
          border: "none",
          padding: "15px 40px",
          borderRadius: "30px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          cursor: showFeedback ? "not-allowed" : "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          opacity: showFeedback ? 0.7 : 1
        }}
      >
        {showFeedback ? "Checking..." : "Check My Mix"}
      </button>

      {/* Feedback */}
      {showFeedback && (
        <div style={{
          marginTop: "20px",
          padding: "15px 30px",
          background: feedback.includes("Perfect") ? "#E8F5E8" : 
                     feedback.includes("Very Close") ? "#FFF8E1" : 
                     feedback.includes("Good") ? "#E3F2FD" : "#FFEBEE",
          borderRadius: "30px",
          border: `2px solid ${
            feedback.includes("Perfect") ? "#4CAF50" : 
            feedback.includes("Very Close") ? "#FFA726" : 
            feedback.includes("Good") ? "#2196F3" : "#F44336"
          }`,
          fontWeight: "bold",
          color: feedback.includes("Perfect") ? "#2E7D32" : 
                 feedback.includes("Very Close") ? "#EF6C00" : 
                 feedback.includes("Good") ? "#1565C0" : "#C62828"
        }}>
          {feedback}
        </div>
      )}

      {/* Completion Screen */}
      {round > 5 && (
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
          <h3 style={{ color: "#FF6A88", marginBottom: "20px" }}>🎨 Color Master! 🎨</h3>
          <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
            You completed the {difficulty} level!
          </p>
          <p style={{ marginBottom: "20px" }}>
            <strong>Final Score:</strong> {score} points
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

export default ColorMixing;