const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Liste tous les utilisateurs avec profils
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().populate('profile');
    res.status(200).json(users);
});

// Récupère le détail d'un utilisateur par son id (profil inclus)
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('profile');
    if (!user) {
        res.status(404);
        throw new Error("Utilisateur non trouvé.");
    }
    res.status(200).json(user);
});

module.exports = { getAllUsers, getUserById };
