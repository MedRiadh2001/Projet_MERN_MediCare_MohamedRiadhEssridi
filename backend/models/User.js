const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "L'email est obligatoire"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Format d\'email invalide']
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            required: [true, "Le rôle est obligatoire"],
            enum: ['Patient', 'Doctor', 'Admin'],
            default: 'Patient'
        },

        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },

        clinics: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Clinic'
            }
        ],

    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;