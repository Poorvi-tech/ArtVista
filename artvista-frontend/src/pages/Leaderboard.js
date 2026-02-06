import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    let intervalId;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch from backend API
        const response = await fetch('http://localhost:5000/api/game/leaderboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        let data = await response.json();
        
        // Sort by score descending
        const sortedScores = data.sort((a, b) => b.score - a.score);
        
        // Add badges
        const withBadges = sortedScores.map((player, index) => {
          let badge = "⭐ Player";
          if (index === 0) badge = "🏆 Gold";
          else if (index === 1) badge = "🥈 Silver";
          else if (index === 2) badge = "🥉 Bronze";
          return { ...player, badge };
        });
        
        setLeaderboardData(withBadges);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up interval for real-time updates
    intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px 15px",
        background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)",
        borderRadius: "10px",
        color: "white"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          margin: "0",
          color: "white"
        }}>
          🏆 Leaderboard
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "0.9rem" }}>Last updated: {new Date().toLocaleTimeString()}</span>
          <button 
            onClick={handleRefresh}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid white",
              borderRadius: "20px",
              padding: "5px 10px",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "30px", 
        color: "#666" 
      }}>
        Top players across all games and levels
      </p>

      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          flexDirection: "column"
        }}>
          <div style={{
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #FF6A88",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            marginBottom: "20px"
          }}></div>
          <p>Loading leaderboard data...</p>
        </div>
      ) : error ? (
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC",
          marginBottom: "20px"
        }}>
          <p style={{ color: "#FF6A88", marginBottom: "15px" }}>⚠️ Error loading leaderboard: {error}</p>
          <button 
            onClick={handleRefresh}
            style={{
              background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "30px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {leaderboardData.length === 0 ? (
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              border: "1px solid #FFE5EC"
            }}>
              <h2 style={{ 
                fontSize: "1.8rem", 
                color: "#FF6A88",
                marginBottom: "20px"
              }}>
                No scores yet
              </h2>
              <p style={{ 
                fontSize: "1.2rem", 
                marginBottom: "30px"
              }}>
                Be the first to play our games and appear on the leaderboard! 🎮
              </p>
              <button 
                onClick={() => window.location.href = "/games"}
                style={{
                  background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 30px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }}>
                Play Games
              </button>
            </div>
          ) : (
            <div style={{ 
              background: "white",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              border: "1px solid #FFE5EC"
            }}>
              <table
                role="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "400px"
                }}
              >
                <thead role="rowgroup">
                  <tr role="row" style={{ 
                    background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)", 
                    color: "white", 
                    textAlign: "left" 
                  }}>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Rank</th>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Player</th>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Score</th>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Level</th>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Badge</th>
                    <th role="columnheader" style={{ padding: "15px", fontSize: "1.1rem" }}>Time</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {leaderboardData.map((player, index) => (
                    <tr
                      key={player._id || index}
                      role="row"
                      style={{
                        borderBottom: "1px solid #FFE5EC",
                        background: index % 2 === 0 ? "#fff" : "#FFF5F7",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#FFE5EC";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#FFF5F7";
                      }}
                    >
                      <td style={{ 
                        padding: "15px", 
                        fontWeight: "bold",
                        fontSize: "1.1rem"
                      }}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td style={{ 
                        padding: "15px",
                        fontSize: "1.1rem"
                      }}>
                        {player.player || "Guest"}
                      </td>
                      <td style={{ 
                        padding: "15px",
                        fontWeight: "bold",
                        color: "#FF6A88",
                        fontSize: "1.1rem"
                      }}>
                        {player.score}
                      </td>
                      <td style={{ 
                        padding: "15px",
                        fontSize: "1.1rem"
                      }}>
                        {player.level || "N/A"}
                      </td>
                      <td style={{ 
                        padding: "15px",
                        fontSize: "1.1rem"
                      }}>
                        <span style={{
                          background: index === 0 ? "#FFD700" : 
                                   index === 1 ? "#C0C0C0" : 
                                   index === 2 ? "#CD7F32" : "#FF6A88",
                          color: index < 3 ? "#333" : "white",
                          padding: "5px 15px",
                          borderRadius: "20px",
                          fontWeight: "bold"
                        }}>
                          {player.badge}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "15px",
                        fontSize: "0.9rem",
                        color: "#666"
                      }}>
                        {player.timestamp ? new Date(player.timestamp).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;