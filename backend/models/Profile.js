const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
        },

        prenom: {
            type: String
        },

        telephone: {
            type: Number,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /^\d{8}$/.test(v);
                },
                message: 'Le téléphone doit contenir 8 chiffres'
            }
        },

        specialite: {
            type: String,
            required: false,
        },
        
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        }
    }
)

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;