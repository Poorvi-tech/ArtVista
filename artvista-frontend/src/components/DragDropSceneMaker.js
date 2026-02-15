import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DragDropSceneMaker = ({ onComplete, difficulty = "easy" }) => {
  const { user } = useAuth();
  const [gameId, setGameId] = useState(null);
  const [background, setBackground] = useState(null);
  const [elements, setElements] = useState([]);
  const [availableElements] = useState([
    "Tree", "River", "House", "Sun", "Mountain", "Cloud", "Flower", "Bird"
  ]);
  const [gameStatus, setGameStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Start creating your scene by choosing a background and adding elements!");

  const startGame = React.useCallback(async () => {
    if (!user) {
      alert('Please log in to play the game.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user.name || user.displayName || 'Anonymous',
          user_id: user.id || user._id || user.uid
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGameId(data.game_id || data.id);
        setMessage("Game started! Choose a background first.");
      } else {
        console.error('Error starting game:', data.error);
        setMessage('Failed to start game. Please try again.');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage('An error occurred while starting the game.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const chooseBackground = async (bg) => {
    if (!gameId) {
      alert('Please start the game first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/choose_background/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ background: bg })
      });

      const data = await response.json();
      if (response.ok) {
        setBackground(bg);
        setMessage(data.message || `Background set to ${bg}`);
      } else {
        console.error('Error choosing background:', data.error);
        setMessage('Failed to set background. Please try again.');
      }
    } catch (error) {
      console.error('Error choosing background:', error);
      setMessage('An error occurred while setting the background.');
    } finally {
      setLoading(false);
    }
  };

  const addElement = async (element) => {
    if (!gameId) {
      alert('Please start the game first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/add_element/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ element })
      });

      const data = await response.json();
      if (response.ok) {
        setElements(prev => [...prev, element]);
        setMessage(data.message || `Added ${element}`);
      } else {
        console.error('Error adding element:', data.error);
        setMessage('Failed to add element. Please try again.');
      }
    } catch (error) {
      console.error('Error adding element:', error);
      setMessage('An error occurred while adding the element.');
    } finally {
      setLoading(false);
    }
  };

  const checkScene = async () => {
    if (!gameId) {
      alert('Please start the game first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/check_scene/${gameId}`);

      const data = await response.json();
      if (response.ok) {
        setGameStatus(data);
        setMessage(data.message);
        
        if (data.status === 'completed' && onComplete) {
          onComplete(data.points || 0, data);
        }
      } else {
        console.error('Error checking scene:', data.error);
        setMessage('Failed to check scene. Please try again.');
      }
    } catch (error) {
      console.error('Error checking scene:', error);
      setMessage('An error occurred while checking the scene.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  const backgrounds = [
    "Forest", "Beach", "Mountain", "City", "Sky", "Garden"
  ];

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
      borderRadius: "15px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#FF6A88", textAlign: "center" }}>🎨 Drag & Drop Scene Maker</h2>
      
      <div style={{ marginBottom: "20px", padding: "15px", background: "white", borderRadius: "10px", textAlign: "center" }}>
        <p style={{ margin: "0", color: "#333", fontWeight: "bold" }}>{message}</p>
        {loading && <p style={{ margin: "10px 0", color: "#FF6A88" }}>Processing...</p>}
      </div>

      {gameId && (
        <>
          {/* Background Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#FF6A88" }}>Choose Background:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {backgrounds.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => chooseBackground(bg)}
                  style={{
                    padding: "10px 15px",
                    background: background === bg ? "#FF6A88" : "white",
                    color: background === bg ? "white" : "#FF6A88",
                    border: "2px solid #FF6A88",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Background Display */}
          {background && (
            <div style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              background: "#f0f8ff", 
              borderRadius: "10px", 
              border: "2px dashed #FF6A88",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0", color: "#FF6A88" }}>Current Background: {background}</h4>
            </div>
          )}

          {/* Available Elements */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#FF6A88" }}>Add Elements to Your Scene:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {availableElements.map((element, index) => (
                <button
                  key={index}
                  onClick={() => addElement(element)}
                  style={{
                    padding: "10px 15px",
                    background: "white",
                    color: "#FF6A88",
                    border: "2px solid #FF6A88",
                    borderRadius: "25px",
                    cursor: "pointer"
                  }}
                >
                  + {element}
                </button>
              ))}
            </div>
          </div>

          {/* Added Elements Display */}
          {elements.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#FF6A88" }}>Your Scene Elements:</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {elements.map((element, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "8px 15px",
                      background: "#e6f7ff",
                      color: "#1890ff",
                      border: "1px solid #91d5ff",
                      borderRadius: "20px",
                      fontSize: "0.9em"
                    }}
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Check Scene Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={checkScene}
              style={{
                padding: "12px 30px",
                background: "#FF6A88",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              Check Scene Completion
            </button>
          </div>

          {/* Game Status Display */}
          {gameStatus && (
            <div style={{ 
              marginTop: "20px", 
              padding: "15px", 
              background: gameStatus.status === 'completed' ? "#f6ffed" : "#fff7e6", 
              border: `2px solid ${gameStatus.status === 'completed' ? "#52c41a" : "#faad14"}`,
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: gameStatus.status === 'completed' ? "#52c41a" : "#faad14" }}>
                {gameStatus.status === 'completed' ? '🎉 Scene Completed!' : '📝 Scene Status'}
              </h3>
              <p style={{ margin: "5px 0", color: "#333" }}>{gameStatus.message}</p>
              {gameStatus.points && (
                <p style={{ margin: "5px 0", color: "#333", fontWeight: "bold" }}>Points: {gameStatus.points}</p>
              )}
              {gameStatus.badges && gameStatus.badges.length > 0 && (
                <p style={{ margin: "5px 0", color: "#333" }}>Badges: {gameStatus.badges.join(', ')}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DragDropSceneMaker;