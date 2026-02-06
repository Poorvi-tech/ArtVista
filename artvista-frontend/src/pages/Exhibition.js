import React, { useState, useEffect, useRef, useCallback } from "react";
import Lightbox from "../components/Lightbox";

const Exhibition = () => {
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeTab, setActiveTab] = useState("curated");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(1247);
  const intervalRef = useRef(null);
  
  // Update current time every minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Simulate visitor count increase
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 10000);
    
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(visitorInterval);
    };
  }, []);

  useEffect(() => {
    fetchExhibition();
  }, [activeTab, sortBy, filterBy, searchQuery]);

  const generateMockExhibition = useCallback(() => {
    return mockExhibitions[activeTab] || mockExhibitions.curated;
  }, [activeTab, mockExhibitions]);

  const fetchExhibition = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if backend API is available
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/exhibition/status`);
      const isBackendAvailable = response.ok;
      
      if (isBackendAvailable) {
        let url;
        if (activeTab === "curated") {
          url = `${process.env.REACT_APP_BACKEND_URL}/api/exhibition/curated?sort=${sortBy}&filter=${filterBy}&search=${searchQuery}`;
        } else {
          url = `${process.env.REACT_APP_BACKEND_URL}/api/exhibition/themed/${activeTab}?sort=${sortBy}&filter=${filterBy}&search=${searchQuery}`;
        }
        
        const apiResponse = await fetch(url);
        if (!apiResponse.ok) throw new Error("Failed to fetch exhibition");
        
        const data = await apiResponse.json();
        setExhibition(data);
      } else {
        // Fallback to mock data
        const mockData = generateMockExhibition();
        setExhibition(mockData);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to mock data on error
      const mockData = generateMockExhibition();
      setExhibition(mockData);
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortBy, filterBy, searchQuery, generateMockExhibition]);

  const mockArtworks = [
    {
      _id: "1",
      title: "Sunset Over Mountains",
      artist: "Jane Smith",
      imageUrl: "/images/sunset-mountains.jpg",
      category: "landscape",
      createdAt: "2023-05-15",
      description: "A beautiful sunset painting over mountain peaks"
    },
    {
      _id: "2",
      title: "Urban Life",
      artist: "John Doe",
      imageUrl: "/images/urban-life.webp",
      category: "urban",
      createdAt: "2023-06-20",
      description: "Cityscape capturing the essence of urban life"
    },
    {
      _id: "3",
      title: "Abstract Harmony",
      artist: "Alex Johnson",
      imageUrl: "/images/abstract-harmony.jpeg",
      category: "abstract",
      createdAt: "2023-07-10",
      description: "An abstract composition of colors and shapes"
    },
    {
      _id: "4",
      title: "Ocean Waves",
      artist: "Maria Garcia",
      imageUrl: "/images/ocean-waves.jpg",
      category: "landscape",
      createdAt: "2023-08-05",
      description: "Serene ocean waves crashing on the shore"
    },
    {
      _id: "5",
      title: "Modern Architecture",
      artist: "David Chen",
      imageUrl: "/images/modern-architecture.webp",
      category: "urban",
      createdAt: "2023-09-12",
      description: "Clean lines of contemporary urban design"
    },
    {
      _id: "6",
      title: "Colorful Dreams",
      artist: "Sophie Williams",
      imageUrl: "/images/colorful-dreams.jpeg",
      category: "abstract",
      createdAt: "2023-10-18",
      description: "Vibrant abstract art representing dreams"
    }
  ];

  const mockExhibitions = {
    curated: {
      title: "AI Curated Collection",
      theme: "Machine Learning Selections",
      description: "A curated collection of artworks selected by our AI algorithms based on popularity and visual appeal.",
      artworks: mockArtworks
    },
    landscapes: {
      title: "Natural Landscapes",
      theme: "Nature's Beauty",
      description: "A collection of stunning landscape artworks showcasing the beauty of nature.",
      artworks: mockArtworks.filter(art => art.category === "landscape")
    },
    urban: {
      title: "Urban Exploration",
      theme: "City Life",
      description: "Discover the vibrant energy of city life through contemporary urban art.",
      artworks: mockArtworks.filter(art => art.category === "urban")
    },
    abstract: {
      title: "Abstract Expressions",
      theme: "Creative Freedom",
      description: "An exploration of form, color, and emotion through abstract art.",
      artworks: mockArtworks.filter(art => art.category === "abstract")
    }
  };

  const toggleFavorite = (artworkId) => {
    setFavorites(prev => 
      prev.includes(artworkId) 
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const filteredArtworks = exhibition?.artworks?.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || 
                         (filterBy === "favorites" && favorites.includes(art._id)) ||
                         art.category.toLowerCase() === filterBy;
    return matchesSearch && matchesFilter;
  }) || [];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "alphabetical", label: "Alphabetical" }
  ];

  const filterOptions = [
    { value: "all", label: "All Categories" },
    { value: "paintings", label: "Paintings" },
    { value: "photography", label: "Photography" },
    { value: "digital", label: "Digital Art" },
    { value: "favorites", label: "My Favorites" }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner" style={{
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #FF6A88",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }}></div>
        <p style={{ fontSize: "1.2rem" }}>Curating your exhibition...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "1.2rem", color: "#FF6A88" }}>⚠️ Server unavailable. Showing demo content...</p>
        <button 
          onClick={fetchExhibition}
          style={{
            padding: "10px 20px",
            background: "#FF6A88",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Retry Connection
        </button>
        <button 
          onClick={() => {
            setExhibition(mockExhibitions[activeTab] || mockExhibitions.curated);
            setError(null);
          }}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Load Demo Content
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Real-time Visitor Count and Time */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>👥 <strong>{visitorCount.toLocaleString()}</strong> visitors online</span>
          <span>🕐 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div>
          <span>📅 {currentTime.toLocaleDateString()}</span>
        </div>
      </div>
      
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/exhibition-icon.png" alt="Exhibition" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Virtual Art Exhibition
      </h1>
      
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "30px", 
        color: "#666" 
      }}>
        {exhibition?.description || "Explore curated collections of amazing artworks"}
      </p>
      
      {/* Search and Filter Controls */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: "20px",
        marginBottom: "30px",
        padding: "20px",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          width: "100%"
        }}>
          <div style={{ position: "relative", flex: "1", minWidth: "250px", maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px 12px 40px",
                border: "2px solid #FFD1D9",
                borderRadius: "30px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <span style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#FF6A88"
            }}>🔍</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 15px",
              border: "2px solid #FFD1D9",
              borderRadius: "30px",
              backgroundColor: "white",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
              minWidth: "160px",
              maxWidth: "160px",
              appearance: "none"
            }}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
              padding: "12px 15px",
              border: "2px solid #FFD1D9",
              borderRadius: "30px",
              backgroundColor: "white",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
              minWidth: "160px",
              maxWidth: "160px",
              appearance: "none"
            }}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            style={{
              padding: "12px 20px",
              border: "2px solid #FFD1D9",
              borderRadius: "30px",
              backgroundColor: "white",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            {viewMode === "grid" ? "📋 List View" : "🖼️ Grid View"}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "12px 20px",
              border: "2px solid #FFD1D9",
              borderRadius: "30px",
              backgroundColor: "white",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            {showFilters ? "❌ Hide Filters" : "⚙️ More Filters"}
          </button>
        </div>
      </div>
      
      {/* Exhibition Tabs */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "30px" 
      }}>
        <button
          onClick={() => setActiveTab("curated")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "curated" ? "#FF6A88" : "white",
            color: activeTab === "curated" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "curated" ? "none" : "2px solid #FF6A88"
          }}
        >
          AI Curated
        </button>
        
        <button
          onClick={() => setActiveTab("landscapes")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "landscapes" ? "#FF6A88" : "white",
            color: activeTab === "landscapes" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "landscapes" ? "none" : "2px solid #FF6A88"
          }}
        >
          Landscapes
        </button>
        
        <button
          onClick={() => setActiveTab("urban")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "urban" ? "#FF6A88" : "white",
            color: activeTab === "urban" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "urban" ? "none" : "2px solid #FF6A88"
          }}
        >
          Urban
        </button>
        
        <button
          onClick={() => setActiveTab("abstract")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "abstract" ? "#FF6A88" : "white",
            color: activeTab === "abstract" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "abstract" ? "none" : "2px solid #FF6A88"
          }}
        >
          Abstract
        </button>
      </div>
      
      {/* Exhibition Title */}
      <div style={{
        background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
        borderRadius: "15px",
        padding: "25px",
        marginBottom: "30px",
        textAlign: "center",
        border: "1px solid #FFE5EC"
      }}>
        <h2 style={{ 
          fontSize: "2rem", 
          margin: "0 0 15px 0", 
          color: "#FF6A88" 
        }}>
          {exhibition?.title || "Art Exhibition"}
        </h2>
        <p style={{ 
          fontSize: "1.1rem", 
          margin: "0", 
          color: "#666" 
        }}>
          Theme: <strong>{exhibition?.theme || "Mixed"}</strong> • {filteredArtworks.length} artworks
        </p>
      </div>
      
      {/* Artworks Grid/List */}
      {filteredArtworks.length > 0 ? (
        viewMode === "grid" ? (
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
                key={art._id}
                onClick={() => setLightboxImage(art.imageUrl)}
                onKeyDown={(e) => { if (e.key === "Enter") setLightboxImage(art.imageUrl); }}
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
                  border: "1px solid #FFE5EC",
                  position: "relative"
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
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: "1"
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(art._id);
                    }}
                    style={{
                      background: favorites.includes(art._id) ? "#FF6A88" : "rgba(255, 255, 255, 0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {favorites.includes(art._id) ? "❤️" : "🤍"}
                  </button>
                </div>
                <div style={{
                  height: "200px",
                  overflow: "hidden"
                }}>
                  <img
                    src={art.imageUrl}
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
                  <p style={{
                    margin: "0 0 10px 0",
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    by {art.artist}
                  </p>
                  <span style={{
                    background: "#FF6A88",
                    color: "white",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontSize: "0.9rem"
                  }}>
                    {art.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: "40px" }}>
            {filteredArtworks.map((art) => (
              <div
                key={art._id}
                onClick={() => setLightboxImage(art.imageUrl)}
                onKeyDown={(e) => { if (e.key === "Enter") setLightboxImage(art.imageUrl); }}
                role="button"
                tabIndex={0}
                aria-label={`View ${art.title} in full screen`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  borderRadius: "15px",
                  padding: "15px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  border: "1px solid #FFE5EC",
                  position: "relative"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: "1"
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(art._id);
                    }}
                    style={{
                      background: favorites.includes(art._id) ? "#FF6A88" : "rgba(255, 255, 255, 0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {favorites.includes(art._id) ? "❤️" : "🤍"}
                  </button>
                </div>
                <div style={{
                  width: "120px",
                  height: "100px",
                  overflow: "hidden",
                  borderRadius: "8px",
                  marginRight: "15px"
                }}>
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 5px 0", 
                    color: "#333",
                    fontSize: "1.2rem"
                  }}>
                    {art.title}
                  </h3>
                  <p style={{
                    margin: "0 0 5px 0",
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    by {art.artist}
                  </p>
                  <span style={{
                    background: "#FF6A88",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem"
                  }}>
                    {art.category}
                  </span>
                </div>
                <div style={{
                  textAlign: "right",
                  color: "#666",
                  fontSize: "0.8rem"
                }}>
                  {new Date(art.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No artworks found. Try adjusting your search or filters.</p>
        </div>
      )}
      
      {lightboxImage && (
        <Lightbox 
          src={lightboxImage} 
          onClose={() => setLightboxImage(null)} 
        />
      )}
    </div>
  );
};

export default Exhibition;