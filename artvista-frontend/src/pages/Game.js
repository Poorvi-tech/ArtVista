import React, { useState } from "react";

const initialTiles = [
  { id: 1, content: <img src="/icons/puzzle-piece-1.png" alt="Puzzle Piece 1" style={{ width: "50px", height: "50px" }} /> },
  { id: 2, content: <img src="/icons/puzzle-piece-2.png" alt="Puzzle Piece 2" style={{ width: "50px", height: "50px" }} /> },
  { id: 3, content: <img src="/icons/puzzle-piece-3.png" alt="Puzzle Piece 3" style={{ width: "50px", height: "50px" }} /> },
  { id: 4, content: <img src="/icons/puzzle-piece-4.png" alt="Puzzle Piece 4" style={{ width: "50px", height: "50px" }} /> },
];

// Utility: shuffle array
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const Game = () => {
  const [tiles, setTiles] = useState(shuffleArray(initialTiles));
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleDragStart = (tile) => setDraggedItem(tile);

  const handleDrop = (targetTile) => {
    if (!draggedItem) return;

    const draggedIndex = tiles.findIndex((t) => t.id === draggedItem.id);
    const targetIndex = tiles.findIndex((t) => t.id === targetTile.id);

    const newTiles = [...tiles];
    newTiles[draggedIndex] = targetTile;
    newTiles[targetIndex] = draggedItem;

    setTiles(newTiles);
    setDraggedItem(null);
  };

  const checkWin = () => tiles.every((tile, index) => tile.id === initialTiles[index].id);

  const finishGame = () => {
    const finalScore = checkWin() ? 100 : 50;
    setScore(finalScore);

    const prevScores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const newScores = [...prevScores, { player: "Guest", score: finalScore }];
    localStorage.setItem("leaderboard", JSON.stringify(newScores));

    setGameOver(true);
  };

  const resetGame = () => {
    setTiles(shuffleArray(initialTiles));
    setDraggedItem(null);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        marginBottom: "20px", 
        color: "#FF6A88" 
      }}>
        <img src="/icons/game-icon.png" alt="Game" style={{ width: "35px", height: "35px", marginRight: "10px" }} />
        Puzzle Game
      </h1>
      <p style={{ 
        fontSize: "1.2rem", 
        marginBottom: "30px", 
        color: "#666",
        maxWidth: "700px",
        margin: "0 auto 30px"
      }}>
        Rearrange the puzzle pieces to recreate the original artwork. Drag and drop the pieces to solve the puzzle!
      </p>

      {!gameOver ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 180px))",
              gap: "20px",
              justifyContent: "center",
              marginBottom: "30px"
            }}
          >
            {tiles.map((tile) => (
              <div
                key={tile.id}
                draggable
                role="button"
                aria-grabbed="false"
                onDragStart={() => handleDragStart(tile)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(tile)}
                style={{
                  width: "180px",
                  height: "180px",
                  border: "3px dashed #FF6A88",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
                  fontSize: "1.5rem",
                  cursor: "grab",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
                }}
              >
                {tile.content}
              </div>
            ))}
          </div>

          {checkWin() && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
                color: "white",
                borderRadius: "15px",
                fontSize: "1.5rem",
                display: "inline-block",
                marginBottom: "30px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
              }}
            >
              🎉 Congratulations! You solved the puzzle!
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <button
              onClick={finishGame}
              aria-label="Finish Game and Save Score"
              style={{
                padding: "12px 30px",
                background: "#FF6A88",
                color: "white",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem",
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
              Finish Game
            </button>
            
            <button
              onClick={resetGame}
              aria-label="Reset Game"
              style={{
                padding: "12px 30px",
                background: "white",
                color: "#FF6A88",
                border: "2px solid #FF6A88",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
                e.target.style.background = "#FFF5F7";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                e.target.style.background = "white";
              }}
            >
              Reset Puzzle
            </button>
          </div>
        </>
      ) : (
        <div style={{
          background: "white",
          borderRadius: "15px",
          padding: "40px",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <h2 style={{ 
            color: "#FF6A88", 
            fontSize: "2rem",
            marginBottom: "20px"
          }}>
            <img src="/icons/trophy-icon.png" alt="Trophy" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
            Game Over!
          </h2>
          <p style={{ 
            fontSize: "1.5rem", 
            marginBottom: "30px" 
          }}>
            Final Score: <span style={{ fontWeight: "bold", color: "#FF6A88" }}>{score}</span>
          </p>
          <p style={{ 
            fontSize: "1.1rem", 
            marginBottom: "30px",
            color: "#666"
          }}>
            Your score has been saved to the leaderboard ✅
          </p>
          
          <button
            onClick={resetGame}
            style={{
              padding: "12px 40px",
              background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
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
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;