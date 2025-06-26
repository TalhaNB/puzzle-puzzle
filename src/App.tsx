import { useState, useRef, useCallback } from "react";
import { styles } from "./styles";

const App = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setCurrentImage({
          element: img,
          src: e.target.result,
          width: img.width,
          height: img.height,
        });
        setPuzzlePieces([]); // Clear previous pieces
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const splitImage = () => {
    if (!currentImage) return;

    if (rows < 1 || cols < 1 || rows > 20 || cols > 20) {
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const pieceWidth = Math.floor(currentImage.width / cols);
    const pieceHeight = Math.floor(currentImage.height / rows);

    canvas.width = pieceWidth;
    canvas.height = pieceHeight;

    const pieces = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.clearRect(0, 0, pieceWidth, pieceHeight);

        ctx.drawImage(
          currentImage.element,
          col * pieceWidth,
          row * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        );

        const pieceDataUrl = canvas.toDataURL("image/png");
        const pieceNumber = row * cols + col + 1;

        pieces.push({
          dataUrl: pieceDataUrl,
          row: row,
          col: col,
          number: pieceNumber,
        });
      }
    }

    setPuzzlePieces(pieces);
  };

  const totalPieces = rows * cols;

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <h1 style={styles.title}>Puzzle Puzzle</h1>

        {/* Upload Section */}
        <div
          style={{
            ...styles.uploadSection,
            ...(isDragOver ? styles.uploadSectionDragover : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={(e) => {
            if (!isDragOver) {
              Object.assign(e.target.style, styles.uploadSectionHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragOver) {
              Object.assign(e.target.style, styles.uploadSection);
            }
          }}
        >
          <p style={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}>
            Drag & drop an image here or click to select
          </p>
          <button
            style={styles.uploadBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
            }}
          >
            Select An Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Rows:</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              style={styles.numberInput}
              onFocus={(e) =>
                Object.assign(e.target.style, styles.numberInputFocus)
              }
              onBlur={(e) => Object.assign(e.target.style, styles.numberInput)}
            />
          </div>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Columns:</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              style={styles.numberInput}
              onFocus={(e) =>
                Object.assign(e.target.style, styles.numberInputFocus)
              }
              onBlur={(e) => Object.assign(e.target.style, styles.numberInput)}
            />
          </div>
          <button
            onClick={splitImage}
            disabled={!currentImage}
            style={{
              ...styles.splitBtn,
              ...(currentImage ? {} : styles.splitBtnDisabled),
            }}
            onMouseEnter={(e) => {
              if (currentImage) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 8px 25px rgba(118, 75, 162, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentImage) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 15px rgba(118, 75, 162, 0.4)";
              }
            }}
          >
            Generate Puzzle
          </button>
        </div>

        {/* Preview */}
        {currentImage && (
          <div style={styles.preview}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Original Image
            </h3>
            <img
              src={currentImage.src}
              alt="Original"
              style={styles.originalImage}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
              Dimensions: {currentImage.width} × {currentImage.height} pixels
            </p>
          </div>
        )}

        {/* Puzzle Grid */}
        {puzzlePieces.length > 0 && (
          <div style={styles.puzzleGrid}>
            <div
              style={{
                display: "grid",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "20px",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
              }}
            >
              {puzzlePieces.map((piece) => (
                <img
                  key={piece.number}
                  src={piece.dataUrl}
                  alt={`Piece ${piece.number}`}
                  title={`Piece ${piece.number} (Row ${piece.row + 1}, Col ${
                    piece.col + 1
                  })`}
                  style={styles.puzzlePiece}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-5px) scale(1.05)";
                    e.target.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
