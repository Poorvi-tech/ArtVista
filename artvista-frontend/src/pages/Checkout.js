import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    payment: "card",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully! (Backend integration pending)");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        marginBottom: "20px", 
        color: "#FF6A88",
        textAlign: "center",
        fontSize: "2.5rem"
      }}>
        🧾 Checkout
      </h1>
      <p style={{ 
        textAlign: "center", 
        fontSize: "1.2rem", 
        marginBottom: "40px", 
        color: "#666" 
      }}>
        Complete your purchase and provide shipping information
      </p>
      
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        justifyContent: "center"
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
            border: "1px solid #FFE5EC",
            width: "100%",
            maxWidth: "500px"
          }}
        >
          <h2 style={{ 
            color: "#FF6A88",
            marginBottom: "10px",
            fontSize: "1.8rem"
          }}>
            Shipping Information
          </h2>
          
          <label style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "8px"
          }}>
            <span style={{ 
              fontWeight: "bold",
              color: "#333"
            }}>
              Full Name:
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                padding: "15px",
                borderRadius: "30px",
                border: "2px solid #ddd",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s"
              }}
              onFocus={e => e.target.style.border = "2px solid #FF6A88"}
              onBlur={e => e.target.style.border = "2px solid #ddd"}
              aria-label="Full Name"
            />
          </label>

          <label style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "8px"
          }}>
            <span style={{ 
              fontWeight: "bold",
              color: "#333"
            }}>
              Email:
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                padding: "15px",
                borderRadius: "30px",
                border: "2px solid #ddd",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s"
              }}
              onFocus={e => e.target.style.border = "2px solid #FF6A88"}
              onBlur={e => e.target.style.border = "2px solid #ddd"}
              aria-label="Email"
            />
          </label>

          <label style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "8px"
          }}>
            <span style={{ 
              fontWeight: "bold",
              color: "#333"
            }}>
              Shipping Address:
            </span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ 
                padding: "15px",
                borderRadius: "15px",
                border: "2px solid #ddd",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s",
                minHeight: "100px",
                resize: "vertical"
              }}
              onFocus={e => e.target.style.border = "2px solid #FF6A88"}
              onBlur={e => e.target.style.border = "2px solid #ddd"}
              aria-label="Shipping Address"
            />
          </label>

          <label style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "8px"
          }}>
            <span style={{ 
              fontWeight: "bold",
              color: "#333"
            }}>
              Payment Method:
            </span>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              style={{ 
                padding: "15px",
                borderRadius: "30px",
                border: "2px solid #ddd",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s",
                background: "white"
              }}
              onFocus={e => e.target.style.border = "2px solid #FF6A88"}
              onBlur={e => e.target.style.border = "2px solid #ddd"}
              aria-label="Payment Method"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </label>

          <button
            type="submit"
            style={{
              padding: "15px",
              background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            aria-label="Place Order"
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            Place Order
          </button>
          
          <div style={{ 
            textAlign: "center", 
            marginTop: "10px"
          }}>
            <Link to="/cart" style={{ 
              color: "#FF6A88", 
              fontWeight: "bold",
              textDecoration: "none"
            }}>
              ← Back to Cart
            </Link>
          </div>
        </form>
        
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC",
          width: "100%",
          maxWidth: "500px"
        }}>
          <h2 style={{ 
            color: "#FF6A88",
            marginBottom: "20px",
            fontSize: "1.8rem"
          }}>
            Order Summary
          </h2>
          
          <div style={{
            background: "#FFF5F7",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              paddingBottom: "15px",
              borderBottom: "1px solid #FFE5EC"
            }}>
              <span>Subtotal</span>
              <span>₹1,450</span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
              paddingBottom: "15px",
              borderBottom: "1px solid #FFE5EC"
            }}>
              <span>Shipping</span>
              <span>₹100</span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#FF6A88"
            }}>
              <span>Total</span>
              <span>₹1,550</span>
            </div>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            borderRadius: "15px",
            padding: "20px",
            color: "white",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 10px 0" }}>🔒 Secure Checkout</h3>
            <p style={{ margin: "0", opacity: "0.9" }}>
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}