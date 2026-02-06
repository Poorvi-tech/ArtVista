import React from "react";
import { useParams, Link } from "react-router-dom";

// Dummy blog content
const blogContent = {
  1: {
    title: "5 Tips for Better Landscape Painting",
    content: `
Landscapes are one of the most popular subjects in painting. 
Here are 5 tips to improve your landscape artwork:

1. Use depth with perspective - Create layers in your painting with foreground, middle ground, and background elements. Objects in the distance should be lighter, less detailed, and slightly blurred.

2. Add contrast for realism - Use strong contrasts between light and shadow to create depth and visual interest. This will make your painting pop off the canvas.

3. Focus on light and shadow - Observe how natural light affects your scene. Paint the light sources and shadows accurately to create a believable atmosphere.

4. Practice skies and clouds - The sky sets the mood of your landscape. Practice painting different types of clouds and atmospheric conditions to enhance your scenes.

5. Capture natural textures - Different elements in nature have distinct textures. Practice painting grass, water, rocks, and foliage with appropriate brush techniques.
    `,
  },
  2: {
    title: "The Beauty of Abstract Art",
    content: `
Abstract art is not random — it's a powerful form of expression through form, color, and composition.

Famous abstract artists like Kandinsky, Pollock, and Mondrian explored emotions and concepts rather than depicting reality. Abstract art allows both the artist and viewer to interpret meaning in personal ways.

Key elements of abstract art:
- Color: Can evoke emotions and set the mood
- Shape: Geometric or organic forms that create structure
- Texture: Can be actual or implied through brushwork
- Composition: How elements are arranged on the canvas

To create compelling abstract art:
1. Start with a feeling or concept you want to express
2. Experiment with colors and brush strokes to convey that emotion
3. Don't worry about representing real objects
4. Focus on balance and visual harmony
5. Trust your instincts and embrace spontaneity
    `,
  },
  3: {
    title: "Urban Sketching: Capturing the City",
    content: `
Urban sketching is about capturing the energy and life of city environments in real-time.

Getting started with urban sketching:
- Start small with coffee shops, streets, and parks
- Use simple tools — pen and watercolor or a sketchbook and pencil
- Focus on storytelling, not perfection
- Capture moments, people, and the atmosphere

Essential tips for urban sketching:
1. Work quickly - City scenes change rapidly with moving people and vehicles
2. Simplify complex scenes - Focus on major shapes and forms rather than details
3. Use bold lines - They show up better in busy environments
4. Embrace imperfections - They add character to your sketches
5. Include people - They bring life and scale to urban scenes

Remember: Urban sketching is about experiencing the city through art, not creating perfect drawings. The process is just as important as the result.
    `,
  },
};

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogContent[id];

  if (!post) {
    return (
      <div style={{ 
        padding: "20px", 
        maxWidth: "1200px", 
        margin: "0 auto", 
        textAlign: "center" 
      }}>
        <h2 style={{ 
          fontSize: "2rem", 
          color: "#FF6A88" 
        }}>
          Blog not found
        </h2>
        <Link
          to="/blog"
          style={{
            display: "inline-block",
            marginTop: "20px",
            color: "white",
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            padding: "12px 25px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          aria-label="Back to Blog List"
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "40px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "20px", 
          color: "#FF6A88"
        }}>
          {post.title}
        </h1>
        
        <div style={{
          height: "300px",
          background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "30px",
          color: "white",
          fontSize: "1.5rem"
        }}>
          <img src="/images/blog-detail.png" alt="Blog Post" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }} />
        </div>
        
        <div
          style={{
            whiteSpace: "pre-line",
            color: "#444",
            lineHeight: "1.8",
            fontSize: "1.1rem",
          }}
        >
          {post.content}
        </div>
        
        <Link
          to="/blog"
          style={{
            display: "inline-block",
            marginTop: "30px",
            color: "white",
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            padding: "12px 25px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          aria-label="Back to Blog List"
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;