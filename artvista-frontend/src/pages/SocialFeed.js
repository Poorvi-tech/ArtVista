import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const SocialFeed = () => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    fetchSocialFeed();
  }, []);

  const fetchSocialFeed = async () => {
    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data
      const mockFeed = [
        {
          id: 1,
          user: { name: "Aditi Sharma", avatar: null },
          artwork: { title: "Sunset Valley", imageUrl: "/images/artwork1.jpg" },
          action: "liked",
          timestamp: "2 hours ago"
        },
        {
          id: 2,
          user: { name: "Rohan Patel", avatar: null },
          artwork: { title: "City Rush", imageUrl: "/images/artwork2.jpg" },
          action: "commented",
          comment: "Amazing use of colors in this piece!",
          timestamp: "4 hours ago"
        },
        {
          id: 3,
          user: { name: "Priya Kumar", avatar: null },
          artwork: { title: "Dream Shapes", imageUrl: "/images/artwork3.jpg" },
          action: "shared",
          platform: "Instagram",
          timestamp: "6 hours ago"
        },
        {
          id: 4,
          user: { name: "Amit Verma", avatar: null },
          artwork: { title: "Forest Pathway", imageUrl: "/images/artwork8.jpg" },
          action: "liked",
          timestamp: "1 day ago"
        },
        {
          id: 5,
          user: { name: "Sneha Reddy", avatar: null },
          artwork: { title: "Geometric Harmony", imageUrl: "/images/artwork9.jpg" },
          action: "commented",
          comment: "The composition is so balanced. Great work!",
          timestamp: "1 day ago"
        }
      ];
      
      setFeedItems(mockFeed);
    } catch (err) {
      console.error("Error fetching social feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    // In a real implementation, this would submit to the backend
    const newFeedItem = {
      id: feedItems.length + 1,
      user: { name: user?.name || "You", avatar: null },
      content: newPost,
      timestamp: "Just now"
    };
    
    setFeedItems([newFeedItem, ...feedItems]);
    setNewPost("");
  };

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
        <p style={{ fontSize: "1.2rem" }}>Loading social feed...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/community-icon.png" alt="Community" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        ArtVista Community
      </h1>
      
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "30px", 
        color: "#666" 
      }}>
        Connect with fellow artists and art enthusiasts
      </p>
      
      {/* Create Post */}
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "20px",
        marginBottom: "30px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC"
      }}>
        <h2 style={{ 
          fontSize: "1.5rem", 
          margin: "0 0 15px 0", 
          color: "#FF6A88" 
        }}>
          Share with the Community
        </h2>
        
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Share your thoughts, artworks, or inspirations..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "15px",
              border: "2px solid #FF6A88",
              borderRadius: "10px",
              fontSize: "1rem",
              fontFamily: "inherit",
              resize: "vertical",
              marginBottom: "15px",
              outline: "none"
            }}
          />
          
          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end" 
          }}>
            <button
              type="submit"
              style={{
                padding: "10px 25px",
                background: "#FF6A88",
                color: "white",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
            >
              Post
            </button>
          </div>
        </form>
      </div>
      
      {/* Feed Items */}
      <div>
        <h2 style={{ 
          fontSize: "1.8rem", 
          margin: "0 0 20px 0", 
          color: "#FF6A88",
          textAlign: "center"
        }}>
          Recent Activity
        </h2>
        
        {feedItems.map(item => (
          <div
            key={item.id}
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              border: "1px solid #FFE5EC"
            }}
          >
            {/* User Info */}
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#FF6A88",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                marginRight: "15px"
              }}>
                {item.user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>{item.user.name}</div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>{item.timestamp}</div>
              </div>
            </div>
            
            {/* Activity */}
            <div style={{ 
              marginBottom: "15px",
              fontSize: "1.1rem"
            }}>
              {item.action === "liked" && (
                <span>
                  <span style={{ color: "#FF6A88" }}>liked</span> the artwork
                </span>
              )}
              {item.action === "commented" && (
                <span>
                  <span style={{ color: "#FF6A88" }}>commented</span> on the artwork
                </span>
              )}
              {item.action === "shared" && (
                <span>
                  <span style={{ color: "#FF6A88" }}>shared</span> the artwork on {item.platform}
                </span>
              )}
              {item.content && (
                <p style={{ 
                  margin: "10px 0 0 0", 
                  fontStyle: "italic",
                  color: "#333"
                }}>
                  "{item.content}"
                </p>
              )}
              {item.comment && (
                <p style={{ 
                  margin: "10px 0 0 0", 
                  fontStyle: "italic",
                  color: "#333"
                }}>
                  "{item.comment}"
                </p>
              )}
            </div>
            
            {/* Artwork Preview */}
            {item.artwork && (
              <div style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                background: "#FFF5F7",
                borderRadius: "10px"
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginRight: "15px"
                }}>
                  <img
                    src={item.artwork.imageUrl}
                    alt={item.artwork.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.artwork.title}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>Artwork</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;