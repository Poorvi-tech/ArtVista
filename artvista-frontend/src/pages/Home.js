import React from 'react';
import AIRecommendations from "../components/AIRecommendations";
import ArtCreationSuggestions from "../components/ArtCreationSuggestions";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleExploreGallery = () => {
    navigate('/gallery');
  };

  const handlePlayAllGames = () => {
    navigate('/games');
  };

  const handleShopArt = () => {
    navigate('/shop');
  };

  const handleViewBlogs = () => {
    navigate('/blog');
  };

  const handleViewLearning = () => {
    navigate('/learning');
  };

  const handleViewCommunity = () => {
    navigate('/social');
  };

  const handleViewExhibition = () => {
    navigate('/exhibition');
  };

  // Mock data for featured sections
  const featuredArtworks = [
    { id: 1, title: "Beautiful Mountain", category: "Landscapes", src: "/images/artwork1.jpg" },
    { id: 2, title: "City Skyline", category: "Urban", src: "/images/artwork2.jpg" },
    { id: 3, title: "Color Splash", category: "Abstract", src: "/images/artwork3.jpg" },
    { id: 4, title: "Sunny Beach", category: "Landscapes", src: "/images/artwork4.jpg" }
  ];

  const trendingBlogs = [
    { id: 1, title: "5 Tips for Better Landscape Painting", excerpt: "Learn how to improve your landscapes with simple techniques..." },
    { id: 2, title: "The Beauty of Abstract Art", excerpt: "Abstract art is more than shapes and colors — it's about expression..." },
    { id: 3, title: "Urban Sketching: Capturing the City", excerpt: "Discover how to capture the energy of cityscapes in your sketches..." }
  ];

  const featuredLearningPaths = [
    { id: 1, title: "Watercolor Fundamentals", difficulty: "Beginner", duration: 10 },
    { id: 2, title: "Digital Art Mastery", difficulty: "Intermediate", duration: 15 },
    { id: 3, title: "Portrait Drawing Essentials", difficulty: "Beginner", duration: 12 }
  ];

  const communityHighlights = [
    { id: 1, user: "Aditi Sharma", action: "liked", artwork: "Sunset Valley", timestamp: "2 hours ago" },
    { id: 2, user: "Rohan Patel", action: "commented", artwork: "City Rush", timestamp: "4 hours ago" },
    { id: 3, user: "Priya Kumar", action: "shared", artwork: "Dream Shapes", timestamp: "6 hours ago" }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
        borderRadius: "15px",
        padding: "40px 20px",
        textAlign: "center",
        color: "white",
        marginBottom: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px", textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
          Welcome to ArtVista
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "30px", maxWidth: "800px", margin: "0 auto 30px" }}>
          Discover, explore, and create amazing art with our AI-powered platform
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <button 
            onClick={handleExploreGallery}
            style={{
              background: "white",
              color: "#FF6A88",
              border: "none",
              padding: "15px 30px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            Explore Gallery
          </button>
          <button 
            onClick={handlePlayAllGames}
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid white",
              padding: "15px 30px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "white";
              e.target.style.color = "#FF6A88";
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
              e.target.style.color = "white";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🎮 Play Games Hub
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        marginBottom: "40px"
      }}>
        <StatCard number="1000+" label="Artworks" />
        <StatCard number="500+" label="Artists" />
        <StatCard number="50+" label="Learning Paths" />
        <StatCard number="10K+" label="Community Members" />
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.2rem", marginBottom: "30px", color: "#FF6A88" }}>
          Why Choose ArtVista?
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          <FeatureCard 
            icon={<img src="/icons/ai-icon.png" alt="AI" style={{ width: "50px", height: "50px" }} />}
            title="AI Recommendations"
            description="Get personalized art suggestions based on your preferences"
          />
          <FeatureCard 
            icon={<img src="/icons/gallery-icon.png" alt="Gallery" style={{ width: "50px", height: "50px" }} />}
            title="Extensive Gallery"
            description="Browse thousands of beautiful artworks from talented artists"
          />
          <FeatureCard 
            icon={<img src="/icons/game-icon.png" alt="Game" style={{ width: "50px", height: "50px" }} />}
            title="Interactive Games"
            description="Play fun puzzles and challenge your creativity"
          />
        </div>
      </section>

      {/* Featured Artworks */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.2rem", color: "#FF6A88" }}>
            <img src="/icons/featured-icon.png" alt="Featured" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Featured Artworks
          </h2>
          <button 
            onClick={handleExploreGallery}
            style={{
              background: "transparent",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "#FFF5F7";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            View All
          </button>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px"
        }}>
          {featuredArtworks.map(art => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section style={{ marginBottom: "40px" }}>
        <AIRecommendations />
      </section>

      {/* Art Creation Suggestions */}
      <section style={{ marginBottom: "40px" }}>
        <ArtCreationSuggestions />
      </section>

      {/* Trending Blogs */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.2rem", color: "#FF6A88" }}>
            <img src="/icons/blog-icon.png" alt="Blog" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Trending Blogs & Tutorials
          </h2>
          <button 
            onClick={handleViewBlogs}
            style={{
              background: "transparent",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "#FFF5F7";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            View All
          </button>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {trendingBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* Featured Learning Paths */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.2rem", color: "#FF6A88" }}>
            <img src="/icons/learning-icon.png" alt="Learning" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Featured Learning Paths
          </h2>
          <button 
            onClick={handleViewLearning}
            style={{
              background: "transparent",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "#FFF5F7";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            View All
          </button>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {featuredLearningPaths.map(path => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      </section>

      {/* Community Highlights */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.2rem", color: "#FF6A88" }}>
            <img src="/icons/community-icon.png" alt="Community" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Community Highlights
          </h2>
          <button 
            onClick={handleViewCommunity}
            style={{
              background: "transparent",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "#FFF5F7";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            Join Community
          </button>
        </div>
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          {communityHighlights.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.2rem", marginBottom: "30px", color: "#FF6A88" }}>
          Explore Our Collections
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <CategoryCard 
            title="Landscapes"
            image="/images/landscapes.jpg"
            onClick={handleExploreGallery}
          />
          <CategoryCard 
            title="Abstract Art"
            image="/images/abstract.jpg"
            onClick={handleExploreGallery}
          />
          <CategoryCard 
            title="Urban Sketches"
            image="/images/urban.jpg"
            onClick={handleExploreGallery}
          />
        </div>
      </section>

      {/* Virtual Exhibition */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.2rem", color: "#FF6A88" }}>
            <img src="/icons/exhibition-icon.png" alt="Exhibition" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Virtual Exhibition
          </h2>
          <button 
            onClick={handleViewExhibition}
            style={{
              background: "transparent",
              color: "#FF6A88",
              border: "2px solid #FF6A88",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.background = "#FFF5F7";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            Enter Exhibition
          </button>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
          borderRadius: "15px",
          padding: "30px",
          textAlign: "center",
          border: "1px solid #FFE5EC"
        }}>
          <h3 style={{ fontSize: "1.8rem", color: "#FF6A88", marginBottom: "15px" }}>
            AI Curated Art Exhibition
          </h3>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "20px" }}>
            Experience our latest AI-curated collection of masterpieces
          </p>
          <button 
            onClick={handleViewExhibition}
            style={{
              background: "#FF6A88",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s"
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            Explore Now
          </button>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        background: "#FFF5F7",
        borderRadius: "15px",
        padding: "40px 20px",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#FF6A88" }}>
          Ready to Shop Unique Art?
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px", maxWidth: "700px", margin: "0 auto 30px" }}>
          Discover exclusive prints and original artworks from emerging artists
        </p>
        <button 
          onClick={handleShopArt}
          style={{
            background: "#FF6A88",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "50px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            transition: "transform 0.3s, box-shadow 0.3s"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
          }}
        >
          Visit Our Shop
        </button>
      </section>

      {/* Testimonials */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.2rem", marginBottom: "30px", color: "#FF6A88" }}>
          What Art Lovers Say
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          <TestimonialCard 
            quote="ArtVista helped me discover incredible artists I never would have found otherwise!"
            author="Sarah K."
          />
          <TestimonialCard 
            quote="The games hub is amazing! So many fun challenges with different difficulty levels."
            author="Michael T."
          />
          <TestimonialCard 
            quote="The AI recommendations are spot-on. It's like having a personal art curator."
            author="Priya R."
          />
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    width: "250px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.3s",
    border: "1px solid #FFE5EC"
  }}
  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>{icon}</div>
    <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#FF6A88" }}>{title}</h3>
    <p style={{ color: "#666" }}>{description}</p>
  </div>
);

// Category Card Component
const CategoryCard = ({ title, image, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      width: "250px",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
      cursor: "pointer",
      transition: "transform 0.3s",
      border: "1px solid #FFE5EC"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
  >
    <div style={{
      height: "200px",
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }} />
    <div style={{
      background: "white",
      padding: "15px",
      textAlign: "center"
    }}>
      <h3 style={{ margin: "0", color: "#FF6A88" }}>{title}</h3>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    width: "300px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    borderLeft: "5px solid #FF6A88",
    border: "1px solid #FFE5EC"
  }}>
    <p style={{ fontStyle: "italic", marginBottom: "20px", fontSize: "1.1rem" }}>"{quote}"</p>
    <p style={{ fontWeight: "bold", textAlign: "right", color: "#FF6A88" }}>- {author}</p>
  </div>
);

// Stat Card Component
const StatCard = ({ number, label }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    width: "180px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    border: "1px solid #FFE5EC"
  }}>
    <div style={{ 
      fontSize: "2rem", 
      fontWeight: "bold", 
      color: "#FF6A88",
      marginBottom: "10px"
    }}>
      {number}
    </div>
    <div style={{ 
      fontSize: "1.1rem", 
      color: "#666"
    }}>
      {label}
    </div>
  </div>
);

// Artwork Card Component
const ArtworkCard = ({ artwork }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "1px solid #FFE5EC",
    cursor: "pointer"
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
        src={artwork.src}
        alt={artwork.title}
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
        {artwork.title}
      </h3>
      <span style={{
        background: "#FF6A88",
        color: "white",
        padding: "5px 15px",
        borderRadius: "20px",
        fontSize: "0.9rem"
      }}>
        {artwork.category}
      </span>
    </div>
  </div>
);

// Blog Card Component
const BlogCard = ({ blog }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
    border: "1px solid #FFE5EC",
    transition: "transform 0.3s, box-shadow 0.3s"
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
  }}
  >
    <h3 style={{ 
      margin: "0 0 15px 0", 
      color: "#333",
      fontSize: "1.4rem"
    }}>
      {blog.title}
    </h3>
    <p style={{ 
      margin: "0 0 20px 0", 
      color: "#666",
      lineHeight: "1.6"
    }}>
      {blog.excerpt}
    </p>
    <button style={{
      color: "white",
      background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
      padding: "10px 20px",
      borderRadius: "30px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseEnter={e => {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={e => {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    }}
    >
      Read More
    </button>
  </div>
);

// Learning Path Card Component
const LearningPathCard = ({ path }) => (
  <div style={{
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
    border: "1px solid #FFE5EC",
    transition: "transform 0.3s, box-shadow 0.3s"
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
  }}
  >
    <h3 style={{ 
      margin: "0 0 15px 0", 
      color: "#333",
      fontSize: "1.4rem"
    }}>
      {path.title}
    </h3>
    <div style={{ 
      display: "flex", 
      gap: "10px",
      marginBottom: "15px"
    }}>
      <span style={{
        background: "#FFF5F7",
        color: "#FF6A88",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "0.8rem"
      }}>
        {path.difficulty}
      </span>
      <span style={{
        background: "#E0F7FA",
        color: "#0077BE",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "0.8rem"
      }}>
        {path.duration} hours
      </span>
    </div>
    <button style={{
      color: "white",
      background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
      padding: "10px 20px",
      borderRadius: "30px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseEnter={e => {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={e => {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    }}
    >
      Start Learning
    </button>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => (
  <div style={{
    padding: "15px 0",
    borderBottom: "1px solid #FFE5EC"
  }}>
    <div style={{ 
      display: "flex", 
      alignItems: "center"
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
        {activity.user.charAt(0)}
      </div>
      <div>
        <div style={{ fontWeight: "bold" }}>{activity.user}</div>
        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          <span style={{ color: "#FF6A88" }}>{activity.action}</span> an artwork • {activity.timestamp}
        </div>
      </div>
    </div>
  </div>
);

export default Home;