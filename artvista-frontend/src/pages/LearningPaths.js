import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LearningPaths = () => {
  const { currentUser } = useAuth();
  const [learningPaths, setLearningPaths] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPath, setSelectedPath] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    let intervalId;
    
    const fetchLearningData = async () => {
      try {
        setLoading(true);
        
        // Check if backend API is available
        const response = await fetch('http://localhost:5000/api/learning/status');
        const isBackendAvailable = response.ok;
        
        if (isBackendAvailable) {
          // Fetch from backend API
          const pathsResponse = await fetch('http://localhost:5000/api/learning/paths');
          if (!pathsResponse.ok) throw new Error('Failed to fetch learning paths');
          
          const progressResponse = currentUser 
            ? await fetch(`http://localhost:5000/api/learning/progress/${currentUser.uid}`)
            : null;
          
          const pathsData = await pathsResponse.json();
          const progressData = progressResponse && progressResponse.ok 
            ? await progressResponse.json()
            : [];
          
          setLearningPaths(pathsData);
          setUserProgress(progressData);
        } else {
          // Use mock data if backend is not available
          console.log("Backend not available, using mock data");
          
          // Mock data with realistic structure
          const mockPaths = [
            {
              id: 1,
              title: "Watercolor Fundamentals",
              description: "Master the basics of watercolor painting with this comprehensive course",
              category: "Painting",
              difficulty: "Beginner",
              duration: 10,
              modules: [
                {
                  id: 1,
                  title: "Introduction to Watercolors",
                  description: "Learn about materials, tools, and basic techniques",
                  estimatedTime: 120,
                  lessons: [
                    { id: 1, title: "Understanding Watercolor Paints", duration: 20, type: "article", completed: false },
                    { id: 2, title: "Essential Tools and Materials", duration: 25, type: "article", completed: false },
                    { id: 3, title: "Basic Brush Techniques", duration: 30, type: "video", completed: false },
                    { id: 4, title: "Color Theory for Watercolors", duration: 25, type: "article", completed: false },
                    { id: 5, title: "Watercolor Basics Quiz", duration: 20, type: "quiz", completed: false }
                  ]
                },
                {
                  id: 2,
                  title: "Basic Techniques",
                  description: "Practice essential watercolor techniques",
                  estimatedTime: 150,
                  lessons: [
                    { id: 6, title: "Wet-on-Wet Technique", duration: 35, type: "video", completed: false },
                    { id: 7, title: "Wet-on-Dry Technique", duration: 30, type: "video", completed: false },
                    { id: 8, title: "Gradients and Washes", duration: 40, type: "video", completed: false },
                    { id: 9, title: "Basic Techniques Exercise", duration: 45, type: "exercise", completed: false }
                  ]
                },
                {
                  id: 3,
                  title: "First Projects",
                  description: "Apply your skills to complete simple watercolor paintings",
                  estimatedTime: 180,
                  lessons: [
                    { id: 10, title: "Simple Sky Scene", duration: 50, type: "video", completed: false },
                    { id: 11, title: "Basic Landscape", duration: 60, type: "video", completed: false },
                    { id: 12, title: "First Projects Quiz", duration: 20, type: "quiz", completed: false },
                    { id: 13, title: "First Projects Exercise", duration: 50, type: "exercise", completed: false }
                  ]
                }
              ],
              enrolled: false
            },
            {
              id: 2,
              title: "Digital Art Mastery",
              description: "Become proficient in digital art creation using industry-standard tools",
              category: "Digital Art",
              difficulty: "Intermediate",
              duration: 15,
              modules: [
                {
                  id: 4,
                  title: "Digital Art Fundamentals",
                  description: "Learn the basics of digital art creation",
                  estimatedTime: 150,
                  lessons: [
                    { id: 14, title: "Introduction to Digital Art", duration: 25, type: "article", completed: false },
                    { id: 15, title: "Popular Digital Art Software", duration: 30, type: "article", completed: false },
                    { id: 16, title: "Setting Up Your Workspace", duration: 35, type: "video", completed: false },
                    { id: 17, title: "Basic Digital Tools", duration: 40, type: "video", completed: false },
                    { id: 18, title: "Digital Art Fundamentals Quiz", duration: 20, type: "quiz", completed: false }
                  ]
                },
                {
                  id: 5,
                  title: "Advanced Techniques",
                  description: "Learn advanced digital art techniques and workflows",
                  estimatedTime: 200,
                  lessons: [
                    { id: 19, title: "Advanced Brush Techniques", duration: 45, type: "video", completed: false },
                    { id: 20, title: "Color Management", duration: 35, type: "article", completed: false },
                    { id: 21, title: "Layer Management", duration: 40, type: "video", completed: false },
                    { id: 22, title: "Advanced Techniques Exercise", duration: 80, type: "exercise", completed: false }
                  ]
                },
                {
                  id: 6,
                  title: "Professional Workflows",
                  description: "Develop professional digital art workflows",
                  estimatedTime: 220,
                  lessons: [
                    { id: 23, title: "Concept Development", duration: 50, type: "article", completed: false },
                    { id: 24, title: "Sketching and Thumbnails", duration: 45, type: "video", completed: false },
                    { id: 25, title: "Final Art Creation", duration: 80, type: "video", completed: false },
                    { id: 26, title: "Professional Workflows Quiz", duration: 20, type: "quiz", completed: false },
                    { id: 27, title: "Final Project", duration: 125, type: "exercise", completed: false }
                  ]
                }
              ],
              enrolled: false
            },
            {
              id: 3,
              title: "Portrait Drawing Essentials",
              description: "Learn to draw realistic portraits with pencil and charcoal",
              category: "Drawing",
              difficulty: "Beginner",
              duration: 12,
              modules: [
                {
                  id: 7,
                  title: "Portrait Drawing Basics",
                  description: "Learn fundamental portrait drawing techniques",
                  estimatedTime: 140,
                  lessons: [
                    { id: 28, title: "Understanding Facial Proportions", duration: 30, type: "article", completed: false },
                    { id: 29, title: "Basic Shapes and Structure", duration: 35, type: "video", completed: false },
                    { id: 30, title: "Essential Drawing Tools", duration: 25, type: "article", completed: false },
                    { id: 31, title: "Portrait Drawing Basics Quiz", duration: 20, type: "quiz", completed: false },
                    { id: 32, title: "Basic Portrait Exercise", duration: 30, type: "exercise", completed: false }
                  ]
                },
                {
                  id: 8,
                  title: "Features and Details",
                  description: "Focus on individual facial features and details",
                  estimatedTime: 160,
                  lessons: [
                    { id: 33, title: "Drawing Eyes", duration: 40, type: "video", completed: false },
                    { id: 34, title: "Drawing the Nose", duration: 35, type: "video", completed: false },
                    { id: 35, title: "Drawing Lips and Mouth", duration: 35, type: "video", completed: false },
                    { id: 36, title: "Drawing Ears", duration: 30, type: "video", completed: false },
                    { id: 37, title: "Features and Details Exercise", duration: 20, type: "exercise", completed: false }
                  ]
                },
                {
                  id: 9,
                  title: "Complete Portraits",
                  description: "Bring all elements together to create complete portraits",
                  estimatedTime: 180,
                  lessons: [
                    { id: 38, title: "Shading and Lighting", duration: 45, type: "video", completed: false },
                    { id: 39, title: "Expression and Personality", duration: 40, type: "video", completed: false },
                    { id: 40, title: "Different Angles and Perspectives", duration: 35, type: "video", completed: false },
                    { id: 41, title: "Complete Portraits Quiz", duration: 20, type: "quiz", completed: false },
                    { id: 42, title: "Final Portrait Project", duration: 40, type: "exercise", completed: false }
                  ]
                }
              ],
              enrolled: false
            }
          ];
          
          setLearningPaths(mockPaths);
          
          // Mock progress data
          if (currentUser) {
            const mockProgress = [
              {
                learningPathId: 1,
                progress: 65,
                completedModules: [1],
                completedLessons: [1, 2, 3],
                badges: [
                  { name: "Watercolor Beginner", awardedAt: "2023-05-15" }
                ]
              },
              {
                learningPathId: 3,
                progress: 30,
                completedModules: [],
                completedLessons: [28, 29],
                badges: []
              }
            ];
            setUserProgress(mockProgress);
          }
        }
        
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error("Error fetching learning data:", err);
        setError(err.message);
        
        // Fallback to mock data
        const fallbackPaths = [
          {
            id: 1,
            title: "Watercolor Fundamentals",
            description: "Master the basics of watercolor painting with this comprehensive course",
            category: "Painting",
            difficulty: "Beginner",
            duration: 10,
            modules: [
              {
                id: 1,
                title: "Introduction to Watercolors",
                description: "Learn about materials, tools, and basic techniques",
                estimatedTime: 120,
                lessons: [
                  { id: 1, title: "Understanding Watercolor Paints", duration: 20, type: "article", completed: false },
                  { id: 2, title: "Essential Tools and Materials", duration: 25, type: "article", completed: false },
                  { id: 3, title: "Basic Brush Techniques", duration: 30, type: "video", completed: false },
                  { id: 4, title: "Color Theory for Watercolors", duration: 25, type: "article", completed: false },
                  { id: 5, title: "Watercolor Basics Quiz", duration: 20, type: "quiz", completed: false }
                ]
              }
            ],
            enrolled: false
          }
        ];
        
        setLearningPaths(fallbackPaths);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningData();
    
    // Set up interval for real-time updates
    intervalId = setInterval(fetchLearningData, 60000); // Refresh every minute
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser]);

  const enrollInPath = async (pathId) => {
    try {
      if (currentUser) {
        // In a real implementation, this would call the backend
        const response = await fetch('http://localhost:5000/api/learning/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            learningPathId: pathId
          })
        });
        
        if (response.ok) {
          // Update the enrolled status locally
          setLearningPaths(prev => 
            prev.map(path => 
              path.id === pathId ? { ...path, enrolled: true } : path
            )
          );
          
          // Add progress entry
          setUserProgress(prev => [
            ...prev,
            {
              learningPathId: pathId,
              progress: 0,
              completedModules: [],
              completedLessons: [],
              badges: []
            }
          ]);
          
          alert(`Successfully enrolled in learning path!`);
        } else {
          throw new Error('Failed to enroll in path');
        }
      } else {
        alert('Please log in to enroll in learning paths');
      }
    } catch (err) {
      console.error('Error enrolling in path:', err);
      alert('Error enrolling in learning path');
    }
  };

  const getProgressForPath = (pathId) => {
    const progress = userProgress.find(p => p.learningPathId === pathId);
    return progress ? progress.progress : 0;
  };

  const getBadgesForPath = (pathId) => {
    const progress = userProgress.find(p => p.learningPathId === pathId);
    return progress ? progress.badges : [];
  };

  const getCompletedLessonsForPath = (pathId) => {
    const progress = userProgress.find(p => p.learningPathId === pathId);
    return progress ? progress.completedLessons || [] : [];
  };

  const filteredPaths = activeTab === "all" 
    ? learningPaths 
    : learningPaths.filter(path => path.category === activeTab);

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
        <p style={{ fontSize: "1.2rem" }}>Loading learning paths...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "1.2rem", color: "#FF6A88" }}>⚠️ Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#FF6A88",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

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
          <img src="/icons/learning-icon.png" alt="Learning" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
          Learning Paths
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "0.9rem" }}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button 
            onClick={() => window.location.reload()}
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
        Enhance your artistic skills with our structured learning paths
      </p>
      
      {/* Category Tabs */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "30px" 
      }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "30px",
            background: activeTab === "all" ? "#FF6A88" : "white",
            color: activeTab === "all" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "all" ? "none" : "2px solid #FF6A88"
          }}
        >
          All Paths
        </button>
        
        <button
          onClick={() => setActiveTab("Painting")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "30px",
            background: activeTab === "Painting" ? "#FF6A88" : "white",
            color: activeTab === "Painting" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "Painting" ? "none" : "2px solid #FF6A88"
          }}
        >
          Painting
        </button>
        
        <button
          onClick={() => setActiveTab("Digital Art")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "30px",
            background: activeTab === "Digital Art" ? "#FF6A88" : "white",
            color: activeTab === "Digital Art" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "Digital Art" ? "none" : "2px solid #FF6A88"
          }}
        >
          Digital Art
        </button>
        
        <button
          onClick={() => setActiveTab("Drawing")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "30px",
            background: activeTab === "Drawing" ? "#FF6A88" : "white",
            color: activeTab === "Drawing" ? "white" : "#FF6A88",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
            border: activeTab === "Drawing" ? "none" : "2px solid #FF6A88"
          }}
        >
          Drawing
        </button>
      </div>
      
      {/* Learning Paths Grid */}
      {!selectedPath ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "25px"
          }}
        >
          {filteredPaths.map(path => {
            const progress = getProgressForPath(path.id);
            const badges = getBadgesForPath(path.id);
            const completedLessons = getCompletedLessonsForPath(path.id);
            
            // Calculate total lessons
            const totalLessons = path.modules.reduce((total, module) => total + module.lessons.length, 0);
            
            // Calculate actual progress percentage based on completed lessons
            const actualProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
            
            return (
              <div
                key={`path-${path.id || Math.random().toString(36).substring(2, 9)}`}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s, box-shadow 0.3s",
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
                  height: "180px",
                  background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  {path.title}
                </div>
                
                <div style={{ padding: "20px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    marginBottom: "15px"
                  }}>
                    <span style={{
                      background: "#FFF5F7",
                      color: "#FF6A88",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "bold"
                    }}>
                      {path.difficulty}
                    </span>
                    
                    <span style={{
                      background: "#E0F7FA",
                      color: "#0077BE",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "0.9rem"
                    }}>
                      {path.duration} hours
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    margin: "0 0 10px 0", 
                    color: "#333",
                    fontSize: "1.3rem"
                  }}>
                    {path.title}
                  </h3>
                  
                  <p style={{ 
                    margin: "0 0 15px 0", 
                    color: "#666",
                    fontSize: "0.95rem"
                  }}>
                    {path.description}
                  </p>
                  
                  {/* Progress Bar */}
                  {(actualProgress > 0 || progress > 0) && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        marginBottom: "5px"
                      }}>
                        <span style={{ fontSize: "0.9rem", color: "#666" }}>Progress</span>
                        <span style={{ fontSize: "0.9rem", color: "#FF6A88", fontWeight: "bold" }}>{Math.max(actualProgress, progress)}%</span>
                      </div>
                      <div style={{
                        height: "8px",
                        background: "#f0f0f0",
                        borderRadius: "4px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.max(actualProgress, progress)}%`,
                          background: "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                          borderRadius: "4px"
                        }}></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Badges */}
                  {badges.length > 0 && (
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: "15px"
                    }}>
                      {badges.map((badge, index) => (
                        <span
                          key={`${path.id}-badge-${index}`}
                          style={{
                            background: "linear-gradient(135deg, #FFD23F 0%, #F7931E 100%)",
                            color: "white",
                            padding: "3px 10px",
                            borderRadius: "15px",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          🏆 {badge.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between"
                  }}>
                    <button
                      onClick={() => setSelectedPath(path)}
                      style={{
                        padding: "10px 20px",
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
                      View Details
                    </button>
                    
                    {actualProgress === 0 && !path.enrolled ? (
                      <button
                        onClick={() => enrollInPath(path.id)}
                        style={{
                          padding: "10px 20px",
                          background: "white",
                          color: "#FF6A88",
                          border: "2px solid #FF6A88",
                          borderRadius: "30px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "all 0.3s"
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = "#FFF5F7";
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = "white";
                        }}
                      >
                        Enroll
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPath(path)}
                        style={{
                          padding: "10px 20px",
                          background: "white",
                          color: "#4A90E2",
                          border: "2px solid #4A90E2",
                          borderRadius: "30px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "all 0.3s"
                        }}
                      >
                        {actualProgress > 0 ? `Continue (${actualProgress}%)` : "Continue"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Learning Path Detail View */
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{ 
              margin: 0, 
              color: "#FF6A88",
              fontSize: "2rem"
            }}>
              {selectedPath.title}
            </h2>
            
            <button
              onClick={() => setSelectedPath(null)}
              style={{
                padding: "8px 15px",
                background: "white",
                color: "#FF6A88",
                border: "2px solid #FF6A88",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s"
              }}
            >
              ← Back to Paths
            </button>
          </div>
          
          <p style={{ 
            fontSize: "1.1rem", 
            color: "#666",
            marginBottom: "20px"
          }}>
            {selectedPath.description}
          </p>
          
          <div style={{ 
            display: "flex", 
            gap: "15px",
            marginBottom: "30px"
          }}>
            <span style={{
              background: "#FFF5F7",
              color: "#FF6A88",
              padding: "8px 15px",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "bold"
            }}>
              {selectedPath.difficulty}
            </span>
            
            <span style={{
              background: "#E0F7FA",
              color: "#0077BE",
              padding: "8px 15px",
              borderRadius: "20px",
              fontSize: "0.9rem"
            }}>
              {selectedPath.duration} hours
            </span>
            
            <span style={{
              background: "#E8F5E9",
              color: "#4CAF50",
              padding: "8px 15px",
              borderRadius: "20px",
              fontSize: "0.9rem"
            }}>
              {selectedPath.modules.length} modules
            </span>
          </div>
          
          {/* Modules */}
          <h3 style={{ 
            color: "#FF6A88",
            fontSize: "1.5rem",
            marginBottom: "20px"
          }}>
            Course Modules
          </h3>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "15px"
          }}>
            {selectedPath.modules.map(module => {
              // Calculate module progress
              const totalModuleLessons = module.lessons.length;
              const completedModuleLessons = getCompletedLessonsForPath(selectedPath.id)
                .filter(lessonId => 
                  module.lessons.some(lesson => lesson.id === lessonId)
                ).length;
              
              const moduleProgress = totalModuleLessons > 0 
                ? Math.round((completedModuleLessons / totalModuleLessons) * 100)
                : 0;
              
              return (
                <div
                  key={`module-${module.id || Math.random().toString(36).substring(2, 9)}`}
                  style={{
                    background: "#FFF5F7",
                    borderRadius: "10px",
                    border: "1px solid #FFE5EC"
                  }}
                >
                  <div
                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    style={{
                      padding: "15px 20px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <h4 style={{ 
                      margin: 0, 
                      color: "#333",
                      fontSize: "1.2rem"
                    }}>
                      {module.title}
                    </h4>
                    
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center",
                      gap: "15px"
                    }}>
                      <span style={{
                        background: "white",
                        color: "#FF6A88",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem"
                      }}>
                        {module.lessons.length} lessons
                      </span>
                      <span style={{
                        background: "#E0F7FA",
                        color: "#0077BE",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem"
                      }}>
                        {moduleProgress}% complete
                      </span>
                      <span style={{ fontSize: "1.2rem" }}>
                        {expandedModule === module.id ? "▼" : "▶"}
                      </span>
                    </div>
                  </div>
                  
                  {expandedModule === module.id && (
                    <div style={{
                      padding: "0 20px 20px",
                      borderTop: "1px solid #FFE5EC"
                    }}>
                      <p style={{ 
                        color: "#666",
                        marginBottom: "15px"
                      }}>
                        {module.description}
                      </p>
                      
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column",
                        gap: "10px"
                      }}>
                        {module.lessons.map((lesson, lessonIndex) => {
                          // Generate a fallback ID if lesson.id is undefined
                          const lessonId = lesson.id !== undefined ? lesson.id : `${module.id || 'unknown'}-lesson-${lessonIndex}`;
                          const isCompleted = getCompletedLessonsForPath(selectedPath.id)
                            .includes(lessonId);
                          
                          return (
                            <div
                              key={`${module.id || 'unknown'}-lesson-${lesson.id || Math.random().toString(36).substring(2, 9)}`}
                              style={{
                                background: isCompleted ? "#E8F5E9" : "white",
                                borderRadius: "8px",
                                padding: "12px 15px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: `1px solid ${isCompleted ? "#4CAF50" : "#FFE5EC"}`
                              }}
                            >
                              <div>
                                <div style={{ 
                                  fontWeight: "bold",
                                  marginBottom: "5px",
                                  color: isCompleted ? "#4CAF50" : "inherit"
                                }}>
                                  {lesson.title}
                                </div>
                                <div style={{ 
                                  fontSize: "0.9rem",
                                  color: "#666"
                                }}>
                                  {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • {lesson.duration} min
                                  {isCompleted && " • ✓ Completed"}
                                </div>
                              </div>
                              
                              <button
                                style={{
                                  padding: "8px 15px",
                                  background: isCompleted ? "#4CAF50" : "#FF6A88",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "20px",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem"
                                }}
                              >
                                {isCompleted ? "Review" : "Start"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPaths;