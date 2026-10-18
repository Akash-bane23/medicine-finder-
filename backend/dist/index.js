"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const medicines_1 = __importDefault(require("./routes/medicines"));
const pharmacies_1 = __importDefault(require("./routes/pharmacies"));
const users_1 = __importDefault(require("./routes/users"));
const availability_1 = __importDefault(require("./routes/availability"));
const admin_1 = __importDefault(require("./routes/admin"));
const prescriptions_1 = __importDefault(require("./routes/prescriptions"));
const favorites_1 = __importDefault(require("./routes/favorites"));
const reminders_1 = __importDefault(require("./routes/reminders"));
const searchHistory_1 = __importDefault(require("./routes/searchHistory"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Enable CORS for frontend communication
app.use((0, cors_1.default)({
    origin: true, // Allow all origins in dev environment (or specify frontend URL)
    credentials: true
}));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// API Routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/medicines', medicines_1.default);
app.use('/api/v1/pharmacies', pharmacies_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/availability', availability_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/prescriptions', prescriptions_1.default);
app.use('/api/v1/favorites', favorites_1.default);
app.use('/api/v1/reminders', reminders_1.default);
app.use('/api/v1/search-history', searchHistory_1.default);
app.use('/api/v1/ai', ai_1.default);
// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'MediFind Backend API' });
});
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  MediFind Backend API Server Running    `);
    console.log(`  URL: http://localhost:${PORT}/api/v1   `);
    console.log(`=========================================`);
});
