import React from "react";

const About = () => {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/about-icon.png" alt="About" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        About ArtVista
      </h1>
      
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "40px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC",
        marginBottom: "30px"
      }}>
        <p style={{ 
          color: "#555", 
          fontSize: "1.2rem", 
          lineHeight: "1.8",
          marginBottom: "30px"
        }}>
          ArtVista is a revolutionary platform that brings together art lovers, creators, and collectors 
          in one vibrant community. Our mission is to make art accessible to everyone through innovative 
          technology and a passion for creativity.
        </p>
        
        <p style={{ 
          color: "#555", 
          fontSize: "1.2rem", 
          lineHeight: "1.8",
          marginBottom: "30px"
        }}>
          Founded by artists for artists, ArtVista combines cutting-edge AI technology with human 
          curation to deliver personalized art experiences. Whether you're looking to discover new 
          artists, purchase original artworks, or showcase your own creations, ArtVista is your 
          gateway to the world of art.
        </p>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "40px"
        }}>
          <FeatureBox 
            icon={<img src="/icons/ai-icon.png" alt="AI" style={{ width: "40px", height: "40px" }} />}
            title="AI Recommendations"
            description="Personalized art suggestions based on your preferences"
          />
          <FeatureBox 
            icon={<img src="/icons/game-icon.png" alt="Game" style={{ width: "40px", height: "40px" }} />}
            title="Interactive Games"
            description="Fun puzzles and creative challenges to engage with art"
          />
          <FeatureBox 
            icon={<img src="/icons/shop-icon.png" alt="Shop" style={{ width: "40px", height: "40px" }} />}
            title="Art Marketplace"
            description="Buy and sell original artworks from talented creators"
          />
        </div>
      </div>

      <div
        role="region"
        aria-label="Artist Video or Slideshow"
        style={{
          background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
          width: "100%",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px",
          fontSize: "1.5rem",
          color: "white",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
        }}
      >
        <img src="/icons/video-icon.png" alt="Video" style={{ width: "50px", height: "50px", marginRight: "15px" }} />
        Artist Showcase Video
      </div>
    </div>
  );
};

const FeatureBox = ({ icon, title, description }) => (
  <div style={{
    background: "#FFF5F7",
    borderRadius: "15px",
    padding: "25px",
    width: "250px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    border: "1px solid #FFE5EC"
  }}>
    <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center" }}>{icon}</div>
    <h3 style={{ 
      color: "#FF6A88", 
      marginBottom: "15px",
      fontSize: "1.4rem"
    }}>
      {title}
    </h3>
    <p style={{ 
      color: "#666", 
      lineHeight: "1.6"
    }}>
      {description}
    </p>
  </div>
);

export default About;