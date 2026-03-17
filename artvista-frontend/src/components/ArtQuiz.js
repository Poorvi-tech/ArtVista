import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGameProgress } from "../games/progress/useGameProgress";
import LevelPicker from "../games/ui/LevelPicker";

const ArtQuiz = ({ difficulty = "easy", onComplete }) => {
  const mode = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";
  const TOTAL_LEVELS = 10;
  const QUESTIONS_PER_LEVEL = 5;
  const progress = useGameProgress({ gameId: "art-quiz", difficulty: mode, totalLevels: TOTAL_LEVELS });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [levelScore, setLevelScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate questions based on difficulty
  useEffect(() => {
    if (!gameStarted) return;
    let bank = [];

    if (mode === "easy") {
      bank = [
        { question: "Which artist painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: "Leonardo da Vinci" },
        { question: "Which movement is Salvador Dalí associated with?", options: ["Cubism", "Surrealism", "Impressionism", "Expressionism"], correct: "Surrealism" },
        { question: "What technique did Georges Seurat use in his paintings?", options: ["Impasto", "Pointillism", "Glazing", "Scumbling"], correct: "Pointillism" },
        { question: "Which artist is known for 'The Persistence of Memory'?", options: ["René Magritte", "Salvador Dalí", "Max Ernst", "Joan Miró"], correct: "Salvador Dalí" },
        { question: "Which artist painted 'The Starry Night'?", options: ["Claude Monet", "Vincent van Gogh", "Edvard Munch", "Paul Cézanne"], correct: "Vincent van Gogh" },
        { question: "What is sculpture typically made by doing?", options: ["Carving or modeling", "Printing books", "Mixing paints", "Writing poems"], correct: "Carving or modeling" },
        { question: "Which is a primary color in traditional painting?", options: ["Red", "Green", "Purple", "Pink"], correct: "Red" },
        { question: "Which art term means a painting of inanimate objects?", options: ["Still life", "Portrait", "Landscape", "Abstract"], correct: "Still life" },
        { question: "Who painted the ceiling of the Sistine Chapel?", options: ["Raphael", "Michelangelo", "Donatello", "Caravaggio"], correct: "Michelangelo" },
        { question: "What is a portrait?", options: ["A picture of a person", "A picture of a mountain", "A picture of a fruit bowl", "A picture made only of shapes"], correct: "A picture of a person" },
        { question: "Which movement is Claude Monet associated with?", options: ["Impressionism", "Cubism", "Surrealism", "Baroque"], correct: "Impressionism" },
        { question: "Which tool is commonly used for drawing?", options: ["Pencil", "Hammer", "Spoon", "Wrench"], correct: "Pencil" },
        { question: "What does 'museum' most commonly contain?", options: ["Art and artifacts", "Cars for sale", "Sports equipment", "Medical supplies"], correct: "Art and artifacts" },
        { question: "Which is a famous statue in Paris?", options: ["Venus de Milo", "David", "The Thinker", "All of the above"], correct: "All of the above" },
        { question: "Which of these is an art movement?", options: ["Impressionism", "Metabolism", "Magnetism", "Mechanism"], correct: "Impressionism" },
      ];
    } else if (mode === "medium") {
      bank = [
        { question: "What year did Vincent van Gogh paint 'The Starry Night'?", options: ["1887", "1889", "1891", "1893"], correct: "1889" },
        { question: "Which art movement emerged in the 1960s focusing on everyday objects?", options: ["Pop Art", "Minimalism", "Conceptual Art", "Performance Art"], correct: "Pop Art" },
        { question: "Who created the sculpture 'The Thinker'?", options: ["Auguste Rodin", "Alberto Giacometti", "Henry Moore", "Barbara Hepworth"], correct: "Auguste Rodin" },
        { question: "What is the Japanese art of paper folding called?", options: ["Origami", "Kirigami", "Kusudama", "Tessellation"], correct: "Origami" },
        { question: "Which artist painted 'Girl with a Pearl Earring'?", options: ["Johannes Vermeer", "Rembrandt", "Frans Hals", "Jan Steen"], correct: "Johannes Vermeer" },
        { question: "Which Renaissance technique creates depth with a vanishing point?", options: ["Linear perspective", "Pointillism", "Frottage", "Collage"], correct: "Linear perspective" },
        { question: "Which painter is strongly linked to Cubism?", options: ["Pablo Picasso", "Claude Monet", "Sandro Botticelli", "J.M.W. Turner"], correct: "Pablo Picasso" },
        { question: "What is 'chiaroscuro'?", options: ["Strong contrast of light and dark", "Painting with dots", "Carving stone", "Mixing pigments with wax"], correct: "Strong contrast of light and dark" },
        { question: "What is a diptych?", options: ["Two-panel artwork", "Circular painting", "Stone carving", "Woven textile"], correct: "Two-panel artwork" },
        { question: "Which style is associated with Andy Warhol?", options: ["Pop Art", "Romanticism", "Rococo", "Futurism"], correct: "Pop Art" },
        { question: "What is a fresco?", options: ["Painting on wet plaster", "Painting on glass", "Ink drawing", "Clay sculpture"], correct: "Painting on wet plaster" },
        { question: "Which artist painted 'The Kiss' (1907–08)?", options: ["Gustav Klimt", "Edgar Degas", "Paul Gauguin", "Edouard Manet"], correct: "Gustav Klimt" },
        { question: "What is a triptych?", options: ["Three-panel artwork", "Three-color palette", "Three brushes", "Three sculptures"], correct: "Three-panel artwork" },
        { question: "Which is a printmaking technique?", options: ["Etching", "Weaving", "Casting", "Mosaicing"], correct: "Etching" },
        { question: "Which period is characterized by dramatic light and motion?", options: ["Baroque", "Neoclassicism", "Minimalism", "Postmodernism"], correct: "Baroque" },
      ];
    } else {
      bank = [
        { question: "Which Renaissance artist created the frescoes in the Sistine Chapel?", options: ["Donatello", "Michelangelo", "Raphael", "Leonardo da Vinci"], correct: "Michelangelo" },
        { question: "What art movement was pioneered by Jackson Pollock's drip paintings?", options: ["Abstract Expressionism", "Color Field Painting", "Lyrical Abstraction", "Action Painting"], correct: "Action Painting" },
        { question: "Which artist is associated with the concept of 'Readymades'?", options: ["Marcel Duchamp", "Man Ray", "Francis Picabia", "Kurt Schwitters"], correct: "Marcel Duchamp" },
        { question: "What is the name of the Japanese woodblock print technique?", options: ["Sumi-e", "Mokuhanga", "Kacho-ga", "Nihonga"], correct: "Mokuhanga" },
        { question: "Who wrote 'The Story of Art' (a major art history book)?", options: ["E.H. Gombrich", "Vasari", "John Berger", "Walter Benjamin"], correct: "E.H. Gombrich" },
        { question: "What is 'sfumato' best associated with?", options: ["Soft transitions, smoky edges", "Carving marble", "Dramatic shadows", "Bright flat color"], correct: "Soft transitions, smoky edges" },
        { question: "Which architect designed the Guggenheim Museum Bilbao?", options: ["Frank Gehry", "Zaha Hadid", "Le Corbusier", "Mies van der Rohe"], correct: "Frank Gehry" },
        { question: "Which term describes a painting made of tiny pieces of colored stone or glass?", options: ["Mosaic", "Fresco", "Tempera", "Gouache"], correct: "Mosaic" },
        { question: "Which period comes first?", options: ["Romanesque", "Baroque", "Impressionism", "Surrealism"], correct: "Romanesque" },
        { question: "Which movement includes Kazimir Malevich?", options: ["Suprematism", "Fauvism", "Dada", "Art Nouveau"], correct: "Suprematism" },
        { question: "What is 'iconography' in art history?", options: ["Study of symbols and meaning", "Study of paint chemistry", "Study of museum lighting", "Study of perspective geometry"], correct: "Study of symbols and meaning" },
        { question: "Who painted 'Las Meninas'?", options: ["Diego Velázquez", "Francisco Goya", "El Greco", "Titian"], correct: "Diego Velázquez" },
        { question: "Which artist is strongly linked to 'Guernica'?", options: ["Pablo Picasso", "Paul Klee", "Joan Miró", "Wassily Kandinsky"], correct: "Pablo Picasso" },
        { question: "Which term refers to the layering of paint to create depth?", options: ["Glazing", "Impasto", "Frottage", "Assemblage"], correct: "Glazing" },
        { question: "Which movement is associated with Tristan Tzara?", options: ["Dada", "Realism", "Symbolism", "Constructivism"], correct: "Dada" },
      ];
    }

    const start = ((progress.level - 1) * QUESTIONS_PER_LEVEL) % bank.length;
    const levelQuestions = [];
    for (let i = 0; i < QUESTIONS_PER_LEVEL; i += 1) {
      levelQuestions.push(bank[(start + i) % bank.length]);
    }

    setQuestions(levelQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setLevelScore(0);
    setCorrectCount(0);

    const baseTime = mode === "hard" ? 18 : mode === "medium" ? 22 : 26;
    const time = Math.max(10, baseTime - (progress.level - 1));
    setTimeLeft(time);
    setTimerActive(true);
  }, [mode, gameStarted, progress.level]);

  // Move to next question
  const questionTime = useMemo(() => {
    const baseTime = mode === "hard" ? 18 : mode === "medium" ? 22 : 26;
    return Math.max(10, baseTime - (progress.level - 1));
  }, [mode, progress.level]);

  // Handle time up
  const moveToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer("");
      setTimeLeft(questionTime);
      setTimerActive(true);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  }, [currentQuestion, questions.length, questionTime]);

  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 900);
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
    
    const correct = answer === questions[currentQuestion].correct;
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setLevelScore(prev => prev + (mode === "easy" ? 20 : mode === "medium" ? 30 : 40));
    }
    setTimerActive(false);
  };

  // Restart quiz
  const handleRestartLevel = () => {
    setShowResult(false);
    setSelectedAnswer("");
    setCurrentQuestion(0);
    setLevelScore(0);
    setCorrectCount(0);
    setTimeLeft(questionTime);
    setTimerActive(true);
  };

  if (!gameStarted) {
    return (
      <div style={{ padding: 20 }}>
        <div className="gameCard gameCardPad" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <p style={{ margin: "0 0 14px", color: "rgba(15, 23, 42, 0.72)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Answer fast, score points, and unlock <strong>10 levels</strong>.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="gameBtn gameBtnPrimary"
              onClick={() => {
                setTotalScore(0);
                progress.setLevelNumber(1);
                setGameStarted(true);
              }}
            >
              Start 10-Level Quiz
            </button>
            <button
              className="gameBtn"
              onClick={() => {
                progress.resetProgress();
                setTotalScore(0);
                setGameStarted(false);
              }}
            >
              Reset Progress
            </button>
          </div>
          <div style={{ marginTop: 12, color: "rgba(15, 23, 42, 0.55)", fontSize: "0.95rem" }}>
            Unlocked: <strong>{progress.completedCount}</strong> / {TOTAL_LEVELS} · Best: <strong>{progress.bestScore}</strong>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: "center", padding: "50px", fontSize: "1.5rem", color: "#666" }}>Loading gallery of questions...</div>;
  }

  // Calculate UI colors and widths
  const pointsPerCorrect = mode === "easy" ? 20 : mode === "medium" ? 30 : 40;
  const maxScore = QUESTIONS_PER_LEVEL * pointsPerCorrect;
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
  const timerColor = timeLeft > 10 ? "#4CAF50" : timeLeft > 5 ? "#FF9800" : "#F44336";
  const passMinCorrect = Math.ceil(QUESTIONS_PER_LEVEL * 0.6);
  const passedLevel = correctCount >= passMinCorrect;

  if (showResult) {
    return (
      <div style={{
        maxWidth: "600px", margin: "0 auto", padding: "40px",
        background: "white", borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        textAlign: "center", borderTop: "8px solid #FF6A88"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "10px" }}>{passedLevel ? "🏆" : "📝"}</div>
        <h2 style={{ color: "#333", fontSize: "2.2rem", marginBottom: "10px" }}>
          {passedLevel ? "Level Passed!" : "Try Again"}
        </h2>
        
        <div style={{ margin: "30px 0", padding: "30px", background: "#FFF5F7", borderRadius: "15px" }}>
          <p style={{ color: "#666", fontSize: "1.2rem", margin: 0 }}>
            Level {progress.level} · {correctCount}/{QUESTIONS_PER_LEVEL} correct
          </p>
          <div style={{ color: "#FF6A88", fontSize: "4rem", fontWeight: "900", lineHeight: "1" }}>
            {levelScore}<span style={{ fontSize: "1.5rem", color: "#999" }}>/{maxScore}</span>
          </div>
          <div style={{ marginTop: 10, color: "#666", fontWeight: 700 }}>
            Pass requirement: at least {passMinCorrect} correct
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "30px" }}>
          <button 
            onClick={handleRestartLevel}
            style={{
              padding: "14px 28px", borderRadius: "30px", border: "2px solid #FF6A88",
              background: "white", color: "#FF6A88", fontSize: "1.1rem", fontWeight: "bold",
              cursor: "pointer", transition: "all 0.3s ease"
            }}
            onMouseEnter={e => { e.target.style.background = "#FFF5F7"; }}
            onMouseLeave={e => { e.target.style.background = "white"; }}
          >
            Retry Level
          </button>
          
          {passedLevel ? (
            <button 
              onClick={() => {
                const submittedLevel = progress.level;
                const newTotal = totalScore + levelScore;
                setTotalScore(newTotal);
                progress.markLevelComplete({ levelNumber: submittedLevel, score: newTotal });

                if (submittedLevel === TOTAL_LEVELS) {
                  if (onComplete) onComplete(newTotal, TOTAL_LEVELS, mode);
                  return;
                }

                setShowResult(false);
                setSelectedAnswer("");
                setCurrentQuestion(0);
                setLevelScore(0);
                setCorrectCount(0);
                setTimeLeft(questionTime);
                setTimerActive(true);
              }}
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
              {progress.level === TOTAL_LEVELS ? "Finish" : "Next Level"}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <LevelPicker
          progress={progress}
          totalLevels={TOTAL_LEVELS}
          onSelectLevel={(n) => {
            setShowResult(false);
            setSelectedAnswer("");
            setCurrentQuestion(0);
            setLevelScore(0);
            setCorrectCount(0);
            setTimeLeft(questionTime);
            setTimerActive(true);
            progress.setLevelNumber(n);
          }}
        />

        <div style={{
          padding: "30px",
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
          Level {progress.level}/{TOTAL_LEVELS} <span style={{ color: "#ccc", margin: "0 5px" }}>|</span> Q{currentQuestion + 1}/{questions.length}
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
            ⭐ {levelScore}
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
      </div>
    </div>
  );
};

export default ArtQuiz;