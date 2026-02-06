import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  // Track window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    setProfileDropdownOpen(false);
    navigate("/profile");
  };

  const handleResetPassword = () => {
    setProfileDropdownOpen(false);
    // For now, we'll just show an alert since there's no specific reset password page
    alert("Password reset functionality would be implemented here. In a real app, this would send a reset link to your email.");
  };

  const navLinks = (
    <>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/gallery" style={linkStyle}>
        Gallery
      </Link>
      <Link to="/blog" style={linkStyle}>
        Blog
      </Link>
      <Link to="/about" style={linkStyle}>
        About
      </Link>
      
      {/* Premium features - show different UI based on auth status */}
      {user ? (
        <>
          <Link to="/leaderboard" style={linkStyle}>
            Leaderboard
          </Link>
          <Link to="/exhibition" style={linkStyle}>
            Exhibition
          </Link>
          <Link to="/artcreator" style={linkStyle}>
            Art Creator
          </Link>
          <Link to="/social" style={linkStyle}>
            Community
          </Link>
          <Link to="/learning" style={linkStyle}>
            Learning
          </Link>
          <Link to="/shop" style={linkStyle}>
            Shop
          </Link>
          <Link to="/cart" style={linkStyle}>
            🛒 Cart
          </Link>
          <Link to="/checkout" style={linkStyle}>
            Checkout
          </Link>
        </>
      ) : (
        <>
          <Link to="/leaderboard" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Leaderboard 
          </Link>
          <Link to="/exhibition" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Exhibition 
          </Link>
          <Link to="/artcreator" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Art Creator 
          </Link>
          <Link to="/social" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Community 
          </Link>
          <Link to="/learning" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Learning 
          </Link>
          <Link to="/shop" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Shop 
          </Link>
          <Link to="/cart" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            🛒 Cart 
          </Link>
          <Link to="/checkout" style={{ ...linkStyle, opacity: 0.7 }} title="Login required">
            Checkout 
          </Link>
        </>
      )}
    </>
  );

  const authLinks = user ? (
    <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: "10px", alignItems: "center" }}>
      <div 
        ref={profileDropdownRef}
        style={{ position: "relative" }}
      >
        <div 
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "5px 10px",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span></span>
          <span>{user.email}</span>
          <span style={{ fontSize: "0.8rem", marginLeft: "5px" }}>
            {profileDropdownOpen ? "▲" : "▼"}
          </span>
        </div>
        
        {profileDropdownOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            right: "0",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: "200px",
            zIndex: "1000",
            marginTop: "5px",
            border: "1px solid #FFE5EC"
          }}>
            <div 
              onClick={handleProfile}
              style={{
                padding: "12px 20px",
                color: "#333",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={e => e.target.style.background = "#FFF5F7"}
              onMouseLeave={e => e.target.style.background = "white"}
            >
              <span></span>
              <span>Profile</span>
            </div>
            <div 
              onClick={handleResetPassword}
              style={{
                padding: "12px 20px",
                color: "#333",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={e => e.target.style.background = "#FFF5F7"}
              onMouseLeave={e => e.target.style.background = "white"}
            >
              <span></span>
              <span>Reset Password</span>
            </div>
            <div 
              onClick={handleLogout}
              style={{
                padding: "12px 20px",
                color: "#333",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={e => e.target.style.background = "#FFF5F7"}
              onMouseLeave={e => e.target.style.background = "white"}
            >
              <span></span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: "10px" }}>
      <Link to="/login" style={linkStyle}>
        Login
      </Link>
      <Link to="/signup" style={linkStyle}>
        Signup
      </Link>
    </div>
  );

  return (
    <nav style={navStyle}>
      {/* Top row: Logo + Hamburger */}
      <div style={topRowStyle}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "2rem", marginRight: "10px" }}>🎨</span>
          ArtVista
        </h2>
        {!isDesktop && (
          <button
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={hamburgerStyle}
          >
            ☰
          </button>
        )}
      </div>

      {/* Links + Auth */}
      {(menuOpen || isDesktop) && (
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: "15px",
            marginTop: isDesktop ? "10px" : "10px",
            alignItems: isDesktop ? "center" : "flex-start",
            flexWrap: "wrap",
          }}
        >
          {navLinks}
          {authLinks}
        </div>
      )}
    </nav>
  );
}

// Reusable styles
const navStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "15px 20px",
  background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const hamburgerStyle = {
  display: "block",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "1.8rem",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "5px",
  transition: "background 0.3s",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 15px",
  borderRadius: "20px",
  transition: "background 0.3s, transform 0.2s",
  fontWeight: "500",
  border: "1px solid transparent",
};