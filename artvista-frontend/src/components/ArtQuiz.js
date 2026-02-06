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
          {
            question: "Which artist painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correct: "Leonardo da Vinci"
          },
          {
            question: "What is the primary color in Piet Mondrian's abstract compositions?",
            options: ["Red", "Blue", "Yellow", "All of the above"],
            correct: "All of the above"
          },
          {
            question: "Which movement is Salvador Dalí associated with?",
            options: ["Cubism", "Surrealism", "Impressionism", "Expressionism"],
            correct: "Surrealism"
          },
          {
            question: "What technique did Georges Seurat use in his paintings?",
            options: ["Impasto", "Pointillism", "Glazing", "Scumbling"],
            correct: "Pointillism"
          },
          {
            question: "Which artist is known for 'The Persistence of Memory'?",
            options: ["René Magritte", "Salvador Dalí", "Max Ernst", "Joan Miró"],
            correct: "Salvador Dalí"
          }
        ];
      } else if (difficulty === "medium") {
        questionBank = [
          {
            question: "What year did Vincent van Gogh paint 'The Starry Night'?",
            options: ["1887", "1889", "1891", "1893"],
            correct: "1889"
          },
          {
            question: "Which art movement emerged in the 1960s focusing on everyday objects?",
            options: ["Pop Art", "Minimalism", "Conceptual Art", "Performance Art"],
            correct: "Pop Art"
          },
          {
            question: "Who created the sculpture 'The Thinker'?",
            options: ["Auguste Rodin", "Alberto Giacometti", "Henry Moore", "Barbara Hepworth"],
            correct: "Auguste Rodin"
          },
          {
            question: "What is the Japanese art of paper folding called?",
            options: ["Origami", "Kirigami", "Kusudama", "Tessellation"],
            correct: "Origami"
          },
          {
            question: "Which artist painted 'Girl with a Pearl Earring'?",
            options: ["Johannes Vermeer", "Rembrandt", "Frans Hals", "Jan Steen"],
            correct: "Johannes Vermeer"
          }
        ];
      } else {
        questionBank = [
          {
            question: "What is the name of the ancient Greek statue known as 'The Venus de Milo'?",
            options: ["Aphrodite of Knidos", "Aphrodite of Cnidus", "Venus de' Medici", "Venus Callipyge"],
            correct: "Aphrodite of Knidos"
          },
          {
            question: "Which Renaissance artist created the frescoes in the Sistine Chapel?",
            options: ["Donatello", "Michelangelo", "Raphael", "Leonardo da Vinci"],
            correct: "Michelangelo"
          },
          {
            question: "What art movement was pioneered by Jackson Pollock's drip paintings?",
            options: ["Abstract Expressionism", "Color Field Painting", "Lyrical Abstraction", "Action Painting"],
            correct: "Abstract Expressionism"
          },
          {
            question: "Which artist is associated with the concept of 'Readymades'?",
            options: ["Marcel Duchamp", "Man Ray", "Francis Picabia", "Kurt Schwitters"],
            correct: "Marcel Duchamp"
          },
          {
            question: "What is the name of the Japanese woodblock print technique?",
            options: ["Sumi-e", "Mokuhanga", "Kacho-ga", "Nihonga"],
            correct: "Mokuhanga"
          }
        ];
      }
      
      setQuestions(questionBank);
    };

    generateQuestions();
  }, [difficulty]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  }, []);

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
  };

  // Skip question
  const handleSkip = () => {
    moveToNextQuestion();
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

  if (showResult) {
    return (
      <div className="art-quiz-result">
        <h2>Quiz Complete!</h2>
        <p>Your Score: {score}/{questions.length * (difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40)}</p>
        <p>Difficulty: {difficulty}</p>
        <button onClick={handleRestart}>Play Again</button>
        {onComplete && (
          <button onClick={() => onComplete(score, questions.length, difficulty)}>
            Continue
          </button>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="art-quiz">
      <div className="quiz-header">
        <h2>Art Knowledge Quiz</h2>
        <div className="quiz-info">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
      </div>
      
      <div className="question-container">
        <h3>{currentQ.question}</h3>
        <div className="options">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className={`option ${selectedAnswer === option ? 'selected' : ''} ${
                selectedAnswer && (option === currentQ.correct ? 'correct' : 
                selectedAnswer === option ? 'incorrect' : '')
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="quiz-actions">
        {selectedAnswer && (
          <button onClick={moveToNextQuestion}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
        {!selectedAnswer && (
          <button onClick={handleSkip}>Skip Question</button>
        )}
      </div>
    </div>
  );
};

export default ArtQuiz;