import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const SceneCreatorGame = ({ difficulty = "beginner", onComplete }) => {
  const { user } = useAuth();
  const [gameId, setGameId] = useState(null);
  const [elements, setElements] = useState([]);
  const [background, setBackground] = useState(null);
  const [points, setPoints] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStats, setGameStats] = useState(null);

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
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddElement = async (element) => {
    if (!gameId) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/scene-creator/add_element/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ element }),
      });
      const data = await response.json();
      setElements(data.elements || []);
      setPoints(data.points || 0);
      setMessage(data.message);
      checkScene();
    } catch (err) {
      console.error(err);
    }
  };

  const checkScene = async () => {
    if (!gameId) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/scene-creator/check_scene/${gameId}`);
      const data = await response.json();
      if (data.status === "completed") {
        setGameCompleted(true);
        setGameStats(data);
        if (onComplete) onComplete(data.points, data.badges);
      } else {
        fetchSuggestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!gameId && loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading Game...</div>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ color: "#FF6A88", marginBottom: "15px", fontSize: "2rem" }}>
        AI Scene Creator - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
      </h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Build an artificial intelligence validated scene piece by piece! Follow AI suggestions for best results.
      </p>

      {/* Stats Board */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: "10px 20px", borderRadius: "30px", boxShadow: "0 4px 8px rgba(0,0,0,0.05)", border: "1px solid #FFE5EC" }}>
          <strong>Points:</strong> {points}
        </div>
        <div style={{ background: "white", padding: "10px 20px", borderRadius: "30px", boxShadow: "0 4px 8px rgba(0,0,0,0.05)", border: "1px solid #FFE5EC" }}>
          <strong>Elements:</strong> {elements.length}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
        
        {/* Canvas Area */}
        <div style={{
          width: "100%", maxWidth: "700px", height: "350px", 
          background: background ? bgColors[background] : "#f0f0f0",
          borderRadius: "15px", position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: background ? "4px solid #FF6A88" : "2px dashed #ccc",
          display: "flex", flexWrap: "wrap", padding: "20px", gap: "10px",
          alignContent: "flex-end", justifyContent: "center", transition: "all 0.5s ease"
        }}>
          {!background ? (
            <div style={{ alignSelf: "center", color: "#888", width: "100%", textAlign: "center", fontSize: "1.2rem" }}>
              Please select a background to begin
            </div>
          ) : (
            elements.map((el, i) => (
              <div key={i} style={{ 
                fontSize: "3rem", 
                filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
                transform: `rotate(${Math.random() * 10 - 5}deg) scale(${Math.random() * 0.2 + 0.9})`,
                transition: "all 0.3s"
              }}>
                {elementStyles[el]?.icon || "❓"}
              </div>
            ))
          )}
        </div>

        {/* AI Suggestions Board */}
        {aiSuggestions && !gameCompleted && (
          <div style={{ 
            background: "#FFF3E0", border: "2px solid #FF9800", padding: "15px 25px", 
            borderRadius: "15px", width: "100%", maxWidth: "700px" 
          }}>
            <h3 style={{ color: "#E65100", margin: "0 0 10px", fontSize: "1.2rem" }}>🤖 AI Suggests:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {aiSuggestions.suggestion_type === "background" && aiSuggestions.suggestions.map(bg => (
                <button key={bg} onClick={() => handleSelectBackground(bg)} style={{
                  background: "#FF9800", color: "white", border: "none", padding: "8px 15px",
                  borderRadius: "20px", cursor: "pointer", fontWeight: "bold"
                }}>
                  Set {bg}
                </button>
              ))}
              {aiSuggestions.suggestion_type === "element" && aiSuggestions.suggestions.map(el => (
                <button key={el} onClick={() => handleAddElement(el)} style={{
                  background: "#4CAF50", color: "white", border: "none", padding: "8px 15px",
                  borderRadius: "20px", cursor: "pointer", fontWeight: "bold",
                  display: "flex", alignItems: "center", gap: "5px"
                }}>
                  {elementStyles[el]?.icon} Add {el}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status Message */}
        {message && !gameCompleted && (
          <div style={{ color: "#666", fontStyle: "italic" }}>{message}</div>
        )}

        {/* Win Screen */}
        {gameCompleted && (
          <div style={{
            background: "white", padding: "30px", borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)", textAlign: "center",
            border: "2px solid #4CAF50", width: "100%", maxWidth: "500px", marginTop: "10px"
          }}>
            <h3 style={{ color: "#4CAF50", fontSize: "1.8rem", marginBottom: "15px" }}>🎉 Scene Complete! 🎉</h3>
            <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Total Points: <strong>{gameStats?.points}</strong></p>
            {gameStats?.badges?.length > 0 && (
              <p style={{ color: "#FF9800", fontWeight: "bold", marginBottom: "20px" }}>
                🎖️ Badges Earned: {gameStats.badges.join(", ")}
              </p>
            )}
            <button
              onClick={() => {
                setGameCompleted(false);
                setElements([]);
                setBackground(null);
                setPoints(0);
                startGame();
              }}
              style={{
                background: "#FF6A88", color: "white", border: "none",
                padding: "12px 30px", borderRadius: "30px", fontSize: "1.1rem",
                fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}
            >
              Play Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SceneCreatorGame;
