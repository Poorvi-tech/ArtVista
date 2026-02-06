import React from "react";

const Lightbox = ({ src, onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "10px", // ensures spacing on small screens
      }}
      onClick={onClose} // clicking outside closes
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
        style={{ position: "relative", width: "100%", maxWidth: "95%" }}
      >
        <img
          src={src}
          alt="Artwork"
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        />
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "6px 12px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
