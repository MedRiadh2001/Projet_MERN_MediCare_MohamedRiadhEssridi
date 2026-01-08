const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const User = require('../models/User');

// Créer un profil, la spécialité est réservée aux docteurs uniquement
const createProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { nom, prenom, telephone, specialite } = req.body;

    // Vérifier que l'utilisateur connecté correspond bien à l'id ciblé
    if (req.userId !== userId) {
        return res.status(403).json({ message: "Accès refusé : vous ne pouvez créer/modifier qu'un profil pour vous-même." });
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('Utilisateur non trouvé.');
    }
    // Vérifier unicité du téléphone
    const telExists = await Profile.findOne({ telephone });
    if (telExists) {
        res.status(400);
        throw new Error('Ce téléphone est déjà utilisé.');
    }
    // Vérifier unicité d'un profil pour ce user
    const alreadyProfile = await Profile.findOne({ user: userId });
    if (alreadyProfile) {
        res.status(400);
        throw new Error('Ce profil utilisateur existe déjà.');
    }
    // La spécialité n'est acceptée que pour le rôle Doctor
    let finalSpecialite = undefined;
    if (user.role === 'Doctor') {
        finalSpecialite = specialite;
    } else if (specialite) {
        res.status(400);
        throw new Error('Seuls les docteurs peuvent avoir une spécialité.');
    }
    const profile = await Profile.create({ nom, prenom, telephone, specialite: finalSpecialite, user: userId });
    user.profile = profile._id;
    await user.save();
    res.status(201).json(profile);
});

// Récupérer un profil par userId
const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
        res.status(404);
        throw new Error('Profil non trouvé.');
    }
    res.status(200).json(profile);
});

// Mettre à jour un profil en respectant la règle : spécialité modifiable seulement pour les docteurs
const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // Vérifier que l'utilisateur connecté correspond bien à l'id ciblé
    if (req.userId !== userId) {
        return res.status(403).json({ message: "Accès refusé : vous ne pouvez modifier qu'un profil pour vous-même." });
    }

    // Ne pas autoriser la modification de user
    if (req.body.user) delete req.body.user;
    // Prévenir les updates problématiques sur téléphone (unicité)
    if (req.body.telephone) {
        const exist = await Profile.findOne({ telephone: req.body.telephone });
        if (exist && String(exist.user) !== userId) {
            res.status(400);
            throw new Error('Ce téléphone est déjà utilisé.');
        }
    }
    // Vérifie si spécialité fournie : autorisée uniquement pour doctor
    if (req.body.specialite !== undefined) {
        const user = await User.findById(userId);
        if (!user || user.role !== 'Doctor') {
            res.status(400);
            throw new Error('Seuls les docteurs peuvent avoir une spécialité.');
        }
    }
    const profile = await Profile.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true }
    );
    if (!profile) {
        res.status(404);
        throw new Error('Profil non trouvé.');
    }
    res.status(200).json(profile);
});

module.exports = { createProfile, getProfile, updateProfile };
