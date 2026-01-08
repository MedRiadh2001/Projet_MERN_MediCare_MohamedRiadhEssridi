const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createClinic,
    getAllClinics,
    getClinicById,
    updateClinic,
    deleteClinic
} = require('../controllers/clinicController');
// CRUD
router.post('/', protect, createClinic);
router.get('/', getAllClinics);
router.get('/:id', getClinicById);
router.put('/:id', protect, updateClinic);
router.delete('/:id', protect, deleteClinic);

module.exports = router;

