require('dotenv').config()
const express = require("express");
const cors = require("cors")
const app = express();
const PORT = 3000;

const connectDB = require('./config/db')

const { errorHandler, notFound } = require("./middlewares/errorMiddleware")

const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const aiRoutes = require('./routes/aiRoutes')
const clinicRoutes = require('./routes/clinicRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const prescriptionRoutes = require('./routes/prescriptionRoutes')

connectDB()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("<h1>Page de test !</h1>");
});

app.use("/api/users", userRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/ai", aiRoutes)

app.use("/api/clinics", clinicRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.use(notFound)
app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});