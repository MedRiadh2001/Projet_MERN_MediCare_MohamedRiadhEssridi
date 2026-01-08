const { getModel } = require("../config/gemini");

// Chatbot IA basique - Gemini
exports.chatbot = async (req, res) => {
    try {
        const { message, context } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message utilisateur requis" });
        }
        const prompt = `
Vous êtes un assistant médical virtuel.
Contexte précédent : ${context || "aucun"}
Message utilisateur : ${message}

Répondez toujours en langage naturel, dans un style poli ; signalez si une question sort de votre domaine ou nécessite un vrai professionnel de santé.
`;
        const model = getModel();
        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        res.json({ success: true, reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
