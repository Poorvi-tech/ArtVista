import React, { useState, useEffect, useCallback } from "react";

const ArtQuiz = ({ difficulty = "easy", onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Art history questions for different difficulties
  const questionBank = {
    easy: [
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correct: "Leonardo da Vinci",
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1506."
      },
      {
        question: "Which artist is known for painting sunflowers?",
        options: ["Claude Monet", "Vincent van Gogh", "Salvador Dalí", "Henri Matisse"],
        correct: "Vincent van Gogh",
        explanation: "Van Gogh painted his famous series of sunflower paintings in 1888."
      },
      {
        question: "What is the art movement characterized by small dots of color?",
        options: ["Impressionism", "Cubism", "Pointillism", "Surrealism"],
        correct: "Pointillism",
        explanation: "Pointillism uses small dots of pure color that blend in the viewer's eye."
      },
      {
        question: "Which museum houses the Sistine Chapel ceiling?",
        options: ["Louvre Museum", "Metropolitan Museum", "Vatican Museums", "British Museum"],
        correct: "Vatican Museums",
        explanation: "Michelangelo painted the Sistine Chapel ceiling in Vatican City."
      },
      {
        question: "What does 'Renaissance' mean in French?",
        options: ["Rebirth", "Revolution", "Return", "Reformation"],
        correct: "Rebirth",
        explanation: "Renaissance literally means 'rebirth' referring to the revival of classical learning."
      }
    ],
    medium: [
      {
        question: "Who created the sculpture 'David'?",
        options: ["Donatello", "Michelangelo", "Bernini", "Rodin"],
        correct: "Michelangelo",
        explanation: "Michelangelo carved the iconic marble statue of David between 1501-1504."
      },
      {
        question: "Which art movement emerged in the 1920s focusing on dreams and subconscious?",
        options: ["Expressionism", "Futurism", "Surrealism", "Dadaism"],
        correct: "Surrealism",
        explanation: "Surrealism explored the unconscious mind and dream imagery, led by André Breton."
      },
      {
        question: "What technique did Georges Seurat use in his pointillist paintings?",
        options: ["Impasto", "Glazing", "Divisionism", "Chiaroscuro"],
        correct: "Divisionism",
        explanation: "Divisionism is the scientific application of color theory in pointillist technique."
      },
      {
        question: "Which Dutch artist painted 'Girl with a Pearl Earring'?",
        options: ["Rembrandt", "Vermeer", "Hals", "Ruisdael"],
        correct: "Vermeer",
        explanation: "Johannes Vermeer painted this masterpiece around 1665, known as the 'Mona Lisa of the North.'"
      },
      {
        question: "What is the primary characteristic of Baroque art?",
        options: ["Geometric simplicity", "Dramatic lighting", "Flat perspective", "Minimal color"],
        correct: "Dramatic lighting",
        explanation: "Baroque art emphasizes dramatic contrasts of light and shadow (chiaroscuro)."
      },
      {
        question: "Who founded the Bauhaus school of design?",
        options: ["Frank Lloyd Wright", "Le Corbusier", "Walter Gropius", "Mies van der Rohe"],
        correct: "Walter Gropius",
        explanation: "Walter Gropius established the Bauhaus in Weimar, Germany in 1919."
      }
    ],
    hard: [
      {
        question: "Which ancient civilization created the sculptural technique of contrapposto?",
        options: ["Egyptian", "Greek", "Roman", "Mesopotamian"],
        correct: "Greek",
        explanation: "Contrapposto was developed by Greek sculptors in the 5th century BCE, showing weight shift."
      },
      {
        question: "What art theoretical concept did Leonardo da Vinci describe in his notebooks?",
        options: ["Golden Ratio", "Rule of Thirds", "Sfumato", "Linear Perspective"],
        correct: "Sfumato",
        explanation: "Sfumato is Leonardo's technique of subtle gradations eliminating harsh outlines."
      },
      {
        question: "Which Pre-Raphaelite Brotherhood member painted 'Ophelia'?",
        options: ["Dante Gabriel Rossetti", "John Everett Millais", "Edward Burne-Jones", "William Holman Hunt"],
        correct: "John Everett Millais",
        explanation: "Millais painted 'Ophelia' (1851-1852) depicting Shakespeare's tragic character."
      },
      {
        question: "What printing technique did Albrecht Dürer master during the Northern Renaissance?",
        options: ["Lithography", "Etching", "Woodcut", "Engraving"],
        correct: "Engraving",
        explanation: "Dürer perfected copperplate engraving, creating detailed prints like 'Melencolia I.'"
      },
      {
        question: "Which contemporary artist is known for his 'Balloon Dog' sculptures?",
        options: ["Jeff Koons", "Damien Hirst", "Ai Weiwei", "Yayoi Kusama"],
        correct: "Jeff Koons",
        explanation: "Jeff Koons created his iconic mirror-polished balloon animal sculptures in the 1990s."
      },
      {
        question: "What architectural principle did Vitruvius codify in 'De Architectura'?",
        options: ["Flying buttresses", "Classical orders", "Gothic tracery", "Doric entasis"],
        correct: "Classical orders",
        explanation: "Vitruvius described the three classical orders: Doric, Ionic, and Corinthian."
      }
    ]
  };

  // Initialize game
  const initializeGame = () => {
    const bank = questionBank[difficulty];
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5); // 5 questions per game
    
    setQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer("");
    setShowResult(false);
    setGameStarted(true);
    setTimeLeft(30);
    setTimerActive(true);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult, handleTimeUp]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  }, [moveToNextQuestion]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswer(answer);
    
    if (answer === questions[currentQuestion].correct) {
      setScore(prev => prev + (difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40));
    }
  };

  // Move to next question
  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  };

  // Skip question
  const skipQuestion = () => {
    moveToNextQuestion();
  };

  // Calculate final score
  const calculateFinalScore = () => {
    const baseScore = score;
    const timeBonus = timeLeft > 0 ? timeLeft * 2 : 0;
    return baseScore + timeBonus;
  };



  if (!gameStarted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#FF6A88", marginBottom: "20px" }}>
          Art History Quiz - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h2>
        <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
          Test your knowledge of art history! Answer questions about famous artists, movements, and masterpieces.
        </p>
        <div style={{ marginBottom: "25px", fontSize: "1rem", color: "#666" }}>
          <p><strong>Rules:</strong></p>
          <p>• 5 questions per game</p>
          <p>• 30 seconds per question</p>
          <p>• Points vary by difficulty level</p>
        </div>
        <button
          onClick={initializeGame}
          style={{
            background: "#FF6A88",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    const finalScore = calculateFinalScore();
    return (
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center",
        zIndex: 1000,
        border: "2px solid #FF6A88",
        maxWidth: "500px",
        width: "90%"
      }}>
        <h3 style={{ color: "#FF6A88", marginBottom: "20px" }}>🏆 Quiz Completed! 🏆</h3>
        <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
          You finished the {difficulty} level quiz!
        </p>
        <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          <strong>Final Score:</strong> {finalScore} points
        </p>
        <p style={{ marginBottom: "25px" }}>
          Correct Answers: {score / (difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40)} / {questions.length}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#FF6A88",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginRight: "15px"
          }}
        >
          Play Again
        </button>
        {onComplete && (
          <button
            onClick={() => onComplete(finalScore)}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}
          >
            Save Score
          </button>
        )}
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#FF6A88", textAlign: "center", marginBottom: "20px" }}>
        Art History Quiz - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </h2>
      
      {/* Progress and Stats */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Question:</strong> {currentQuestion + 1}/{questions.length}
        </div>
        <div style={{ 
          background: "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: "1px solid #FFE5EC"
        }}>
          <strong>Score:</strong> {score}
        </div>
        <div style={{ 
          background: timeLeft < 10 ? "#FFEBEE" : "white",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          border: `1px solid ${timeLeft < 10 ? "#F44336" : "#FFE5EC"}`,
          color: timeLeft < 10 ? "#C62828" : "inherit"
        }}>
          <strong>Time:</strong> {timeLeft}s
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
        border: "1px solid #FFE5EC",
        marginBottom: "25px"
      }}>
        <h3 style={{ 
          color: "#333", 
          fontSize: "1.4rem", 
          marginBottom: "25px",
          lineHeight: "1.4"
        }}>
          {currentQ.question}
        </h3>
        
        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              style={{
                padding: "15px 20px",
                background: selectedAnswer 
                  ? option === currentQ.correct 
                    ? "#E8F5E8" 
                    : option === selectedAnswer && option !== currentQ.correct 
                      ? "#FFEBEE" 
                      : "#f5f5f5"
                  : "#FFF5F7",
                color: selectedAnswer 
                  ? option === currentQ.correct 
                    ? "#2E7D32" 
                    : option === selectedAnswer && option !== currentQ.correct 
                      ? "#C62828" 
                      : "#666"
                  : "#FF6A88",
                border: selectedAnswer 
                  ? option === currentQ.correct 
                    ? "2px solid #4CAF50" 
                    : option === selectedAnswer && option !== currentQ.correct 
                      ? "2px solid #F44336" 
                      : "1px solid #ddd"
                  : "2px solid #FF6A88",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: selectedAnswer && option === currentQ.correct ? "bold" : "normal",
                cursor: selectedAnswer ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.3s"
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation and Navigation */}
      {selectedAnswer && (
        <div style={{
          background: "#E3F2FD",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "25px",
          border: "1px solid #2196F3"
        }}>
          <p style={{ 
            color: "#1565C0", 
            fontSize: "1.1rem", 
            marginBottom: "10px",
            fontWeight: "bold"
          }}>
            {selectedAnswer === currentQ.correct ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          <p style={{ color: "#333", lineHeight: "1.5" }}>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px",
        flexWrap: "wrap"
      }}>
        {selectedAnswer && currentQuestion < questions.length - 1 && (
          <button
            onClick={moveToNextQuestion}
            style={{
              background: "#FF6A88",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            Next Question
          </button>
        )}
        
        {!selectedAnswer && (
          <button
            onClick={skipQuestion}
            style={{
              background: "#9E9E9E",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtQuiz;