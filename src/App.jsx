import { useState, useEffect } from "react";
import { parseMCQs } from "./utils/parser";
import FileUpload from "./components/FileUpload";
import "./App.css";

function App() {
  const [mcqs, setMcqs] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [extractedText, setExtractedText] = useState("");
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleTextExtracted = (text) => {
    setExtractedText(text);
    if (text) {
      setMcqs(text);
      setStatus("✅ Text extracted! Review below, then generate.");
    } else {
      setMcqs("");
      setStatus("");
    }
  };

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

      const response = await fetch(`${API_URL}/api/create-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <a
            className="nav-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={theme === "dark" ? "/assets/Primary-dark-bgr.png" : "/assets/Primary-bgr.png"}
              alt="EzeeFlow"
              className="nav-logo-icon"
            />
            <span className="logo-text">
              <span className="logo-ezee">Ezee</span>
              <span className="logo-flow">Flow</span>
            </span> 
            <span className="demo-badge">DEMO</span>
          </a>

          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <a onClick={() => scrollTo("features")}>Features</a>
            <a onClick={() => scrollTo("pipeline")}>How It Works</a>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="nav-cta"
              onClick={() => scrollTo("quiz-section")}
            >
              Generate Quiz
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            POWERED BY LOCAL AI
          </div>

          <h1 className="hero-title">
            Automate{" "}
            <span className="gradient-text">WhatsApp Quizzes</span>
            <br />
            with Local AI
          </h1>

          <p className="hero-subtitle">
            Convert Google Docs to interactive quiz forms via{" "}
            <strong>Ollama</strong>, then auto-deliver them to users through{" "}
            <strong>WAHA</strong> and <strong>n8n</strong> — all running on your
            own infrastructure.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-primary"
              onClick={() => scrollTo("quiz-section")}
            >
              Generate Quiz Now
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollTo("features")}
            >
              Explore Features →
            </button>
          </div>

          <div className="hero-tech-badges">
            <span className="tech-badge">🦙 Ollama</span>
            <span className="tech-badge">⚡ n8n</span>
            <span className="tech-badge">📝 Google Forms</span>
            <span className="tech-badge">💬 WhatsApp</span>
            <span className="tech-badge">📱 WAHA</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features" id="features">
        <div className="section-container">
          <span className="section-tag">CORE CAPABILITIES</span>
          <h2 className="section-title">
            Everything You Need,{" "}
            <span className="gradient-text">Built In</span>
          </h2>
          <p className="section-subtitle">
            A fully automated pipeline from document to delivered quiz — no
            cloud AI, no external lock-ins.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Scheduled Triggers</h3>
              <p>
                Define cron-based schedules in n8n for automatic generation and
                delivery of quizzes — daily, weekly, or custom.
              </p>
              <div className="feature-tags">
                <span>Cron</span>
                <span>Webhooks</span>
                <span>Scheduling</span>
              </div>
            </div>

            <div className="feature-card featured">
              <div className="feature-icon">🧠</div>
              <h3>Local JSON Parsing</h3>
              <p>
                Ollama processes your Google Docs to extract quiz questions &
                answers using JSON mode — no cloud APIs needed.
              </p>
              <div className="feature-tags">
                <span>Ollama</span>
                <span>Structured Output</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Auto-Delivery</h3>
              <p>
                Quizzes are formatted and pushed to WhatsApp contacts via the
                WAHA API. Responses collected, scored, and delivered.
              </p>
              <div className="feature-tags">
                <span>WAHA</span>
                <span>WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="pipeline" id="pipeline">
        <div className="section-container">
          <span className="section-tag">PIPELINE</span>
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Write Docs</h3>
              <p>
                Create quiz content in Google Docs using simple formatting
                rules.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Parses</h3>
              <p>
                Ollama converts your documents into structured quiz objects
                locally.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>n8n Orchestrates</h3>
              <p>
                Workflows connect, format, and send quiz data to the delivery
                pipeline.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>WhatsApp Delivers</h3>
              <p>
                Students receive the quiz directly in their WhatsApp chats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUIZ GENERATOR ===== */}
      <section className="quiz-section" id="quiz-section">
        <div className="section-container">
          <span className="section-tag">QUIZ GENERATOR</span>
          <h2 className="section-title">
            Generate Your <span className="gradient-text">Quiz</span>
          </h2>
          <p className="section-subtitle">
            Paste your MCQs or upload a .docx file to instantly generate a
            Google Form quiz.
          </p>

          {/* Format Guide */}
          <details className="format-guide" id="format-guide">
            <summary className="format-guide-toggle">
              <span>📋 MCQ Format Guide — How to structure your input</span>
              <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="format-guide-content">
              <div className="format-guide-grid">
                <div className="format-guide-block">
                  <h4>📝 Required Format</h4>
                  <ul>
                    <li>First line = <strong>Quiz Title</strong></li>
                    <li>Questions start with <code>Q.1)</code> or <code>1.</code> or <code>1)</code></li>
                    <li>Options use <code>A.</code> <code>B.</code> <code>C.</code> <code>D.</code> (exactly 4 per question)</li>
                    <li>Mark the correct answer with <code>*</code> after the option text</li>
                  </ul>
                </div>
                <div className="format-guide-block">
                  <h4>📄 Example</h4>
                  <pre className="format-example">{`My Quiz Title
Q.1) What is 2 + 2?
A. 3
B. 4*
C. 5
D. 6
Q.2) Capital of Pakistan?
A. Lahore
B. Islamabad*
C. Karachi
D. Peshawar`}</pre>
                </div>
              </div>
              <div className="format-guide-footer">
                <div className="format-badge">
                  <span className="format-badge-label">Supported File</span>
                  <span className="format-badge-value">.docx (Microsoft Word)</span>
                </div>
                <div className="format-badge">
                  <span className="format-badge-label">Not Supported</span>
                  <span className="format-badge-value">.doc, .pdf, .txt</span>
                </div>
                <div className="format-badge">
                  <span className="format-badge-label">Correct Answer</span>
                  <span className="format-badge-value">Add * after the option</span>
                </div>
              </div>
            </div>
          </details>

          <div className="quiz-form-card">
            {/* Tab Switcher */}
            <div className="tab-switcher">
              <button
                className={`tab-btn ${activeTab === "paste" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("paste");
                  setStatus("");
                }}
                id="tab-paste"
              >
                <span className="tab-icon">📝</span>
                Paste MCQs
              </button>
              <button
                className={`tab-btn ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("upload");
                  setStatus("");
                }}
                id="tab-upload"
              >
                <span className="tab-icon">📁</span>
                Upload Document
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "paste" ? (
                <div className="form-group fade-in">
                  <label htmlFor="mcq-textarea">📘 Paste MCQs</label>
                  <textarea
                    placeholder={
                      "Paste your MCQs here in the format:\nTitle\nQ.1) Question text\nA. Option 1\nB. Option 2*\nC. Option 3\nD. Option 4"
                    }
                    value={mcqs}
                    onChange={(e) => setMcqs(e.target.value)}
                    id="mcq-textarea"
                  />
                </div>
              ) : (
                <div className="form-group fade-in">
                  <label>📁 Upload .docx File</label>
                  <FileUpload onTextExtracted={handleTextExtracted} />
                  {extractedText && (
                    <div className="preview-section fade-in">
                      <label htmlFor="preview-textarea">
                        📋 Extracted Text (editable)
                      </label>
                      <textarea
                        className="preview-textarea"
                        value={mcqs}
                        onChange={(e) => setMcqs(e.target.value)}
                        id="preview-textarea"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email-input">📧 Instructor Email</label>
                <input
                  type="email"
                  placeholder="instructor@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phones-input">
                  📱 Student WhatsApp Numbers
                </label>
                <input
                  type="text"
                  placeholder="+923001234567, +923009876543"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  id="phones-input"
                />
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              id="generate-btn"
            >
              Generate & Send Quiz
            </button>

            {status && (
              <div
                className={`status ${
                  status.includes("❌")
                    ? "error"
                    : status.includes("⏳")
                    ? "loading"
                    : status.includes("⚠️")
                    ? "warning"
                    : "success"
                }`}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-logo">
              <span className="logo-ezee">Ezee</span>
              <span className="logo-flow">Flow</span>
            </span>
            <p>© {new Date().getFullYear()} EzeeFlow. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;