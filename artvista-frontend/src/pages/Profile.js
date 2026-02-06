import React, { useState, useEffect, useCallback, useContext } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user, fetchProfileData]);

  const fetchProfileData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");
      
      const data = await response.json();
      setProfileData(data.user);
      setPreferences(data.user.preferences || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addPreference = async () => {
    if (!newPreference.trim()) return;
    
    const updatedPreferences = [...preferences, newPreference];
    setPreferences(updatedPreferences);
    setNewPreference("");
    
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${user.id}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ preferences: updatedPreferences })
      });
    } catch (err) {
      console.error("Error updating preferences:", err);
    }
  };

  const removePreference = async (prefToRemove) => {
    const updatedPreferences = preferences.filter(pref => pref !== prefToRemove);
    setPreferences(updatedPreferences);
    
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${user.id}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ preferences: updatedPreferences })
      });
    } catch (err) {
      console.error("Error updating preferences:", err);
    }
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
        <p style={{ fontSize: "1.2rem" }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/profile-icon.png" alt="Profile" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Your Profile
      </h1>
      
      {/* Profile Header */}
      <div style={{
        background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
        borderRadius: "15px",
        padding: "25px",
        marginBottom: "30px",
        textAlign: "center",
        border: "1px solid #FFE5EC"
      }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "#FF6A88",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px",
          fontSize: "2.5rem",
          color: "white"
        }}>
          {profileData?.name?.charAt(0) || "U"}
        </div>
        <h2 style={{ 
          fontSize: "2rem", 
          margin: "0 0 10px 0", 
          color: "#FF6A88" 
        }}>
          {profileData?.name || "User"}
        </h2>
        <p style={{ 
          fontSize: "1.1rem", 
          margin: "0", 
          color: "#666" 
        }}>
          Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "Unknown"}
        </p>
      </div>
      
      {/* Profile Tabs */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "30px" 
      }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "overview" ? "#FF6A88" : "white",
            color: activeTab === "overview" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "overview" ? "none" : "2px solid #FF6A88"
          }}
        >
          Overview
        </button>
        
        <button
          onClick={() => setActiveTab("insights")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "insights" ? "#FF6A88" : "white",
            color: activeTab === "insights" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "insights" ? "none" : "2px solid #FF6A88"
          }}
        >
          AI Insights
        </button>
        
        <button
          onClick={() => setActiveTab("preferences")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            background: activeTab === "preferences" ? "#FF6A88" : "white",
            color: activeTab === "preferences" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "preferences" ? "none" : "2px solid #FF6A88"
          }}
        >
          Preferences
        </button>
      </div>
      
      {/* Profile Content */}
      {activeTab === "overview" && (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            {/* Stats Card */}
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              border: "1px solid #FFE5EC"
            }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                margin: "0 0 20px 0", 
                color: "#FF6A88",
                textAlign: "center"
              }}>
                Your Stats
              </h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr",
                gap: "15px"
              }}>
                <div style={{
                  background: "#FFF5F7",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{ 
                    fontSize: "2rem", 
                    fontWeight: "bold",
                    color: "#FF6A88" 
                  }}>
                    {profileData?.createdArtworks?.length || 0}
                  </div>
                  <div style={{ 
                    fontSize: "0.9rem", 
                    color: "#666" 
                  }}>
                    Artworks Created
                  </div>
                </div>
                
                <div style={{
                  background: "#FFF5F7",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{ 
                    fontSize: "2rem", 
                    fontWeight: "bold",
                    color: "#FF6A88" 
                  }}>
                    {profileData?.favoriteArtworks?.length || 0}
                  </div>
                  <div style={{ 
                    fontSize: "0.9rem", 
                    color: "#666" 
                  }}>
                    Favorites
                  </div>
                </div>
                
                <div style={{
                  background: "#FFF5F7",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{ 
                    fontSize: "2rem", 
                    fontWeight: "bold",
                    color: "#FF6A88" 
                  }}>
                    {preferences.length}
                  </div>
                  <div style={{ 
                    fontSize: "0.9rem", 
                    color: "#666" 
                  }}>
                    Preferences
                  </div>
                </div>
                
                <div style={{
                  background: "#FFF5F7",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{ 
                    fontSize: "2rem", 
                    fontWeight: "bold",
                    color: "#FF6A88" 
                  }}>
                    {profileData?.aiInsights?.skillLevel || "Beginner"}
                  </div>
                  <div style={{ 
                    fontSize: "0.9rem", 
                    color: "#666" 
                  }}>
                    Skill Level
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              border: "1px solid #FFE5EC"
            }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                margin: "0 0 20px 0", 
                color: "#FF6A88",
                textAlign: "center"
              }}>
                Recent Activity
              </h3>
              
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "15px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  background: "#FFF5F7",
                  borderRadius: "10px"
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
                    marginRight: "15px",
                    fontSize: "1.2rem"
                  }}>
                    🎨
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Created a new artwork</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>2 days ago</div>
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  background: "#FFF5F7",
                  borderRadius: "10px"
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
                    marginRight: "15px",
                    fontSize: "1.2rem"
                  }}>
                    ❤️
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Favorited an artwork</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>1 week ago</div>
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  background: "#FFF5F7",
                  borderRadius: "10px"
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
                    marginRight: "15px",
                    fontSize: "1.2rem"
                  }}>
                    🏆
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Achieved Beginner level</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>2 weeks ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "insights" && (
        <div>
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
            border: "1px solid #FFE5EC"
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              margin: "0 0 20px 0", 
              color: "#FF6A88",
              textAlign: "center"
            }}>
              <img src="/icons/ai-icon.png" alt="AI" style={{ width: "25px", height: "25px", marginRight: "10px" }} />
              AI-Powered Insights
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {/* Skill Level */}
              <div style={{
                background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
                borderRadius: "15px",
                padding: "20px",
                border: "1px solid #FFE5EC"
              }}>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#FF6A88" 
                }}>
                  Skill Level Assessment
                </h3>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#FF6A88",
                  textAlign: "center",
                  margin: "15px 0"
                }}>
                  {profileData?.aiInsights?.skillLevel || "Beginner"}
                </div>
                <p style={{ 
                  margin: 0, 
                  color: "#666",
                  textAlign: "center"
                }}>
                  Based on your artwork creation activity
                </p>
              </div>
              
              {/* Favorite Styles */}
              <div style={{
                background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
                borderRadius: "15px",
                padding: "20px",
                border: "1px solid #FFE5EC"
              }}>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#FF6A88" 
                }}>
                  Your Favorite Styles
                </h3>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  {profileData?.aiInsights?.favoriteStyles?.map((style, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#FF6A88",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "20px",
                        fontSize: "0.9rem"
                      }}
                    >
                      {style}
                    </span>
                  )) || <p>No styles identified yet</p>}
                </div>
              </div>
              
              {/* Recommended Artists */}
              <div style={{
                background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
                borderRadius: "15px",
                padding: "20px",
                border: "1px solid #FFE5EC"
              }}>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#FF6A88" 
                }}>
                  Artists You Might Like
                </h3>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  {profileData?.aiInsights?.recommendedArtists?.map((artist, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#4A90E2",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "20px",
                        fontSize: "0.9rem"
                      }}
                    >
                      {artist}
                    </span>
                  )) || <p>No recommendations yet</p>}
                </div>
              </div>
            </div>
            
            {/* AI Recommendations */}
            <div style={{
              marginTop: "30px",
              padding: "20px",
              background: "#FFF5F7",
              borderRadius: "15px",
              border: "1px solid #FFE5EC"
            }}>
              <h3 style={{ 
                margin: "0 0 15px 0", 
                color: "#FF6A88" 
              }}>
                Personalized Recommendations
              </h3>
              <p style={{ 
                margin: 0, 
                color: "#666" 
              }}>
                Based on your preferences and activity, we recommend exploring more abstract artworks and trying 
                mixed media techniques to enhance your creative skills.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "preferences" && (
        <div>
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
            border: "1px solid #FFE5EC"
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              margin: "0 0 20px 0", 
              color: "#FF6A88",
              textAlign: "center"
            }}>
              Your Art Preferences
            </h2>
            
            <div style={{ 
              display: "flex", 
              marginBottom: "20px"
            }}>
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="Add a preference (e.g., landscapes, abstract, watercolor)"
                style={{
                  flex: 1,
                  padding: "12px 15px",
                  border: "2px solid #FF6A88",
                  borderRadius: "8px 0 0 8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
              <button
                onClick={addPreference}
                style={{
                  padding: "12px 20px",
                  background: "#FF6A88",
                  color: "white",
                  border: "none",
                  borderRadius: "0 8px 8px 0",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Add
              </button>
            </div>
            
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap",
              gap: "10px"
            }}>
              {preferences.map((pref, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#FFF5F7",
                    borderRadius: "20px",
                    padding: "8px 15px",
                    border: "1px solid #FFE5EC"
                  }}
                >
                  <span style={{ marginRight: "10px" }}>{pref}</span>
                  <button
                    onClick={() => removePreference(pref)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#FF6A88",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      padding: "0",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {preferences.length === 0 && (
                <p style={{ 
                  color: "#999", 
                  fontStyle: "italic" 
                }}>
                  No preferences added yet. Add your favorite art styles, mediums, or themes.
                </p>
              )}
            </div>
          </div>
          
          {/* Preference Suggestions */}
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
            border: "1px solid #FFE5EC"
          }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#FF6A88" 
            }}>
              Suggested Preferences
            </h3>
            
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap",
              gap: "10px"
            }}>
              {["Landscapes", "Portraits", "Abstract", "Watercolor", "Oil Painting", "Digital Art", "Sculpture", "Photography"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!preferences.includes(suggestion)) {
                      setNewPreference(suggestion);
                    }
                  }}
                  style={{
                    padding: "8px 15px",
                    background: preferences.includes(suggestion) ? "#FF6A88" : "white",
                    color: preferences.includes(suggestion) ? "white" : "#FF6A88",
                    border: "1px solid #FF6A88",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;