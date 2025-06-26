import { useState, useRef, useCallback } from "react";

const App = () => {
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    innerContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
      fontSize: "2.5em",
      background: "linear-gradient(45deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "bold",
    },
    uploadSection: {
      border: "3px dashed #667eea",
      borderRadius: "15px",
      padding: "40px",
      textAlign: "center",
      marginBottom: "30px",
      transition: "all 0.3s ease",
      background:
        "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
      cursor: "pointer",
    },
    uploadSectionHover: {
      borderColor: "#764ba2",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 25px rgba(102, 126, 234, 0.2)",
    },
    uploadSectionDragover: {
      borderColor: "#764ba2",
      background:
        "linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
    },
    uploadBtn: {
      background: "linear-gradient(45deg, #667eea, #764ba2)",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
    },
    controls: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    controlGroup: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    label: {
      fontWeight: "600",
      color: "#555",
    },
    numberInput: {
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "10px",
      fontSize: "16px",
      width: "80px",
      textAlign: "center",
      transition: "border-color 0.3s ease",
    },
    numberInputFocus: {
      outline: "none",
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    splitBtn: {
      background: "linear-gradient(45deg, #764ba2, #667eea)",
      color: "white",
      padding: "15px 40px",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 5px 15px rgba(118, 75, 162, 0.4)",
    },
    splitBtnDisabled: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    preview: {
      textAlign: "center",
      marginBottom: "30px",
    },
    originalImage: {
      maxWidth: "400px",
      maxHeight: "300px",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: "transform 0.3s ease",
    },
    puzzleGrid: {
      display: "grid",
      gap: "10px",
      justifyContent: "center",
      marginTop: "30px",
      padding: "20px",
      background: "rgba(255, 255, 255, 0.5)",
      borderRadius: "15px",
    },
    puzzlePiece: {
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    downloadAllBtn: {
      background: "linear-gradient(45deg, #28a745, #20c997)",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      marginTop: "20px",
      transition: "all 0.3s ease",
      boxShadow: "0 5px 15px rgba(40, 167, 69, 0.4)",
    },
    status: {
      textAlign: "center",
      marginTop: "20px",
      fontWeight: "600",
      color: "#555",
      padding: "15px",
      background: "rgba(102, 126, 234, 0.1)",
      borderRadius: "10px",
    },
  };
  const [currentImage, setCurrentImage] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [status, setStatus] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) {
      setStatus("Please select a valid image file.");
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
        setStatus(`Image loaded: ${img.width}×${img.height}px`);
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
      setStatus(
        "Please enter valid numbers between 1 and 20 for rows and columns."
      );
      return;
    }

    setStatus("Splitting image...");

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
    setStatus(
      `Successfully split into ${rows}×${cols} = ${
        rows * cols
      } pieces! Click any piece to download it.`
    );
  };

  const downloadPiece = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const downloadAllPieces = () => {
    if (puzzlePieces.length === 0) return;

    setStatus("Downloading all pieces...");

    puzzlePieces.forEach((piece, index) => {
      setTimeout(() => {
        downloadPiece(piece.dataUrl, `puzzle_piece_${piece.number}.png`);
        if (index === puzzlePieces.length - 1) {
          setStatus("All pieces downloaded!");
        }
      }, index * 100);
    });
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
            📁 Choose Image
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
            ✂️ Split into {totalPieces} Pieces
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
                  onClick={() =>
                    downloadPiece(piece.dataUrl, `piece_${piece.number}.png`)
                  }
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

            <div style={{ textAlign: "center" }}>
              <button
                onClick={downloadAllPieces}
                style={styles.downloadAllBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(40, 167, 69, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(40, 167, 69, 0.4)";
                }}
              >
                📥 Download All Pieces
              </button>
            </div>
          </div>
        )}

        {/* Status */}
        {status && (
          <div style={styles.status}>
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
