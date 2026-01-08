const express = require('express');
const router = express.Router();
const { chatbot } = require('../controllers/aiController');

// Route POST basique pour le chatbot Gemini
router.post('/chatbot', chatbot);

module.exports = router;

