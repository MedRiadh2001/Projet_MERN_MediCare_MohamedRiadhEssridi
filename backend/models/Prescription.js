const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: [true, 'Le rendez-vous est obligatoire.'],
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le médecin est obligatoire.'],
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le patient est obligatoire.'],
        },

        type: {
            type: String,
            enum: ['prescription', 'note_medicale', 'suivi'],
            default: 'note_medicale'
        },

        content: {
            type: String,
            required: [true, 'Le contenu est obligatoire.'],
        },

        medications: [
            {
                name: {
                    type: String,
                    required: true
                },
                dosage: {
                    type: String,
                    required: false
                },
                frequency: {
                    type: String,
                    required: false
                },
                duration: {
                    type: String,
                    required: false
                }
            }
        ],
    },
    { timestamps: true }
)

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;

