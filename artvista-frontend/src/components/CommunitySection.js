import React, { useState } from "react";

export default function CommunitySection() {
  const [comments, setComments] = useState([
    { user: "Alice", text: "Amazing artwork! 🎨" },
    { user: "Bob", text: "Loved the colors and composition!" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(12);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { user: "You", text: newComment }]);
    setNewComment("");
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleShare = (platform) => {
    alert(`Shared on ${platform}!`);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        boxSizing: "border-box",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC"
      }}
    >
      <h3 style={{ 
        textAlign: "center",
        color: "#FF6A88",
        fontSize: "1.8rem",
        marginBottom: "25px"
      }}>
        <img src="/icons/community-icon.png" alt="Community" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
        Community Section
      </h3>

      {/* Likes */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <button
          onClick={handleLike}
          style={{
            background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "bold",
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
          <img src="/icons/like-icon.png" alt="Like" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
          Like ({likes})
        </button>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ 
          color: "#FF6A88",
          marginBottom: "15px",
          fontSize: "1.3rem"
        }}>
          <img src="/icons/comment-icon.png" alt="Comment" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
          Comments
        </h4>
        {comments.map((c, index) => (
          <div 
            key={index} 
            style={{
              background: "#FFF5F7",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              borderLeft: "4px solid #FF6A88"
            }}
          >
            <p style={{ 
              wordBreak: "break-word",
              margin: "0",
              fontSize: "1rem"
            }}>
              <b style={{ color: "#FF6A88" }}>{c.user}:</b> {c.text}
            </p>
          </div>
        ))}

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "10px",
          marginTop: "15px"
        }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              padding: "12px",
              flex: "1 1 60%",
              minWidth: "120px",
              borderRadius: "30px",
              border: "2px solid #ddd",
              boxSizing: "border-box",
              fontSize: "1rem"
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
          />
          <button
            onClick={handleAddComment}
            style={{
              background: "#FF6A88",
              color: "white",
              padding: "12px 25px",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
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
            <img src="/icons/send-icon.png" alt="Send" style={{ width: "15px", height: "15px", marginRight: "5px" }} />
            Post
          </button>
        </div>
      </div>

      {/* Share */}
      <div style={{ textAlign: "center" }}>
        <h4 style={{ 
          color: "#FF6A88",
          marginBottom: "15px",
          fontSize: "1.3rem"
        }}>
          <img src="/icons/share-icon.png" alt="Share" style={{ width: "20px", height: "20px", marginRight: "5px" }} />
          Share this artwork:
        </h4>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px", 
          flexWrap: "wrap" 
        }}>
          <button 
            onClick={() => handleShare("Twitter")}
            style={{
              background: "#1DA1F2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
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
            <img src="/icons/twitter-icon.png" alt="Twitter" style={{ width: "15px", height: "15px", marginRight: "5px" }} />
            Twitter
          </button>
          <button 
            onClick={() => handleShare("Facebook")}
            style={{
              background: "#4267B2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
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
            <img src="/icons/facebook-icon.png" alt="Facebook" style={{ width: "15px", height: "15px", marginRight: "5px" }} />
            Facebook
          </button>
          <button 
            onClick={() => handleShare("Instagram")}
            style={{
              background: "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
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
            <img src="/icons/instagram-icon.png" alt="Instagram" style={{ width: "15px", height: "15px", marginRight: "5px" }} />
            Instagram
          </button>
        </div>
      </div>
    </div>
  );
}