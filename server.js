const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize AI clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/chat', async (req, res) => {
    const { message, model } = req.body;
    console.log('Received request for model:', model);
    console.log('Message:', message);

    try {
        let response;
        
        switch (model) {
            case 'gpt-4':
                response = await openai.chat.completions.create({
                    model: "gpt-4-turbo-preview",
                    messages: [{ role: "user", content: message }]
                });
                console.log('GPT-4 response:', response);
                return res.json({ 
                    success: true, 
                    response: response.choices[0].message.content 
                });

            case 'gpt-3.5':
                response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: message }]
                });
                console.log('GPT-3.5 response:', response);
                return res.json({ 
                    success: true, 
                    response: response.choices[0].message.content 
                });

            case 'claude-3':
                response = await anthropic.messages.create({
                    model: "claude-3-opus-20240229",
                    max_tokens: 1000,
                    messages: [{ role: "user", content: message }]
                });
                console.log('Claude response:', response);
                return res.json({ 
                    success: true, 
                    response: response.content[0].text 
                });

            case 'gemini-pro':
                const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
                response = await geminiModel.generateContent(message);
                const result = await response.response;
                console.log('Gemini response:', result);
                return res.json({ 
                    success: true, 
                    response: result.text() 
                });

            default:
                throw new Error('Invalid model selected');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'An error occurred while processing your request'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 