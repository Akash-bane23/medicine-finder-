"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/v1/search-history
router.get('/', auth_1.authenticateToken, (req, res) => {
    if (!req.user)
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    const history = db_1.db.getSearchHistoryByUserId(req.user.id);
    return res.json({
        success: true,
        count: history.length,
        history
    });
});
// POST /api/v1/search-history
router.post('/', auth_1.authenticateToken, (req, res) => {
    if (!req.user)
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { searchQuery, medicineId } = req.body;
    if (!searchQuery || !searchQuery.trim()) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    const item = db_1.db.addSearchHistory(req.user.id, searchQuery.trim(), medicineId);
    return res.status(201).json({
        success: true,
        message: 'Search history recorded',
        item
    });
});
// DELETE /api/v1/search-history
router.delete('/', auth_1.authenticateToken, (req, res) => {
    if (!req.user)
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    db_1.db.clearSearchHistory(req.user.id);
    return res.json({ success: true, message: 'Search history cleared' });
});
exports.default = router;
