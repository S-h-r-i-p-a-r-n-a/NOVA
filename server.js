const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve frontend

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Clean Gemini response
const cleanResponse = (text) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
};
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (message.length > 500) {
      return res.json({
        reply: "⚠️ Please keep your message under 500 characters 🙂",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `
You are NOVA, a friendly AI chatbot.
Reply clearly and conversationally.

User: ${message}
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // 🔥 THIS WAS THE BIG BUG — must await
    let text = await response.text();
    text = cleanResponse(text);

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error.message);

    // Handle quota / rate limit errors
    if (
      error.message.includes("quota") ||
      error.message.includes("429") ||
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      return res.status(429).json({
        reply:
          "⚠️ I'm a bit overloaded right now. Please try again in a few minutes 🙏",
      });
    }

    // Generic failure
    res.status(500).json({
      reply: "⚠️ Something went wrong on my side. Please try again later.",
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(
    "🔑 Gemini API Key loaded:",
    process.env.GEMINI_API_KEY ? "YES" : "NO",
  );
});
