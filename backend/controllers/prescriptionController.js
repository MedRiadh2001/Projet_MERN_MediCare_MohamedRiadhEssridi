const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment'); // Import indispensable
const asyncHandler = require('express-async-handler');

// controllers/prescriptionController.js

exports.createPrescription = asyncHandler(async (req, res) => {
    const { appointment, type, content, medications } = req.body;
    const doctorId = req.userId;

    const foundAppointment = await Appointment.findById(appointment);
    if (!foundAppointment) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    if (foundAppointment.doctor.toString() !== doctorId.toString()) {
        return res.status(403).json({ message: "Non autorisé" });
    }

    // 1. Création
    let prescription = await Prescription.create({
        appointment,
        doctor: doctorId,
        patient: foundAppointment.patient,
        type,
        content,
        medications
    });

    // 2. IMPORTANT : On peuple les données avant de répondre au frontend
    prescription = await prescription.populate([
        { path: 'patient', select: 'email', populate: { path: 'profile' } },
        { path: 'doctor', select: 'email', populate: { path: 'profile' } }
    ]);

    res.status(201).json(prescription);
});

// Modifier aussi getAll pour inclure les noms (comme précédemment)
exports.getAllPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find()
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
        .populate('appointment', 'date');
    res.status(200).json(prescriptions);
});

// Récupérer une prescription par ID
exports.getPrescriptionById = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findById(req.params.id)
        .populate('appointment')
        .populate('doctor', 'email')
        .populate('patient', 'email');
    if (!prescription) return res.status(404).json({ message: "Prescription introuvable" });
    res.status(200).json(prescription);
});

// Modifier une prescription
exports.updatePrescription = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ message: "Prescription introuvable" });
    res.status(200).json(prescription);
});

// Supprimer une prescription
exports.deletePrescription = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription introuvable" });
    res.status(204).end();
});

