const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} = require('../controllers/prescriptionController');
// CRUD
router.post('/', protect, createPrescription);
router.get('/', protect, getAllPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.put('/:id', protect, updatePrescription);
router.delete('/:id', protect, deletePrescription);

module.exports = router;

