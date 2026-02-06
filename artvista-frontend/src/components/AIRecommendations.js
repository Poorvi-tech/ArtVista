import React from 'react';

const AIRecommendations = () => {
  return (
    <div style={{
      background: "white",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
      border: "1px solid #FFE5EC"
    }}>
      <h2 style={{ 
        fontSize: "2.2rem", 
        color: "#FF6A88",
        marginBottom: "20px"
      }}>
        <img src="/icons/ai-icon.png" alt="AI" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
        AI Recommendations
      </h2>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Get personalized art suggestions based on your preferences and browsing history.
      </p>
      <button style={{
        marginTop: "15px",
        background: "#FF6A88",
        color: "white",
        border: "none",
        padding: "10px 25px",
        borderRadius: "30px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s"
      }}
      onMouseEnter={e => {
        e.target.style.background = "#ff5a7a";
        e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={e => {
        e.target.style.background = "#FF6A88";
        e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      }}
      >
        Get Recommendations
      </button>
    </div>
  );
};

export default AIRecommendations;