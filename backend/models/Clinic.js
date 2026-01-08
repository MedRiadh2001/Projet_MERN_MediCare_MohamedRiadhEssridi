const mongoose = require('mongoose')

const clinicSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, 'Le nom de la clinique est obligatoire.'],
        },

        adresse: {
            type: String,
            required: [true, 'L\'adresse est obligatoire.'],
        },

        ville: {
            type: String,
            required: [true, 'La ville est obligatoire.'],
        },

        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
)

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;