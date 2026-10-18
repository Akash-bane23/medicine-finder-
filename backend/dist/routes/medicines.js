"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const router = (0, express_1.Router)();
// GET /api/v1/medicines
router.get('/', (req, res) => {
    const { searchQuery, category, brand, dosageForm, prescriptionRequired, availability } = req.query;
    const medicines = db_1.db.getMedicines({
        searchQuery: searchQuery,
        category: category,
        brand: brand,
        dosageForm: dosageForm,
        prescriptionRequired: prescriptionRequired,
        availability: availability
    });
    return res.json(medicines);
});
// GET /api/v1/medicines/:id
router.get('/:id', (req, res) => {
    const medicine = db_1.db.getMedicineById(req.params.id);
    if (!medicine) {
        return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    return res.json(medicine);
});
// POST /api/v1/medicines
router.post('/', (req, res) => {
    try {
        const newMedicine = db_1.db.createMedicine(req.body);
        return res.status(201).json(newMedicine);
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message || 'Failed to create medicine' });
    }
});
// PUT /api/v1/medicines/:id
router.put('/:id', (req, res) => {
    try {
        const updated = db_1.db.updateMedicine(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message || 'Medicine not found' });
    }
});
// PATCH /api/v1/medicines/:id
router.patch('/:id', (req, res) => {
    try {
        const updated = db_1.db.updateMedicine(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message || 'Medicine not found' });
    }
});
// DELETE /api/v1/medicines/:id
router.delete('/:id', (req, res) => {
    const success = db_1.db.deleteMedicine(req.params.id);
    if (!success) {
        return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    return res.json({ success: true, message: 'Medicine deleted successfully' });
});
exports.default = router;
