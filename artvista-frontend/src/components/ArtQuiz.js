import React, { useState, useEffect, useCallback } from "react";

const ArtQuiz = ({ difficulty = "easy", onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Generate questions based on difficulty
  useEffect(() => {
    const generateQuestions = () => {
      let questionBank = [];
      
      if (difficulty === "easy") {
        questionBank = [
          { question: "Which artist painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: "Leonardo da Vinci" },
          { question: "What is the primary color in Piet Mondrian's abstract compositions?", options: ["Red", "Blue", "Yellow", "All of the above"], correct: "All of the above" },
          { question: "Which movement is Salvador Dalí associated with?", options: ["Cubism", "Surrealism", "Impressionism", "Expressionism"], correct: "Surrealism" },
          { question: "What technique did Georges Seurat use in his paintings?", options: ["Impasto", "Pointillism", "Glazing", "Scumbling"], correct: "Pointillism" },
          { question: "Which artist is known for 'The Persistence of Memory'?", options: ["René Magritte", "Salvador Dalí", "Max Ernst", "Joan Miró"], correct: "Salvador Dalí" }
        ];
      } else if (difficulty === "medium") {
        questionBank = [
          { question: "What year did Vincent van Gogh paint 'The Starry Night'?", options: ["1887", "1889", "1891", "1893"], correct: "1889" },
          { question: "Which art movement emerged in the 1960s focusing on everyday objects?", options: ["Pop Art", "Minimalism", "Conceptual Art", "Performance Art"], correct: "Pop Art" },
          { question: "Who created the sculpture 'The Thinker'?", options: ["Auguste Rodin", "Alberto Giacometti", "Henry Moore", "Barbara Hepworth"], correct: "Auguste Rodin" },
          { question: "What is the Japanese art of paper folding called?", options: ["Origami", "Kirigami", "Kusudama", "Tessellation"], correct: "Origami" },
          { question: "Which artist painted 'Girl with a Pearl Earring'?", options: ["Johannes Vermeer", "Rembrandt", "Frans Hals", "Jan Steen"], correct: "Johannes Vermeer" }
        ];
      } else {
        questionBank = [
          { question: "What is the name of the ancient Greek statue known as 'The Venus de Milo'?", options: ["Aphrodite of Knidos", "Aphrodite of Cnidus", "Venus de' Medici", "Venus Callipyge"], correct: "Aphrodite of Knidos" },
          { question: "Which Renaissance artist created the frescoes in the Sistine Chapel?", options: ["Donatello", "Michelangelo", "Raphael", "Leonardo da Vinci"], correct: "Michelangelo" },
          { question: "What art movement was pioneered by Jackson Pollock's drip paintings?", options: ["Abstract Expressionism", "Color Field Painting", "Lyrical Abstraction", "Action Painting"], correct: "Abstract Expressionism" },
          { question: "Which artist is associated with the concept of 'Readymades'?", options: ["Marcel Duchamp", "Man Ray", "Francis Picabia", "Kurt Schwitters"], correct: "Marcel Duchamp" },
          { question: "What is the name of the Japanese woodblock print technique?", options: ["Sumi-e", "Mokuhanga", "Kacho-ga", "Nihonga"], correct: "Mokuhanga" }
        ];
      }
      
      setQuestions(questionBank);
      setTimeLeft(30);
      setTimerActive(true);
    };

    generateQuestions();
  }, [difficulty]);

  // Move to next question
  const moveToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  }, [currentQuestion, questions.length]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  }, [moveToNextQuestion]);

  // Effect for timer
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
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

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswer(answer);
    
    if (answer === questions[currentQuestion].correct) {
      setScore(prev => prev + (difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40));
    }
    setTimerActive(false);
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  if (questions.length === 0) {
    return <div style={{ textAlign: "center", padding: "50px", fontSize: "1.5rem", color: "#666" }}>Loading gallery of questions...</div>;
  }

  // Calculate UI colors and widths
  const maxScore = questions.length * (difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40);
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
  const timePercent = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 10 ? "#4CAF50" : timeLeft > 5 ? "#FF9800" : "#F44336";

  if (showResult) {
    return (
      <div style={{
        maxWidth: "600px", margin: "0 auto", padding: "40px",
        background: "white", borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        textAlign: "center", borderTop: "8px solid #FF6A88"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "10px" }}>🏆</div>
        <h2 style={{ color: "#333", fontSize: "2.5rem", marginBottom: "10px" }}>Quiz Complete!</h2>
        
        <div style={{ margin: "30px 0", padding: "30px", background: "#FFF5F7", borderRadius: "15px" }}>
          <p style={{ color: "#666", fontSize: "1.2rem", margin: 0 }}>Final Score</p>
          <div style={{ color: "#FF6A88", fontSize: "4rem", fontWeight: "900", lineHeight: "1" }}>
            {score}<span style={{ fontSize: "1.5rem", color: "#999" }}>/{maxScore}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "30px" }}>
          <button 
            onClick={handleRestart}
            style={{
              padding: "14px 28px", borderRadius: "30px", border: "2px solid #FF6A88",
              background: "white", color: "#FF6A88", fontSize: "1.1rem", fontWeight: "bold",
              cursor: "pointer", transition: "all 0.3s ease"
            }}
            onMouseEnter={e => { e.target.style.background = "#FFF5F7"; }}
            onMouseLeave={e => { e.target.style.background = "white"; }}
          >
            Play Again
          </button>
          
          {onComplete && (
            <button 
              onClick={() => onComplete(score, questions.length, difficulty)}
              style={{
                padding: "14px 35px", borderRadius: "30px", border: "none",
                background: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)",
                color: "white", fontSize: "1.1rem", fontWeight: "bold",
                cursor: "pointer", boxShadow: "0 8px 15px rgba(255, 106, 136, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
            >
              Continue to Hub
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{
      maxWidth: "800px", margin: "0 auto", padding: "30px",
      background: "white", borderRadius: "20px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      position: "relative", overflow: "hidden"
    }}>
      {/* Top Progress Bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8px", background: "#eee" }}>
        <div style={{ 
          height: "100%", width: `${progressPercent}%`, 
          background: "linear-gradient(90deg, #FF9A8B, #FF6A88)",
          transition: "width 0.4s ease-out" 
        }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", marginTop: "10px" }}>
        <div style={{ background: "#F5F7FA", padding: "8px 16px", borderRadius: "20px", color: "#555", fontWeight: "bold", fontSize: "0.95rem" }}>
          Question {currentQuestion + 1} <span style={{ color: "#ccc", margin: "0 5px" }}>|</span> {questions.length}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            fontSize: "1.2rem", fontWeight: "bold", color: timerColor,
            background: `${timerColor}15`, padding: "8px 16px", borderRadius: "20px",
            minWidth: "80px", textAlign: "center",
            boxShadow: timeLeft <= 5 && timerActive ? `0 0 10px ${timerColor}80` : "none",
            animation: timeLeft <= 5 && timerActive ? "pulse 1s infinite" : "none"
          }}>
            ⏱️ {timeLeft}s
          </div>
          <div style={{ background: "#FFF5F7", color: "#FF6A88", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold" }}>
            ⭐ {score}
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <h3 style={{ fontSize: "1.8rem", color: "#2d3748", lineHeight: "1.4", margin: 0 }}>
          {currentQ.question}
        </h3>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {currentQ.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQ.correct;
          const showAsCorrect = selectedAnswer && isCorrect;
          const showAsWrong = isSelected && !isCorrect;
          
          let bgColor = "white";
          let borderColor = "#E2E8F0";
          let textColor = "#4A5568";
          
          if (showAsCorrect) {
            bgColor = "#F0FFF4";
            borderColor = "#48BB78";
            textColor = "#276749";
          } else if (showAsWrong) {
            bgColor = "#FFF5F5";
            borderColor = "#F56565";
            textColor = "#9B2C2C";
          } else if (selectedAnswer) {
            // Disabled state for other answers
            bgColor = "#F7FAFC";
            textColor = "#A0AEC0";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              style={{
                width: "100%", padding: "18px 25px",
                background: bgColor, border: `2px solid ${borderColor}`,
                borderRadius: "12px", color: textColor,
                fontSize: "1.1rem", fontWeight: "600",
                textAlign: "left", cursor: selectedAnswer ? "default" : "pointer",
                transition: "all 0.2s ease",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: (isSelected && !showAsWrong && !showAsCorrect) ? "0 4px 6px rgba(0,0,0,0.05)" : "none",
                transform: (isSelected && !selectedAnswer) ? "translateY(-2px)" : "none"
              }}
              onMouseEnter={e => {
                if (!selectedAnswer) {
                  e.currentTarget.style.borderColor = "#CBD5E0";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                }
              }}
              onMouseLeave={e => {
                if (!selectedAnswer) {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <span>
                <span style={{ 
                  display: "inline-block", width: "30px", height: "30px", 
                  lineHeight: "30px", textAlign: "center", background: "#EDF2F7", 
                  borderRadius: "50%", marginRight: "15px", color: "#718096", fontSize: "0.9rem"
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
              
              {showAsCorrect && <span style={{ fontSize: "1.5rem" }}>✅</span>}
              {showAsWrong && <span style={{ fontSize: "1.5rem" }}>❌</span>}
            </button>
          );
        })}
      </div>
      
      <div style={{ marginTop: "35px", display: "flex", justifyContent: "center", minHeight: "50px" }}>
        {selectedAnswer ? (
          <button 
            onClick={moveToNextQuestion}
            style={{
              padding: "14px 40px", borderRadius: "30px", border: "none",
              background: "#4A5568", color: "white", fontSize: "1.1rem", fontWeight: "bold",
              cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.target.style.background = "#2D3748"}
            onMouseLeave={e => e.target.style.background = "#4A5568"}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question ➔' : 'See Results ➔'}
          </button>
        ) : (
          <button 
            onClick={() => {
              setTimerActive(false);
              moveToNextQuestion();
            }}
            style={{
              padding: "10px 25px", borderRadius: "30px", border: "none",
              background: "transparent", color: "#A0AEC0", fontSize: "1rem", fontWeight: "600",
              cursor: "pointer", textDecoration: "underline"
            }}
            onMouseEnter={e => e.target.style.color = "#718096"}
            onMouseLeave={e => e.target.style.color = "#A0AEC0"}
          >
            Skip Question
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default ArtQuiz;