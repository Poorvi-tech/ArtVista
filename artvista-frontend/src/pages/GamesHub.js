import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MemoryMatch from "../components/MemoryMatch";
import ColorMixing from "../components/ColorMixing";
import ArtQuiz from "../components/ArtQuiz";
import SpotTheDifference from "../components/SpotTheDifference";
import DragDropSceneMaker from "../components/DragDropSceneMaker";

const GamesHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  const games = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Match pairs of art-related items in this classic memory game",
      icon: "🧠",
      component: MemoryMatch,
      difficulties: ["easy", "medium", "hard"]
    },
    {
      id: "color-mixing",
      title: "Color Mixing",
      description: "Mix RGB colors to match target colors and become a color master",
      icon: "🎨",
      component: ColorMixing,
      difficulties: ["easy", "medium", "hard"]
    },
    {
      id: "art-quiz",
      title: "Art History Quiz",
      description: "Test your knowledge of famous artists, movements, and masterpieces",
      icon: "📚",
      component: ArtQuiz,
      difficulties: ["easy", "medium", "hard"]
    },
    {
      id: "spot-difference",
      title: "Spot the Difference",
      description: "Find all the hidden differences between two similar images",
      icon: "🔍",
      component: SpotTheDifference,
      difficulties: ["easy", "medium", "hard"]
    },
    {
      id: "drag-drop-scene",
      title: "Drag & Drop Scene Maker",
      description: "Create beautiful scenes by dragging elements onto the canvas with AI-powered suggestions",
      icon: "🖼️",
      component: DragDropSceneMaker,
      difficulties: ["easy", "medium", "hard"]
    }
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const handleGameComplete = async (score, ...args) => {
    // Save score to localStorage
    const scores = JSON.parse(localStorage.getItem("artvista_scores")) || [];
    scores.push({
      game: selectedGame,
      difficulty,
      score,
      date: new Date().toISOString(),
      details: args
    });
    localStorage.setItem("artvista_scores", JSON.stringify(scores));
    
    // Send score to backend
    try {
      if (user) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user.uid || user._id || 'anonymous',
            score,
            level: difficulty
          })
        });
        
        if (!response.ok) {
          console.error('Failed to submit score to backend:', await response.text());
        } else {
          console.log('Score submitted to backend successfully');
        }
      }
    } catch (error) {
      console.error('Error submitting score to backend:', error);
    }
    
    console.log(`Game completed! Score: ${score}`);
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game.component;
    
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
        padding: "20px"
      }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <button
            onClick={handleBackToMenu}
            style={{
              background: "white",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "10px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
            }}
          >
            ← Back to Games
          </button>
          
          <h1 style={{ 
            color: "#FF6A88", 
            margin: 0,
            fontSize: "2rem",
            textAlign: "center",
            flex: 1
          }}>
            {game.icon} {game.title}
          </h1>
          
          <div style={{ 
            background: "white",
            padding: "10px 20px",
            borderRadius: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            border: "1px solid #FFE5EC"
          }}>
            <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
        </div>

        {/* Difficulty selector */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px", 
          marginBottom: "30px",
          flexWrap: "wrap"
        }}>
          {game.difficulties.map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              style={{
                background: difficulty === level ? "#FF6A88" : "white",
                color: difficulty === level ? "white" : "#FF6A88",
                border: "2px solid #FF6A88",
                padding: "8px 20px",
                borderRadius: "25px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Game Component */}
        <GameComponent 
          difficulty={difficulty} 
          onComplete={handleGameComplete}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ 
          color: "#FF6A88", 
          fontSize: "3rem", 
          marginBottom: "15px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          🎮 ArtVista Games Hub
        </h1>
        <p style={{ 
          fontSize: "1.3rem", 
          color: "#666",
          maxWidth: "700px",
          margin: "0 auto"
        }}>
          Challenge your artistic skills with fun and educational games!
        </p>
      </div>

      {/* Games Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
        maxWidth: "1200px",
        margin: "0 auto 40px"
      }}>
        {games.map(game => (
          <div
            key={game.id}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "2px solid #FFE5EC",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              textAlign: "center"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
            onClick={() => handleGameSelect(game.id)}
          >
            <div style={{ 
              fontSize: "4rem", 
              marginBottom: "20px" 
            }}>
              {game.icon}
            </div>
            
            <h2 style={{ 
              color: "#FF6A88", 
              marginBottom: "15px",
              fontSize: "1.8rem"
            }}>
              {game.title}
            </h2>
            
            <p style={{ 
              color: "#666", 
              lineHeight: "1.6",
              marginBottom: "25px",
              fontSize: "1.1rem"
            }}>
              {game.description}
            </p>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "10px",
              flexWrap: "wrap"
            }}>
              {game.difficulties.map(level => (
                <span
                  key={level}
                  style={{
                    background: "#FFF5F7",
                    color: "#FF6A88",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "30px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transition: "transform 0.3s, box-shadow 0.3s"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-5px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
          }}
        >
          🏆 View Leaderboard
        </button>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "50px", 
        paddingTop: "20px",
        borderTop: "1px solid #FFE5EC",
        color: "#999"
      }}>
        <p>Select a game above to get started. Each game offers multiple difficulty levels!</p>
      </div>
    </div>
  );
};

export default GamesHub;