const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to clean up the response text
const cleanResponse = (text) => {
    return text
        .replace(/\*\*/g, '') // Remove markdown bold
        .replace(/`/g, '') // Remove code ticks
        .replace(/\n\n/g, '\n') // Replace double newlines with single
        .trim(); // Remove extra whitespace
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Configure the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 0.8,
                maxOutputTokens: 2048,
            },
        });

        // Create a more conversational prompt
        const prompt = `You are NOVA, a friendly and helpful AI assistant. Respond in a natural, conversational way to: ${message}`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up the response
        text = cleanResponse(text);

        console.log('Final text:', text);

        res.json({ reply: text });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            error: 'Something went wrong with Gemini API',
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: err.message
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
});
