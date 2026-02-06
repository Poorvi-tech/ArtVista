import React, { useState } from "react";
import Lightbox from "../components/Lightbox";
import CommunitySection from "../components/CommunitySection";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

const categories = ["All", "Landscapes", "Urban", "Abstract", "Portraits", "Nature"];

const artworks = [
  { id: 1, category: "Landscapes", title: "Beautiful Mountain", src: "/images/artwork1.jpg" },
  { id: 2, category: "Urban", title: "City Skyline", src: "/images/artwork2.jpg" },
  { id: 3, category: "Abstract", title: "Color Splash", src: "/images/artwork3.jpg" },
  { id: 4, category: "Landscapes", title: "Sunny Beach", src: "/images/artwork4.jpg" },
  { id: 5, category: "Urban", title: "Street Life", src: "/images/artwork5.jpeg" },
  { id: 6, category: "Abstract", title: "Shapes & Lines", src: "/images/artwork6.jpg" },
  { id: 7, category: "Portraits", title: "Mysterious Eyes", src: "/images/artwork7.jpg" },
  { id: 8, category: "Nature", title: "Forest Pathway", src: "/images/artwork8.jpg" },
  { id: 9, category: "Abstract", title: "Geometric Harmony", src: "/images/artwork9.jpg" },
  { id: 10, category: "Landscapes", title: "Desert Dunes", src: "/images/artwork10.jpg" },
  { id: 11, category: "Urban", title: "Night Lights", src: "/images/artwork11.jpg" },
  { id: 12, category: "Portraits", title: "Smiling Portrait", src: "/images/artwork12.jpg" },
  { id: 13, category: "Nature", title: "Blooming Flowers", src: "/images/artwork13.jpg" },
  { id: 14, category: "Abstract", title: "Fluid Motion", src: "/images/artwork14.webp" },
  { id: 15, category: "Landscapes", title: "Mountain Lake", src: "/images/artwork15.jpg" },
  { id: 16, category: "Urban", title: "Architectural Beauty", src: "/images/artwork16.jpg" },
  { id: 17, category: "Portraits", title: "Contemplative Face", src: "/images/artwork17.jpg" },
  { id: 18, category: "Nature", title: "Wildlife Encounter", src: "/images/artwork18.jpg" },
  { id: 19, category: "Abstract", title: "Digital Dreams", src: "/images/artwork19.avif" },
  { id: 20, category: "Landscapes", title: "Coastal Cliffs", src: "/images/artwork20.jpg" },
  { id: 21, category: "Urban", title: "Market Scene", src: "/images/artwork21.jpg" },
  { id: 22, category: "Portraits", title: "Ancient Wisdom", src: "/images/artwork22.webp" },
  { id: 23, category: "Nature", title: "Autumn Leaves", src: "/images/artwork23.jpg" },
  { id: 24, category: "Abstract", title: "Neon Reflections", src: "/images/artwork24.webp" }
];

// Mock social data
const socialData = {
  1: { likes: 24, comments: 5 },
  2: { likes: 18, comments: 3 },
  3: { likes: 32, comments: 7 },
  4: { likes: 15, comments: 2 },
  5: { likes: 28, comments: 6 },
  6: { likes: 21, comments: 4 },
  7: { likes: 35, comments: 8 },
  8: { likes: 19, comments: 3 },
  9: { likes: 26, comments: 5 },
  10: { likes: 22, comments: 4 },
  11: { likes: 30, comments: 6 },
  12: { likes: 17, comments: 2 },
  13: { likes: 25, comments: 5 },
  14: { likes: 29, comments: 7 },
  15: { likes: 20, comments: 3 },
  16: { likes: 33, comments: 8 },
  17: { likes: 27, comments: 6 },
  18: { likes: 16, comments: 2 },
  19: { likes: 31, comments: 7 },
  20: { likes: 23, comments: 4 },
  21: { likes: 18, comments: 3 },
  22: { likes: 34, comments: 9 },
  23: { likes: 14, comments: 2 },
  24: { likes: 28, comments: 6 }
};

const Gallery = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtworks = artworks.filter((art) => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Function to render social stats with login prompt for unauthenticated users
  const renderSocialStats = (art) => {
    if (user) {
      // Authenticated user - show full functionality
      return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "10px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#666",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            <span>❤️</span>
            <span>{socialData[art.id]?.likes || 0}</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#666",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            <span>💬</span>
            <span>{socialData[art.id]?.comments || 0}</span>
          </div>
        </div>
      );
    } else {
      // Unauthenticated user - show login prompt
      return (
        <div style={{ marginTop: "10px" }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "10px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              <span>❤️</span>
              <span>{socialData[art.id]?.likes || 0}</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              <span>💬</span>
              <span>{socialData[art.id]?.comments || 0}</span>
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "center" }}>
            Login to like and comment
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {!user && (
        <LoginPrompt
          title="Enhanced Gallery Experience"
          message="Log in to enjoy full gallery features including liking artworks, commenting, sharing, and personal collections."
          actionText="Login to Gallery"
        />
      )}
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/gallery-icon.png" alt="Gallery" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Art Gallery
      </h1>
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "30px", 
        color: "#666" 
      }}>
        Discover beautiful artworks from talented artists around the world
      </p>

      {/* Search Bar */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "20px" 
      }}>
        <input
          type="text"
          placeholder="Search artworks..."
          aria-label="Search artworks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "12px 20px",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "30px",
            border: "2px solid #FF6A88",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            outline: "none"
          }}
        />
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "30px" 
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 20px",
              borderRadius: "30px",
              background: selectedCategory === cat ? "#FF6A88" : "white",
              color: selectedCategory === cat ? "white" : "#FF6A88",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              transition: "all 0.3s",
              border: selectedCategory === cat ? "none" : "2px solid #FF6A88"
            }}
            aria-pressed={selectedCategory === cat}
            onMouseEnter={e => {
              if (selectedCategory !== cat) {
                e.target.style.background = "#FFF5F7";
              }
            }}
            onMouseLeave={e => {
              if (selectedCategory !== cat) {
                e.target.style.background = "white";
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Artworks Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
          marginBottom: "40px"
        }}
      >
        {filteredArtworks.map((art) => (
          <div
            key={art.id}
            onClick={() => setLightboxImage(art.src)}
            onKeyDown={(e) => { if (e.key === "Enter") setLightboxImage(art.src); }}
            role="button"
            tabIndex={0}
            aria-label={`View ${art.title} in full screen`}
            style={{
              background: "white",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              border: "1px solid #FFE5EC"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{
              height: "200px",
              overflow: "hidden"
            }}>
              <img
                src={art.src}
                alt={art.title}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  transition: "transform 0.5s"
                }}
                onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            </div>
            <div style={{
              padding: "15px",
              textAlign: "center"
            }}>
              <h3 style={{ 
                margin: "0 0 10px 0", 
                color: "#333",
                fontSize: "1.2rem"
              }}>
                {art.title}
              </h3>
              <span style={{
                background: "#FF6A88",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "0.9rem",
                display: "inline-block",
                marginBottom: "10px"
              }}>
                {art.category}
              </span>
              
              {renderSocialStats(art)}
            </div>
          </div>
        ))}
      </div>

      {/* Community Section */}
      <div style={{ marginTop: "40px" }}>
        <CommunitySection />
      </div>
      
      {lightboxImage && (
        <Lightbox 
          src={lightboxImage} 
          onClose={() => setLightboxImage(null)} 
        />
      )}
    </div>
  );
};

export default Gallery;