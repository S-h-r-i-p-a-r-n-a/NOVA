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

// Chat API
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
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
        console.error("Gemini error:", error);
        res.status(500).json({
            error: "Gemini API failed",
            details: error.message,
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(
        "🔑 Gemini API Key loaded:",
        process.env.GEMINI_API_KEY ? "YES" : "NO"
    );
});