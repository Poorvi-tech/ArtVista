import React from "react";
import { useCart } from "../context/CartContext";

const products = [
  { id: 1, name: "Landscape Painting", price: 500, img: "/images/product1.jpeg" },
  { id: 2, name: "Urban Sketch", price: 350, img: "/images/product2.jpg" },
  { id: 3, name: "Abstract Art", price: 600, img: "/images/product3.jpg" },
  { id: 4, name: "Portrait Drawing", price: 450, img: "/images/product4.jpg" },
  { id: 5, name: "Watercolor Scene", price: 400, img: "/images/product5.jpg" },
  { id: 6, name: "Modern Sculpture", price: 750, img: "/images/product6.webp" },
  { id: 7, name: "Street Photography", price: 300, img: "/images/product7.webp" },
  { id: 8, name: "Oil Painting Set", price: 1200, img: "/images/product8.jpg" },
  { id: 9, name: "Digital Art Print", price: 250, img: "/images/product9.webp" },
  { id: 10, name: "Ceramic Vase Art", price: 550, img: "/images/product10.jpg" },
];

export default function Shop() {
  const { addToCart } = useCart();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        color: "#FF6A88", 
        marginBottom: "20px", 
        textAlign: "center",
        fontSize: "2.5rem"
      }}>
        <img src="/icons/shop-icon.png" alt="Shop" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Art Shop
      </h1>
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "40px", 
        color: "#666" 
      }}>
        Discover exclusive prints and original artworks from emerging artists
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
        gap: "30px",
        justifyItems: "center"
      }}>
        {products.map((p) => (
          <div key={p.id} style={{
            border: "1px solid #FFE5EC",
            padding: "20px",
            borderRadius: "15px",
            width: "100%",
            maxWidth: "280px",
            textAlign: "center",
            background: "white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
            transition: "transform 0.3s, box-shadow 0.3s",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
              background: "#FFF5F7",
              borderRadius: "10px",
              overflow: "hidden"
            }}>
              <img 
                src={p.img} 
                alt={p.name} 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "100%",
                  transition: "transform 0.5s"
                }}
                onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            </div>
            <h3 style={{ 
              margin: "0 0 10px 0", 
              color: "#333",
              fontSize: "1.3rem"
            }}>
              {p.name}
            </h3>
            <p style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              color: "#FF6A88",
              margin: "0 0 15px 0"
            }}>
              ₹{p.price}
            </p>
            <button 
              onClick={() => addToCart(p)} 
              style={{
                background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Recommended Section */}
      <div style={{ 
        marginTop: "60px",
        padding: "30px",
        background: "#FFF5F7",
        borderRadius: "15px",
        textAlign: "center"
      }}>
        <h2 style={{ 
          color: "#FF6A88", 
          marginBottom: "20px",
          fontSize: "2rem"
        }}>
          <img src="/icons/recommend-icon.png" alt="Recommend" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
          Recommended for You
        </h2>
        <p style={{ 
          fontStyle: "italic", 
          color: "#666",
          fontSize: "1.1rem",
          maxWidth: "700px",
          margin: "0 auto 20px"
        }}>
          Based on your browsing history, we think you'll love these special pieces
        </p>
        <button style={{
          background: "#FF6A88",
          color: "white",
          border: "none",
          padding: "12px 30px",
          borderRadius: "30px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}>
          View AI Recommendations
        </button>
      </div>
    </div>
  );
}