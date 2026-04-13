import { useState } from "react";
import { parseMCQs } from "./utils/parser";
import "./App.css";

function App() {
  const [mcqs, setMcqs] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState("");
  const [status, setStatus] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGenerate = async () => {
    try {
      if (!mcqs || !email || !phones) {
        setStatus("⚠️ Please fill in all fields.");
        return;
      }

      const parsedData = parseMCQs(mcqs);

      const payload = {
        ...parsedData,
        email,
        phones: phones.split(",").map((p) => p.trim()),
      };

      setStatus("⏳ Generating Google Form...");

      const response = await fetch(
         `${API_URL}/api/create-form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setStatus("✅ Quiz created and sent successfully!");
        window.open(result.liveUrl, "_blank");
      } else {
        setStatus(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <h1>🚀 Quiz Automation System</h1>
          <p>
            Instantly generate Google Forms and share them via WhatsApp and Email.
          </p>
        </header>

        <div className="form-group">
          <label>📘 Paste MCQs</label>
          <textarea
            placeholder="Paste your MCQs here..."
            value={mcqs}
            onChange={(e) => setMcqs(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>📧 Instructor Email</label>
            <input
              type="email"
              placeholder="Enter instructor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>📱 Student WhatsApp Numbers</label>
            <input
              type="text"
              placeholder="+923001234567,+923009876543"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
            />
          </div>
        </div>

        <button className="generate-btn" onClick={handleGenerate}>
          Generate & Send Quiz
        </button>

        {status && (
          <div
            className={`status ${
              status.includes("❌")
                ? "error"
                : status.includes("⏳")
                ? "loading"
                : "success"
            }`}
          >
            {status}
          </div>
        )}

        <footer className="footer">
          © {new Date().getFullYear()} Quiz Automation System
        </footer>
      </div>
    </div>
  );
}

export default App;