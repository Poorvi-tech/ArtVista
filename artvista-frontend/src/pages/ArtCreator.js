import React, { useState, useEffect, useRef, useCallback } from "react";

const ArtCreator = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState("brush");
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [gridEnabled, setGridEnabled] = useState(false);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    const newHistory = canvasHistory.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setCanvasHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [canvasRef, canvasHistory, historyStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveCanvasState();
  }, [canvasSize, saveCanvasState]);

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasHistory[historyStep - 1];
      setHistoryStep(historyStep - 1);
    }
  };

  const redo = () => {
    if (historyStep < canvasHistory.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasHistory[historyStep + 1];
      setHistoryStep(historyStep + 1);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch (tool) {
      case 'brush':
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
        
      case 'eraser':
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
      default:
        // Default case for unknown tools
        break;
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    setIsDrawing(false);
    saveCanvasState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  const saveArtwork = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `my-artwork-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const redrawCanvas = () => {
    if (historyStep >= 0 && canvasHistory[historyStep]) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasHistory[historyStep];
    }
  };

  const toggleGrid = () => {
    setGridEnabled(!gridEnabled);
    drawGrid();
  };

  const drawGrid = () => {
    if (!gridEnabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  return (
    <div style={{ 
      padding: "30px", 
      maxWidth: "1400px", 
      margin: "0 auto",
      background: "linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)",
      minHeight: "100vh"
    }}>
      <h1 style={{ 
        color: "#FF6A88", 
        textAlign: "center",
        marginBottom: "25px",
        fontSize: "2.8rem",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        🎨 Advanced Art Creator Studio
      </h1>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        gap: "25px"
      }}>
        {/* Advanced Toolbar */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          border: "2px solid #FFD1D9",
          width: "100%",
          maxWidth: "1200px",
          backdropFilter: "blur(15px)"
        }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px"
          }}>
            {/* Color and Brush Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
              <label style={{ 
                fontWeight: "bold", 
                color: "#FF6A88",
                fontSize: "1.1rem"
              }}>🎨 Color:</label>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  border: "2px solid #FF6A88",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ 
                  fontWeight: "bold", 
                  color: "#FF6A88",
                  fontSize: "1.1rem"
                }}>Brush:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={strokeWidth} 
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  style={{ 
                    width: "100px",
                    accentColor: "#FF6A88"
                  }}
                />
                <span style={{ 
                  fontWeight: "bold",
                  background: "#FF6A88",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "15px",
                  minWidth: "40px",
                  textAlign: "center",
                  fontSize: "0.9rem"
                }}>{strokeWidth}px</span>
              </div>
            </div>
            
            {/* Tool Selection */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <label style={{ 
                fontWeight: "bold", 
                color: "#FF6A88",
                fontSize: "1.1rem"
              }}>Tools:</label>
              {[
                { id: 'brush', label: 'Brush', icon: '🖌️' },
                { id: 'eraser', label: 'Eraser', icon: '🧽' },
                { id: 'text', label: 'Text', icon: '🔤' },
                { id: 'shape', label: 'Shape', icon: '🔷' }
              ].map(toolItem => (
                <button 
                  key={toolItem.id}
                  onClick={() => setTool(toolItem.id)}
                  style={{
                    background: tool === toolItem.id ? "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)" : "#f0f0f0",
                    color: tool === toolItem.id ? "white" : "#333",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: tool === toolItem.id ? "0 4px 15px rgba(255, 106, 136, 0.4)" : "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                  onMouseEnter={e => {
                    if (tool !== toolItem.id) {
                      e.target.style.background = "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 15px rgba(255, 106, 136, 0.4)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (tool !== toolItem.id) {
                      e.target.style.background = "#f0f0f0";
                      e.target.style.color = "#333";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  <span>{toolItem.icon}</span>
                  <span>{toolItem.label}</span>
                </button>
              ))}
            </div>
            
            {/* Shape Controls */}
            {tool === 'shape' && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <label style={{ 
                  fontWeight: "bold", 
                  color: "#FF6A88",
                  fontSize: "1.1rem"
                }}>Shape:</label>
                {[
                  { id: 'rectangle', label: '⬜' },
                  { id: 'circle', label: '⭕' },
                  { id: 'triangle', label: '🔺' },
                  { id: 'line', label: '📏' }
                ].map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape.id)}
                    style={{
                      background: selectedShape === shape.id ? "#FF6A88" : "#f0f0f0",
                      color: selectedShape === shape.id ? "white" : "#333",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.2rem"
                    }}
                  >
                    {shape.label}
                  </button>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label>Fill:</label>
                  <input 
                    type="color" 
                    value={fillColor} 
                    onChange={(e) => setFillColor(e.target.value)}
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label>Stroke:</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={strokeWidth} 
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    style={{ width: "80px" }}
                  />
                  <span>{strokeWidth}px</span>
                </div>
              </div>
            )}
            
            {/* Text Controls */}
            {tool === 'text' && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text to add"
                  style={{
                    padding: "10px 15px",
                    borderRadius: "20px",
                    border: "2px solid #FF6A88",
                    outline: "none",
                    fontSize: "1rem",
                    width: "200px"
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label>Font Size:</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="72" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={{ width: "100px" }}
                  />
                  <span>{fontSize}px</span>
                </div>
                <button
                  onClick={() => setIsAddingText(true)}
                  style={{
                    background: "#FF6A88",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Add Text
                </button>
              </div>
            )}
          </div>
          
          {/* Action Buttons Row */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "15px", 
            flexWrap: "wrap",
            borderTop: "1px solid #FFE5EC",
            paddingTop: "20px"
          }}>
            <button 
              onClick={undo}
              disabled={historyStep <= 0}
              style={{
                background: historyStep <= 0 ? "#cccccc" : "linear-gradient(135deg, #8CA9FF 0%, #AD8CFF 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: historyStep <= 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(140, 169, 255, 0.4)",
                transition: "all 0.3s ease",
                opacity: historyStep <= 0 ? 0.6 : 1
              }}
            >
              ↶ Undo
            </button>
            <button 
              onClick={redo}
              disabled={historyStep >= canvasHistory.length - 1}
              style={{
                background: historyStep >= canvasHistory.length - 1 ? "#cccccc" : "linear-gradient(135deg, #8CA9FF 0%, #AD8CFF 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: historyStep >= canvasHistory.length - 1 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(140, 169, 255, 0.4)",
                transition: "all 0.3s ease",
                opacity: historyStep >= canvasHistory.length - 1 ? 0.6 : 1
              }}
            >
              ↷ Redo
            </button>
            <button 
              onClick={toggleGrid}
              style={{
                background: gridEnabled ? "#4CAF50" : "#f0f0f0",
                color: gridEnabled ? "white" : "#333",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: gridEnabled ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              {gridEnabled ? "Hide Grid" : "Show Grid"}
            </button>
            <button 
              onClick={() => setSymmetryMode(!symmetryMode)}
              style={{
                background: symmetryMode ? "#FF9800" : "#f0f0f0",
                color: symmetryMode ? "white" : "#333",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: symmetryMode ? "0 4px 15px rgba(255, 152, 0, 0.4)" : "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              {symmetryMode ? "Disable Symmetry" : "Enable Symmetry"}
            </button>
            <button 
              onClick={clearCanvas}
              style={{
                background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(244, 67, 54, 0.6)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(244, 67, 54, 0.4)";
              }}
            >
              🧹 Clear Canvas
            </button>
            <button 
              onClick={saveArtwork}
              style={{
                background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.6)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
              }}
            >
              💾 Save Artwork
            </button>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div style={{ 
          display: "flex", 
          gap: "20px",
          width: "100%",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {/* Main Canvas */}
          <div style={{ 
            border: "3px solid #FF6A88", 
            borderRadius: "15px", 
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            background: "white",
            position: "relative"
          }}>
            <div style={{ 
              position: "absolute", 
              top: "10px", 
              left: "10px", 
              background: "rgba(255,255,255,0.8)",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#FF6A88"
            }}>
              {tool.charAt(0).toUpperCase() + tool.slice(1)} Mode
              {symmetryMode && " | Symmetry ON"}
            </div>
            <canvas
              ref={canvasRef}
              onMouseDown={tool === 'text' && isAddingText ? addText : startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              style={{ 
                background: "white", 
                cursor: tool === 'text' && isAddingText ? "text" : "crosshair",
                display: "block"
              }}
            />
          </div>
          
          {/* Canvas Size Controls */}
          <div style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "2px solid #FFD1D9",
            minWidth: "200px"
          }}>
            <h3 style={{ 
              color: "#FF6A88", 
              marginBottom: "15px",
              textAlign: "center"
            }}>
              Canvas Size
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Small (600×400)", size: { width: 600, height: 400 } },
                { label: "Medium (800×600)", size: { width: 800, height: 600 } },
                { label: "Large (1000×700)", size: { width: 1000, height: 700 } },
                { label: "Wide (1200×600)", size: { width: 1200, height: 600 } }
              ].map(sizeOption => (
                <button
                  key={sizeOption.label}
                  onClick={() => setCanvasSize(sizeOption.size)}
                  style={{
                    background: canvasSize.width === sizeOption.size.width && canvasSize.height === sizeOption.size.height 
                      ? "#FF6A88" : "#f0f0f0",
                    color: canvasSize.width === sizeOption.size.width && canvasSize.height === sizeOption.size.height 
                      ? "white" : "#333",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  {sizeOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Art Styles Suggestions */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          border: "2px solid #FFD1D9",
          width: "100%",
          maxWidth: "1200px",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{ 
            color: "#FF6A88", 
            marginBottom: "20px",
            fontSize: "2rem",
            textAlign: "center",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}>
            🌟 Art Style Inspiration
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px"
          }}>
            {artStyles.map(style => (
              <div 
                key={style.id}
                onClick={() => applyArtStyle(style.styleKey)}
                style={{
                  background: `linear-gradient(135deg, ${style.color} 0%, ${style.color}70 100%)`,
                  borderRadius: "15px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: "white",
                  boxShadow: selectedArtStyle === style.styleKey 
                    ? "0 0 20px rgba(255, 106, 136, 0.8), 0 10px 25px rgba(0,0,0,0.2)" 
                    : "0 6px 15px rgba(0,0,0,0.1)",
                  transform: selectedArtStyle === style.styleKey ? "scale(1.05)" : "scale(1)",
                  border: selectedArtStyle === style.styleKey ? "3px solid #FFD700" : "2px solid white"
                }}
                onMouseEnter={e => {
                  if (selectedArtStyle !== style.styleKey) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseLeave={e => {
                  if (selectedArtStyle !== style.styleKey) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
                  }
                }}
              >
                <h3 style={{ 
                  margin: "0 0 12px 0", 
                  fontSize: "1.4rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
                }}>
                  {style.name}
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: "0.95rem",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.3)"
                }}>
                  {style.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtCreator;