const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('connexion mongodb réussie')
    } catch (err) {
        console.log('Erreur de connexion mongodb : ', err.message)
        process.exit(1)
    }
}

module.exports = connectDB