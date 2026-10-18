"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const router = (0, express_1.Router)();
// GET /api/v1/availability
router.get('/', (req, res) => {
    const records = db_1.db.getAvailabilityRecords();
    return res.json(records);
});
// PUT /api/v1/availability
router.put('/', (req, res) => {
    const { pharmacyId, medicineId, quantity, status } = req.body;
    if (!pharmacyId || !medicineId || quantity === undefined || !status) {
        return res.status(400).json({ success: false, message: 'Missing required fields: pharmacyId, medicineId, quantity, status' });
    }
    const success = db_1.db.updateStock(pharmacyId, medicineId, Number(quantity), status);
    if (!success) {
        return res.status(400).json({ success: false, message: 'Failed to update stock' });
    }
    return res.json({ success: true, message: 'Stock updated successfully' });
});
exports.default = router;
