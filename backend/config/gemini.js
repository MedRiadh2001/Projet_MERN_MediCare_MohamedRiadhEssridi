const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
    return genAI.getGenerativeModel({
        // model: 'gemini-2.5-flash-lite',
        model: 'gemma-3-27b-it',
        generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
        },
    });
};



module.exports = { getModel };
