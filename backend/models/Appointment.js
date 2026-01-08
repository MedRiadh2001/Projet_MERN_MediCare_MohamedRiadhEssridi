const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le patient est obligatoire.'],
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le médecin est obligatoire.'],
        },

        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clinic',
            required: [true, 'La clinique est obligatoire.'],
        },

        date: {
            type: Date,
            required: [true, 'La date du rendez-vous est obligatoire.'],
        },

        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
            default: 'scheduled'
        },

        reason: {
            type: String,
            required: false,
        },

        notes: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
)

// Index pour éviter les doublons de rendez-vous
appointmentSchema.index({ doctor: 1, date: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;

