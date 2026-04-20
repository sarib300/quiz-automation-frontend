import { useState, useRef } from "react";
import mammoth from "mammoth";

function FileUpload({ onTextExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Use FileReader instead of file.arrayBuffer() for broader browser compatibility
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file. Please try again."));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file) => {
    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExtensions = [".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setError("⚠️ Only .docx files are supported. Please upload a valid Word document.");
      return;
    }

    // Validate file is not empty
    if (!file.size || file.size === 0) {
      setError("⚠️ The file appears to be empty (0 bytes). Please check the file and try again.");
      return;
    }

    setError("");
    setFileName(file.name);
    setFileSize(formatSize(file.size));
    setProcessing(true);

    try {
      // Read file using FileReader for better compatibility
      const arrayBuffer = await readFileAsArrayBuffer(file);

      // Verify we actually got data
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        setError("⚠️ Could not read file contents. The file may be corrupted or empty.");
        setProcessing(false);
        return;
      }

      const result = await mammoth.extractRawText({ arrayBuffer });
      const extractedText = result.value.trim();

      if (!extractedText) {
        setError("⚠️ No text content found in the document. Make sure the .docx file contains MCQ text.");
        setProcessing(false);
        return;
      }

      onTextExtracted(extractedText);
      setProcessing(false);
    } catch (err) {
      console.error("Docx parsing error:", err);

      // Provide user-friendly error messages
      let errorMsg = err.message || "Unknown error";
      if (errorMsg.includes("Corrupted zip") || errorMsg.includes("End of data")) {
        errorMsg = "The file appears to be corrupted or not a valid .docx file. Please re-save the document as .docx from Microsoft Word or Google Docs and try again.";
      }

      setError(`❌ ${errorMsg}`);
      setProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setFileSize("");
    setError("");
    setProcessing(false);
    onTextExtracted("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""} ${fileName && !error ? "has-file" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !fileName && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="file-upload-input"
        />

        {processing ? (
          <div className="upload-processing">
            <div className="spinner"></div>
            <p>Extracting questions from document...</p>
          </div>
        ) : fileName ? (
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <span className="file-name">{fileName}</span>
              <span className="file-size">{fileSize}</span>
            </div>
            <button
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              title="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="upload-main-text">
              Drag & drop your <strong>.docx</strong> file here
            </p>
            <p className="upload-sub-text">or click to browse files</p>
          </div>
        )}
      </div>

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}

export default FileUpload;
