import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center",
        fontSize: "2.5rem"
      }}>
        🛍️ Your Cart
      </h1>
      
      {cart.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <h2 style={{ 
            fontSize: "1.8rem", 
            color: "#FF6A88",
            marginBottom: "20px"
          }}>
            Your cart is empty
          </h2>
          <p style={{ 
            fontSize: "1.2rem", 
            marginBottom: "30px"
          }}>
            Discover amazing artworks in our shop
          </p>
          <Link to="/shop" style={{
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "inline-block"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
          }}>
            Browse Shop
          </Link>
        </div>
      ) : (
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #FFE5EC",
                paddingBottom: "20px",
                gap: "15px"
              }}
            >
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "10px",
                overflow: "hidden"
              }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <div style={{ 
                flex: "1 1 200px",
                minWidth: "150px"
              }}>
                <h3 style={{ 
                  margin: "0 0 5px 0", 
                  color: "#333"
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  margin: "0", 
                  fontSize: "1.2rem", 
                  fontWeight: "bold", 
                  color: "#FF6A88"
                }}>
                  ₹{item.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(i)}
                style={{
                  background: "#ff4757",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderRadius: "30px",
                  flexShrink: 0,
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                aria-label={`Remove ${item.name} from cart`}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                Remove
              </button>
            </div>
          ))}
          
          <div style={{
            borderTop: "2px solid #FF6A88",
            paddingTop: "20px",
            marginTop: "20px"
          }}>
            <h3 style={{ 
              textAlign: "right", 
              fontSize: "1.5rem",
              color: "#333"
            }}>
              Total: <span style={{ color: "#FF6A88", fontWeight: "bold" }}>₹{total}</span>
            </h3>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "15px",
              marginTop: "20px"
            }}>
              <Link to="/shop" style={{
                background: "white",
                color: "#FF6A88",
                border: "2px solid #FF6A88",
                padding: "12px 25px",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
              }}>
                Continue Shopping
              </Link>
              
              <Link to="/checkout" style={{
                background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}