import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./server/auth";
import paymentRouter from "./server/payment";
import adminRouter from "./server/admin";
import profileRouter from "./server/profile";
import jwt from "jsonwebtoken";
import { readDb, writeDb } from "./server/db";
import { getRoomStateFromDb, saveRoomStateToDb } from "./server/sqliteDb";
import { randomUUID } from "crypto";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from "multer";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_FALLBACK_KEY_2026";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Socket.IO Setup
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  const roomStates: Record<string, { text: string, lines: any[], chat?: any[] }> = {};

  io.on("connection", (socket) => {
    socket.on("join-collab", (roomId) => {
      socket.join(roomId);
      if (!roomStates[roomId]) {
        const persisted = getRoomStateFromDb(roomId);
        if (persisted) {
          roomStates[roomId] = persisted;
        } else {
          roomStates[roomId] = { text: "Start your collaborative diary here...", lines: [], chat: [] };
        }
      }
      socket.emit("collab-state", roomStates[roomId]);
      if (roomStates[roomId].chat && roomStates[roomId].chat!.length > 0) {
         roomStates[roomId].chat!.forEach(msg => socket.emit("chat-message", msg));
      }
    });

    socket.on("update-text", ({ roomId, text }) => {
      if (roomStates[roomId]) {
        roomStates[roomId].text = text;
        socket.to(roomId).emit("text-updated", text);
        saveRoomStateToDb(roomId, roomStates[roomId]); // Persist
      }
    });

    // Drawing Sync - Idempotent pattern using LWW per event
    socket.on("draw-line", ({ roomId, line }) => {
      if (roomStates[roomId]) {
        roomStates[roomId].lines.push(line);
        socket.to(roomId).emit("line-drawn", line);
        saveRoomStateToDb(roomId, roomStates[roomId]); // Persist
      }
    });
    
    socket.on("clear-canvas", ({ roomId }) => {
      if (roomStates[roomId]) {
        roomStates[roomId].lines = [];
        io.to(roomId).emit("canvas-cleared");
        saveRoomStateToDb(roomId, roomStates[roomId]); // Persist
      }
    });

    socket.on("chat-message", ({ roomId, message }) => {
      if (roomStates[roomId]) {
        if (!roomStates[roomId].chat) roomStates[roomId].chat = [];
        roomStates[roomId].chat!.push(message);
        socket.to(roomId).emit("chat-message", message);
        saveRoomStateToDb(roomId, roomStates[roomId]); // Persist
      }
    });

    // WebRTC Voice Chat Signaling
    socket.on("join-voice", (roomId) => {
      socket.to(roomId).emit("user-joined-voice", socket.id);
    });

    socket.on("webrtc-offer", ({ targetId, offer }) => {
      socket.to(targetId).emit("webrtc-offer", { callerId: socket.id, offer });
    });

    socket.on("webrtc-answer", ({ targetId, answer }) => {
      socket.to(targetId).emit("webrtc-answer", { callerId: socket.id, answer });
    });

    socket.on("webrtc-ice-candidate", ({ targetId, candidate }) => {
      socket.to(targetId).emit("webrtc-ice-candidate", { senderId: socket.id, candidate });
    });
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser());

  // Mount routers
  app.use("/api/auth", authRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/profile", profileRouter);

  // PDF processing upload route
  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file provided" });
      }

      // Extract text from PDF
      const pdfParsePkg = await import("pdf-parse");
      const pdfParse = (pdfParsePkg as any).default || pdfParsePkg;
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text;

      // Ask Gemini to summarize
      const prompt = `Here is the text extracted from a document. Please generate a concise overview and extract the key study points. Format as Markdown.\n\n${text.substring(0, 50000)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      res.json({
        summary: response.text,
        extractedText: text.substring(0, 10000), // Return partial text to avoid large payloads
      });
    } catch (e: any) {
      console.error("PDF upload error:", e);
      res.status(500).json({ error: "Failed to process PDF" });
    }
  });

  // Auth callback flow (standard)
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    
    // In a real app we'd exchange code for tokens. Here we mock it.
    if (code === "MOCK_AUTH_CODE") {
      const email = "demo@example.com";
      const db = readDb();
      let user = db.users.find(u => u.email === email);
      
      if (!user) {
        user = {
          id: randomUUID(),
          email,
          name: "Oauth Demo User",
          authProvider: "google",
          createdAt: new Date().toISOString(),
          isPremium: false
        };
        db.users.push(user);
        writeDb(db);
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("auth_token", token, {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // API Route: AI Chat
  app.post("/api/chat", async (req, res) => {
    const { topic, message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      let contents = [];
      
      // format history for gemini
      if (history && Array.isArray(history)) {
        contents = history.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
      }

      // add current message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are an AI Study Buddy. You are helping a student study the topic: "${topic || 'General Studies'}". Be concise, helpful, and academically accurate. Use markdown for formatting.`,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate chat response" });
    }
  });

  // API Route: Generate Study Material
  app.post("/api/generate", async (req, res) => {
    const { topic, syllabus, papers, level, summaryLength, questionDifficulty, flashcardFormat } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    try {
      const prompt = `
        You are an elite academic assistant. Create a comprehensive study kit for the topic: "${topic}".
        Target Academic Level: ${level || 'Undergraduate'}
        Summary Detail Level: ${summaryLength || 'medium'} (Adjust the depth of descriptions in the roadmap accordingly to be ${summaryLength})
        Practice Question Difficulty: ${questionDifficulty || 'medium'} (Formulate the practice questions to be ${questionDifficulty})
        Flashcard Format: ${flashcardFormat || 'term-definition'} (If term-definition, put term on front and definition on back. If question-answer, put question on front and answer on back)
        
        ${syllabus ? "Use the provided syllabus for context on depth and scope." : ""}
        ${papers ? "Focus on the patterns and styles found in the provided previous question papers." : ""}
        
        Generate the following in a structured JSON format:
        1. "roadmap": A step-by-step sequential learning timeline representing the syllabus or topic. It must be broken down into structured, bite-sized study modules. For each module, provide a title, a brief description (detail level: ${summaryLength}), an estimated duration, and a list of key topics.
        2. "flashcards": A list of at least 10 flashcards matching the ${flashcardFormat} format.
        3. "practiceQuestions": A list of at least 15 practice questions scaled to a ${questionDifficulty} difficulty level. Include 5 Multiple Choice (with options and correct answer), 5 Short Answer, and 5 Detailed/Essay type questions. For MCQs, MUST provide the 0-based index of the correct option as "correctOptionIndex".
        4. "sources": A list of 3-5 high-quality external web resources (URL and description) for further reading (e.g., Wikipedia, Khan Academy, MIT OCW).
        5. "mindMap": An array representing a mind map. Each element should have a 'concept' (string) and 'subConcepts' (an array of strings).
        6. "conceptExplanations": An array of detailed concept explanations. Each element should have a 'concept' (string) and an 'explanation' (string).
        7. "glossary": An array of key terminology. Each element should have a 'term' (string) and a 'definition' (string).
        
        Ensure the output is strictly tailored to the requested academic level.
      `;

      const contents = [];
      const parts: any[] = [{ text: prompt }];

      if (syllabus) {
        parts.push({
          inlineData: {
            mimeType: syllabus.mimeType || "image/jpeg",
            data: syllabus.data.split(',')[1] || syllabus.data
          }
        });
      }

      if (papers && Array.isArray(papers)) {
        papers.forEach(paper => {
          parts.push({
            inlineData: {
              mimeType: paper.mimeType || "image/jpeg",
              data: paper.data.split(',')[1] || paper.data
            }
          });
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmap: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "description", "duration", "keyTopics"]
                }
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING }
                  },
                  required: ["front", "back"]
                }
              },
              practiceQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "MCQ, Short, or Detailed" },
                    question: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Only for MCQ"
                    },
                    correctOptionIndex: { type: Type.INTEGER, description: "Index of the correct option for MCQ (0-based)" },
                    answer: { type: Type.STRING, description: "Correct answer or sample answer" }
                  },
                  required: ["type", "question", "answer"]
                }
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "url", "description"]
                }
              },
              mindMap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept: { type: Type.STRING },
                    subConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["concept", "subConcepts"]
                }
              },
              conceptExplanations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["concept", "explanation"]
                }
              },
              glossary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING }
                  },
                  required: ["term", "definition"]
                }
              }
            },
            required: ["roadmap", "flashcards", "practiceQuestions", "sources", "mindMap", "conceptExplanations", "glossary"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
