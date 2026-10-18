"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const router = (0, express_1.Router)();
// GET /api/v1/pharmacies/nearby
router.get('/nearby', (req, res) => {
    const lat = req.query.lat ? parseFloat(req.query.lat) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng) : undefined;
    const list = db_1.db.getNearbyPharmacies(lat, lng);
    return res.json(list);
});
// GET /api/v1/pharmacies
router.get('/', (req, res) => {
    const pharmacies = db_1.db.getPharmacies();
    return res.json(pharmacies);
});
// GET /api/v1/pharmacies/:id
router.get('/:id', (req, res) => {
    const pharmacy = db_1.db.getPharmacyById(req.params.id);
    if (!pharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }
    return res.json(pharmacy);
});
// POST /api/v1/pharmacies
router.post('/', (req, res) => {
    try {
        const newPharmacy = db_1.db.createPharmacy(req.body);
        return res.status(201).json(newPharmacy);
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message || 'Failed to create pharmacy' });
    }
});
// PUT /api/v1/pharmacies/:id
router.put('/:id', (req, res) => {
    try {
        const updated = db_1.db.updatePharmacy(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message || 'Pharmacy not found' });
    }
});
// PATCH /api/v1/pharmacies/:id
router.patch('/:id', (req, res) => {
    try {
        const updated = db_1.db.updatePharmacy(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(404).json({ success: false, message: err.message || 'Pharmacy not found' });
    }
});
// DELETE /api/v1/pharmacies/:id
router.delete('/:id', (req, res) => {
    const success = db_1.db.deletePharmacy(req.params.id);
    if (!success) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }
    return res.json({ success: true, message: 'Pharmacy deleted successfully' });
});
exports.default = router;
