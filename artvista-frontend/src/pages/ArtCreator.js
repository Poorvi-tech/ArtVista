import React, { useState, useEffect, useRef, useCallback } from "react";

const ArtCreator = () => {
  const canvasRef = useRef(null);
  const isInitializing = useRef(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState("brush");
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isAddingText, setIsAddingText] = useState(false);
  const [isSymmetryEnabled, setIsSymmetryEnabled] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [shapePreviewUrl, setShapePreviewUrl] = useState(null);
  const lastPointRef = useRef(null);
  const [styles, setStyles] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const [enhanceMsg, setEnhanceMsg] = useState('');

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
    
    // Save initial state only once on first mount
    if (isInitializing.current) {
      isInitializing.current = false;
      const newHistory = [canvas.toDataURL()];
      setCanvasHistory(newHistory);
      setHistoryStep(0);
    }
  }, [canvasSize]);
  
  useEffect(() => {
    if (!gridEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [gridEnabled, canvasSize]);
  
  useEffect(() => {
    const base = process.env.REACT_APP_BACKEND_URL || window.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
    if (!base) return;
    const fetchData = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch(`${base.replace(/\/$/, '')}/api/artcreator/styles`),
          fetch(`${base.replace(/\/$/, '')}/api/artcreator/palettes`)
        ]);
        const sData = await sRes.json();
        const pData = await pRes.json();
        if (Array.isArray(sData)) setStyles(sData);
        if (Array.isArray(pData)) setPalettes(pData);
      } catch (e) {
        // silent fail; page still works offline
      }
    };
    fetchData();
  }, []);

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
    
    if (tool === 'text' && textInput.trim()) {
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(textInput, x, y);
      setIsAddingText(false);
      saveCanvasState();
      return;
    }
    
    if (tool === 'shape' && selectedShape) {
      setStartPos({ x, y });
      setShapePreviewUrl(canvas.toDataURL());
      setIsDrawing(true);
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };
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
        if (isSymmetryEnabled && lastPointRef.current) {
          const prev = lastPointRef.current;
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = 'round';
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(canvas.width - prev.x, prev.y);
          ctx.lineTo(canvas.width - x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
        lastPointRef.current = { x, y };
        break;
        
      case 'eraser':
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (isSymmetryEnabled && lastPointRef.current) {
          const prev = lastPointRef.current;
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(canvas.width - prev.x, prev.y);
          ctx.lineTo(canvas.width - x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
        lastPointRef.current = { x, y };
        break;
      
      case 'shape':
        if (!selectedShape || !startPos) return;
        if (shapePreviewUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = color;
            ctx.fillStyle = fillColor === 'transparent' ? 'rgba(0,0,0,0)' : fillColor;
            const sx = startPos.x, sy = startPos.y;
            const w = x - sx, h = y - sy;
            if (selectedShape === 'rectangle') {
              if (fillColor !== 'transparent') ctx.fillRect(sx, sy, w, h);
              ctx.strokeRect(sx, sy, w, h);
            } else if (selectedShape === 'circle') {
              const r = Math.sqrt(w*w + h*h);
              ctx.beginPath();
              ctx.arc(sx, sy, r, 0, Math.PI * 2);
              if (fillColor !== 'transparent') ctx.fill();
              ctx.stroke();
            } else if (selectedShape === 'triangle') {
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(x, y);
              ctx.lineTo(sx, y);
              ctx.closePath();
              if (fillColor !== 'transparent') ctx.fill();
              ctx.stroke();
            } else if (selectedShape === 'line') {
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          };
          img.src = shapePreviewUrl;
        }
        break;
      default:
        // Default case for unknown tools
        break;
    }
    if (gridEnabled) {
      drawGrid(true);
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    setIsDrawing(false);
    if (tool === 'shape' && selectedShape && startPos && shapePreviewUrl) {
      // No event here, rely on lastPointRef where possible; alternatively we can't read end point on mouseup. Keep last point as current mouse in draw.
      // Finalize already drawn preview: just save state.
      saveCanvasState();
      setStartPos(null);
      setShapePreviewUrl(null);
    } else {
      saveCanvasState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gridEnabled) {
      drawGrid();
    }
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
  
  const getUploadDataUrl = () => {
    const src = canvasRef.current;
    const maxW = 800;
    const scale = src.width > maxW ? maxW / src.width : 1;
    if (scale < 1) {
      const tmp = document.createElement('canvas');
      tmp.width = Math.round(src.width * scale);
      tmp.height = Math.round(src.height * scale);
      const tctx = tmp.getContext('2d');
      tctx.drawImage(src, 0, 0, tmp.width, tmp.height);
      return tmp.toDataURL('image/jpeg', 0.7);
    }
    return src.toDataURL('image/jpeg', 0.7);
  };
  
  const enhanceArtwork = async (type = 'enhance') => {
    setEnhanceMsg('');
    try {
      const base = process.env.REACT_APP_BACKEND_URL || window.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
      if (!base) {
        setEnhanceMsg('Backend unavailable');
        return;
      }
      const dataUrl = getUploadDataUrl();
      const res = await fetch(`${base.replace(/\/$/, '')}/api/artcreator/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: dataUrl, enhancementType: type })
      });
      const data = await res.json();
      if (data && data.success) {
        setEnhanceMsg(data.message || 'Enhanced');
      } else {
        setEnhanceMsg('Enhancement failed');
      }
    } catch (e) {
      setEnhanceMsg('Enhancement error');
    } finally {
      setTimeout(() => setEnhanceMsg(''), 2500);
    }
  };

  const toggleGrid = () => {
    const enabling = !gridEnabled;
    setGridEnabled(enabling);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const snapshot = canvasHistory[historyStep];
    if (snapshot) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        if (enabling) {
          drawGrid(true);
        }
      };
      img.src = snapshot;
    } else {
      if (enabling) drawGrid(true);
      if (!enabling) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const drawGrid = (force = false) => {
    if (!gridEnabled && !force) return;
    
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
              onClick={() => setIsSymmetryEnabled(!isSymmetryEnabled)}
              style={{
                background: isSymmetryEnabled ? "#FF9800" : "#f0f0f0",
                color: isSymmetryEnabled ? "white" : "#333",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: isSymmetryEnabled ? "0 4px 15px rgba(255, 152, 0, 0.4)" : "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              {isSymmetryEnabled ? "Disable Symmetry" : "Enable Symmetry"}
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
            <button 
              onClick={() => enhanceArtwork('enhance')}
              style={{
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(33, 150, 243, 0.4)",
                transition: "all 0.3s ease"
              }}
            >
              ✨ Enhance (Simulated)
            </button>
            {enhanceMsg && <div style={{ color: "#1976D2", fontWeight: "bold" }}>{enhanceMsg}</div>}
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
              {isSymmetryEnabled && " | Symmetry ON"}
            </div>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              style={{ 
                background: "white", 
                cursor: tool === 'text' && isAddingText ? "text" : "crosshair",
                display: "block",
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`
              }}
            />
            {isSymmetryEnabled && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-1px)",
                width: "2px",
                height: `${canvasSize.height}px`,
                background: "rgba(255, 152, 0, 0.6)",
                pointerEvents: "none"
              }} />
            )}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {styles.map((s) => (
              <div key={s.id} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #eee", background: "#fff" }}>
                <div style={{ fontWeight: 700, color: "#333" }}>{s.name}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>{s.description}</div>
              </div>
            ))}
          </div>
          <h3 style={{ color: "#FF6A88", marginBottom: "10px" }}>🎨 Color Palettes</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {palettes.map((p) => (
              <div key={p.id} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #eee", background: "#fff" }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  {(p.colors || []).map((c, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setColor(c)} 
                      title={`Set brush color to ${c}`} 
                      style={{ width: "28px", height: "28px", borderRadius: "6px", background: c, border: "1px solid #ddd", cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtCreator;
