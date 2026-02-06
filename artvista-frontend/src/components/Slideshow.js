import React, { useState } from "react";

const dummyImages = [
  "https://wallpapercave.com/wp/j1O8bCz.jpg",
  "https://via.placeholder.com/600x300/cccccc",
  "https://wallpaperaccess.com/full/489157.jpg",
];

const Slideshow = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((index + 1) % dummyImages.length);
  const prevSlide = () =>
    setIndex((index - 1 + dummyImages.length) % dummyImages.length);

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "100%",
        width: "600px",
        margin: "20px auto",
      }}
    >
      <img
        src={dummyImages[index]}
        alt={`Slide ${index + 1}`}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          display: "block",
        }}
      />

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        ◀
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        ▶
      </button>
    </div>
  );
};

export default Slideshow;
