import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Better Landscape Painting",
    excerpt: "Learn how to improve your landscapes with simple techniques that professional artists use...",
    image: "/images/blog1.jpg",
  },
  {
    id: 2,
    title: "The Beauty of Abstract Art",
    excerpt: "Abstract art is more than shapes and colors — it's about expression, emotion, and breaking traditional boundaries...",
    image: "/images/blog2.jpg",
  },
  {
    id: 3,
    title: "Urban Sketching: Capturing the City",
    excerpt: "Discover how to capture the energy of cityscapes in your sketches with these essential techniques...",
    image: "/images/blog3.jpg",
  },
  {
    id: 4,
    title: "Color Theory Basics for Artists",
    excerpt: "Understanding color relationships can transform your artwork. Learn the fundamentals of color theory and how to apply them...",
    image: "/images/blog4.jpg",
  },
  {
    id: 5,
    title: "Mastering Watercolor Techniques",
    excerpt: "Watercolor can be challenging but rewarding. Explore essential techniques for controlling water and pigment...",
    image: "/images/blog5.webp",
  },
  {
    id: 6,
    title: "Digital Art vs Traditional Art",
    excerpt: "Both digital and traditional art have their merits. Discover the pros and cons of each medium and which might suit you best...",
    image: "/images/blog6.jpg",
  },
  {
    id: 7,
    title: "Creating Depth in Your Paintings",
    excerpt: "Add dimension to your artwork with these proven techniques for creating depth and perspective...",
    image: "/images/blog7.webp",
  },
  {
    id: 8,
    title: "Portrait Drawing Fundamentals",
    excerpt: "Learn the basics of portrait drawing, from proportion and symmetry to capturing expression and personality...",
    image: "/images/blog8.webp",
  },
  {
    id: 9,
    title: "Art Journaling for Creative Growth",
    excerpt: "Discover how keeping an art journal can boost creativity, improve skills, and document your artistic journey...",
    image: "/images/blog9.jpg",
  },
  {
    id: 10,
    title: "Composition Secrets from the Masters",
    excerpt: "What makes a painting truly captivating? Learn composition techniques used by master artists throughout history...",
    image: "/images/blog10.jpg",
  },
];

const BlogList = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center"
      }}>
        <img src="/icons/blog-icon.png" alt="Blog" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Blog & Tutorials
      </h1>
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "40px", 
        color: "#666" 
      }}>
        Explore our collection of art tutorials, tips, and inspiration
      </p>

      <div style={{ display: "grid", gap: "30px" }}>
        {blogPosts.map((post) => (
          <div
            key={post.id}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              padding: "25px",
              borderRadius: "15px",
              background: "white",
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
            <div style={{
              width: "100%",
              maxWidth: "250px",
              height: "180px",
              borderRadius: "10px",
              overflow: "hidden",
              flexShrink: 0
            }}>
              <img
                src={post.image}
                alt={post.title}
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
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <h2 style={{ 
                margin: "0 0 15px 0", 
                color: "#333",
                fontSize: "1.6rem"
              }}>
                {post.title}
              </h2>
              <p style={{ 
                margin: "0 0 20px 0", 
                color: "#666",
                lineHeight: "1.7",
                fontSize: "1.1rem"
              }}>
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.id}`}
                style={{
                  color: "white",
                  background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                  padding: "12px 25px",
                  borderRadius: "30px",
                  textDecoration: "none",
                  display: "inline-block",
                  fontWeight: "bold",
                  width: "fit-content",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                aria-label={`Read more about ${post.title}`}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <img src="/icons/readmore-icon.png" alt="Read More" style={{ width: "15px", height: "15px", marginRight: "5px" }} />
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;