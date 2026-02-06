import React from 'react';

const trackInteraction = (userId, suggestionType, interactionType) => {
  // Updated to send data to the backend
  // For now, we'll just log it since there's no specific endpoint for these interactions
  console.log(`User ${userId} interacted with ${suggestionType}: ${interactionType}`);
  // In a real implementation, you would make an API call to track the interaction
  // For example:
  // fetch('http://localhost:5000/api/ai/interaction/suggestion', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     userId,
  //     suggestionType,
  //     interactionType
  //   })
  // })
  // .then(response => response.json())
  // .then(data => {
  //   console.log('Interaction tracked:', data);
  // })
  // .catch(error => {
  //   console.error('Error tracking interaction:', error);
  // });
};

const ArtCreationSuggestions = () => {
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
        <img src="/icons/creation-icon.png" alt="Create" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
        Art Creation Suggestions
      </h2>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Get AI-powered suggestions to inspire your next artistic creation.
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
        Get Creative Ideas
      </button>
    </div>
  );
};

export default ArtCreationSuggestions;