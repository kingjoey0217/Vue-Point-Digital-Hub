import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("vuepoint.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT,
    title TEXT,
    link TEXT,
    status TEXT DEFAULT 'Pending Review',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/assignments", (req, res) => {
    const assignments = db.prepare("SELECT * FROM assignments ORDER BY submitted_at DESC").all();
    res.json(assignments);
  });

  app.post("/api/assignments", (req, res) => {
    const { student_name, title, link } = req.body;
    const info = db.prepare("INSERT INTO assignments (student_name, title, link) VALUES (?, ?, ?)").run(student_name, title, link);
    res.json({ id: info.lastInsertRowid, status: 'Pending Review' });
  });

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: `You are the Vue Point Support Bot. 
          Knowledge Base:
          - Hub Location: Navy Estate, Karshi.
          - Opening Date: April 6th.
          - Course Durations: 4-6 months.
          - Courses: Full-Stack, Front-End, Back-End.
          If you cannot answer a technical question, suggest escalating to a human mentor.`
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
