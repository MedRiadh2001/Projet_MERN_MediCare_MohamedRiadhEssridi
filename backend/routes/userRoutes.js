const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById } = require('../controllers/userController');
const { createProfile, getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

// Liste tous les utilisateurs
router.get('/', getAllUsers);
// Détail utilisateur par id
router.get('/:id', getUserById);

// CRUD profile utilisateur
router.post('/:userId/profile', protect, createProfile);
router.get('/:userId/profile', protect, getProfile);
router.put('/:userId/profile', protect, updateProfile);

module.exports = router;
