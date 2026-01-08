const Appointment = require('../models/Appointment');
const asyncHandler = require('express-async-handler');

// Créer un rendez-vous
exports.createAppointment = asyncHandler(async (req, res) => {
    const { patient, doctor, clinic, date, status, reason, notes } = req.body;
    const appointment = await Appointment.create({ patient, doctor, clinic, date, status, reason, notes });
    res.status(201).json(appointment);
});

exports.getAllAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
        .populate({
            path: 'patient',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' } // Population imbriquée
        })
        .populate({
            path: 'doctor',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' } // Population imbriquée
        })
        .populate('clinic', 'nom');
    res.status(200).json(appointments);
});

exports.getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate({
            path: 'patient',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' }
        })
        .populate({
            path: 'doctor',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' }
        })
        .populate('clinic', 'nom');
    if (!appointment) return res.status(404).json({ message: "Rendez-vous introuvable" });
    res.status(200).json(appointment);
});

// Modifier un rendez-vous
// controllers/appointmentController.js

exports.updateAppointment = asyncHandler(async (req, res) => {
    // 1. Mettre à jour
    // 2. Utiliser .populate() sur le résultat pour renvoyer l'objet complet au Frontend
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate({
            path: 'patient',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' }
        })
        .populate({
            path: 'doctor',
            select: 'email',
            populate: { path: 'profile', select: 'nom prenom' }
        })
        .populate('clinic', 'nom');

    if (!appointment) return res.status(404).json({ message: "Rendez-vous introuvable" });
    
    res.status(200).json(appointment);
});

// Supprimer un rendez-vous
exports.deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Rendez-vous introuvable" });
    res.status(204).end();
});

