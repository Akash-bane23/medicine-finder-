"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const router = (0, express_1.Router)();
// GET /api/v1/admin/stats
router.get('/stats', (req, res) => {
    const stats = db_1.db.getDashboardStats();
    const searchTrends = db_1.db.getSearchTrends();
    const categoryStats = db_1.db.getCategoryStats();
    const userGrowth = db_1.db.getUserGrowth();
    return res.json({
        stats,
        searchTrends,
        categoryStats,
        userGrowth
    });
});
exports.default = router;
