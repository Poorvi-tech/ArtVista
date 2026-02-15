import React from "react";
import { useParams, Link } from "react-router-dom";

// Dummy blog content (expanded to cover all posts listed in BlogList)
const blogContent = {
  1: {
    title: "5 Tips for Better Landscape Painting",
    content: `Landscapes are one of the most popular subjects in painting. Here are five practical tips to improve your landscape artwork:

1) Use depth with perspective — build foreground, middle ground, and background; soften details and lower contrast in the distance.

2) Add contrast for realism — place strong lights and shadows to create focal points and three-dimensionality.

3) Observe light and color temperature — warm sunlight vs cool shadows will sell atmosphere.

4) Practice skies and weather — paint skies first to set mood, and study cloud formation.

5) Capture textures — develop quick marks for foliage, water, and rocks rather than over-rendering.

Practice each tip in small, focused studies and combine them in larger pieces.`,
    video: 'https://www.youtube.com/embed/oWsE_K4ViHM'
  },
  2: {
    title: "The Beauty of Abstract Art",
    content: `Abstract art explores form, color, and composition to communicate emotion and ideas without literal depiction.

Key ideas: use color to set mood, experiment with shapes and repetition, and apply varied textures for interest. Start with a simple concept, make quick studies, and iterate—trust intuition over literal representation.`,
    video: 'https://www.youtube.com/embed/AB7JR3Y3hWU'
  },
  3: {
    title: "Urban Sketching: Capturing the City",
    content: `Urban sketching captures scenes quickly and directly from life. Work with pen and small watercolor sets.

Tips: prioritize composition, use loose perspective, sketch people as simple shapes, and focus on storytelling. Keep it portable and sketch often to improve speed and confidence.`,
    video: 'https://www.youtube.com/embed/Fu4mrB5pUVo'
  },
  4: {
    title: "Color Theory Basics for Artists",
    content: `Understanding color relationships is essential. Learn the color wheel, complementary and analogous schemes, and how to mix neutrals.

Practice exercises: limit your palette, mix tints and tones, and paint color studies under different lighting to understand temperature and harmony.`,
    video: 'https://www.youtube.com/embed/D-s6puCzUTM'
  },
  5: {
    title: "Mastering Watercolor Techniques",
    content: `Watercolor demands control of water and pigment. Key techniques include wet-on-wet, wet-on-dry, glazing, lifting, and drybrush.

Start with value studies, learn to preserve highlights with masking or careful planning, and practice gradients and texture effects to gain confidence.`,
    video: 'https://www.youtube.com/embed/PIjWUdmby8A'
  },
  6: {
    title: "Digital Art vs Traditional Art",
    content: `Both digital and traditional media offer unique strengths. Digital art is flexible and forgiving with layers and undo; traditional media gives tactile response and unique textures.

Tips: learn fundamentals in any medium (composition, value, color), then translate skills across platforms. Experiment with hybrids—scan traditional textures into digital work.`,
    video: 'https://www.youtube.com/embed/5Fvj2ajEB6I'
  },
  7: {
    title: "Creating Depth in Your Paintings",
    content: `Create depth using atmospheric perspective, overlapping forms, scale, and value contrast. Cooler, lighter tones recede; warmer, darker tones come forward.

Use edges strategically—soften distant edges and keep foreground edges sharper to guide the eye.`,
    video: 'https://www.youtube.com/embed/EBc6SHUw7mw'
  },
  8: {
    title: "Portrait Drawing Fundamentals",
    content: `Start portraits by mapping proportions (eyes at halfway, nose and mouth positions), then block in large shapes before details.

Practice capturing gesture and expression with quick studies; focus on planes of the face and consistent light to model form.`,
    video: 'https://www.youtube.com/embed/ux0p4mJ37YU'
  },
  9: {
    title: "Art Journaling for Creative Growth",
    content: `An art journal is a personal space to experiment, record ideas, and practice regularly. Use prompts, small daily studies, and mixed media to build a habit.

Treat the journal as a laboratory—no finished pieces required, only progress.`,
    video: 'https://www.youtube.com/embed/BOYIxByOr7w'
  },
  10: {
    title: "Composition Secrets from the Masters",
    content: `Study masterworks to learn balance, rhythm, focal points, and use of negative space. Rules like the rule of thirds, leading lines, and triangular compositions help—but so does deliberate rule-breaking.

Practice composing thumbnails and rearranging elements until the design reads clearly.`,
    video: 'https://www.youtube.com/embed/JsXTxujQYeE'
  }
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
        {post.video && (
          <div style={{ marginTop: 24 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
              <iframe
                src={post.video}
                title={post.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
        
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