const Clinic = require('../models/Clinic');
const asyncHandler = require('express-async-handler');

// Créer une clinique
exports.createClinic = asyncHandler(async (req, res) => {
    const { nom, adresse, ville, doctors } = req.body;
    const clinic = await Clinic.create({ nom, adresse, ville, doctors });
    res.status(201).json(clinic);
});

// Récupérer toutes les cliniques
exports.getAllClinics = asyncHandler(async (req, res) => {
    const clinics = await Clinic.find().populate('doctors', 'email role');
    res.status(200).json(clinics);
});

// Récupérer une clinique par ID
exports.getClinicById = asyncHandler(async (req, res) => {
    const clinic = await Clinic.findById(req.params.id).populate('doctors', 'email role');
    if (!clinic) return res.status(404).json({ message: "Clinique introuvable" });
    res.status(200).json(clinic);
});

// Modifier une clinique
exports.updateClinic = asyncHandler(async (req, res) => {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clinic) return res.status(404).json({ message: "Clinique introuvable" });
    res.status(200).json(clinic);
});

// Supprimer une clinique
exports.deleteClinic = asyncHandler(async (req, res) => {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) return res.status(404).json({ message: "Clinique introuvable" });
    res.status(204).end();
});

