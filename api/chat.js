import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cleanResponse = (text) =>
  text.replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(`
You are NOVA, a friendly AI chatbot.
Reply clearly and conversationally.

User: ${message}
    `);

    const text = cleanResponse(await result.response.text());

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error(err);

    if (err.message?.includes("429")) {
      return res.status(429).json({
        reply: "⚠️ NOVA is busy right now. Please try again shortly."
      });
    }

    return res.status(500).json({
      reply: "❌ Something went wrong on the server."
    });
  }
}