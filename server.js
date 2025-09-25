const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // ✅ Use supported model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content
        const result = await model.generateContent({
            contents: [{ parts: [{ text: message }] }]
        });

        const response = await result.response;
        const text = response.text();

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
