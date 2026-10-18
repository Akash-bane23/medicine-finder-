"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const initialData_1 = require("./initialData");
const DB_DIR = path_1.default.resolve(__dirname, '../../data');
const DB_FILE = path_1.default.join(DB_DIR, 'db.json');
class DatabaseManager {
    data;
    constructor() {
        this.ensureDirectory();
        this.data = this.loadDatabase();
    }
    ensureDirectory() {
        if (!fs_1.default.existsSync(DB_DIR)) {
            fs_1.default.mkdirSync(DB_DIR, { recursive: true });
        }
    }
    loadDatabase() {
        if (fs_1.default.existsSync(DB_FILE)) {
            try {
                const fileContent = fs_1.default.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(fileContent);
            }
            catch (err) {
                console.error('Error reading db.json, re-initializing with seed data:', err);
            }
        }
        const defaultData = {
            medicines: [...initialData_1.initialMedicines],
            pharmacies: [...initialData_1.initialPharmacies],
            users: [...initialData_1.initialUsers],
            searchTrends: [...initialData_1.searchTrends],
            categoryStats: [...initialData_1.categoryStats],
            userGrowth: [...initialData_1.userGrowth],
            prescriptions: [],
            favorites: [],
            searchHistory: [],
            reminders: []
        };
        this.saveDatabase(defaultData);
        return defaultData;
    }
    saveDatabase(dataToSave) {
        try {
            const data = dataToSave || this.data;
            fs_1.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('Failed to write database file:', err);
        }
    }
    // --- MEDICINES ---
    getMedicines(filters) {
        let result = [...this.data.medicines];
        if (!filters)
            return result;
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(m => m.name.toLowerCase().includes(q) ||
                m.genericName.toLowerCase().includes(q) ||
                m.brandName.toLowerCase().includes(q) ||
                m.uses.toLowerCase().includes(q));
        }
        if (filters.category) {
            result = result.filter(m => m.category.toLowerCase().includes(filters.category.toLowerCase()));
        }
        if (filters.brand) {
            result = result.filter(m => m.brandName.toLowerCase().includes(filters.brand.toLowerCase()));
        }
        if (filters.dosageForm) {
            result = result.filter(m => m.dosageForm.toLowerCase() === filters.dosageForm.toLowerCase());
        }
        if (filters.prescriptionRequired && filters.prescriptionRequired !== 'all') {
            const req = filters.prescriptionRequired === 'yes';
            result = result.filter(m => m.prescriptionRequired === req);
        }
        if (filters.availability && filters.availability !== 'all') {
            result = result.filter(m => m.availabilityStatus === filters.availability);
        }
        return result;
    }
    getMedicineById(id) {
        return this.data.medicines.find(m => m.id === id);
    }
    createMedicine(medicine) {
        const newMed = {
            ...medicine,
            id: `med-${Date.now()}`
        };
        this.data.medicines.unshift(newMed);
        this.saveDatabase();
        return newMed;
    }
    updateMedicine(id, fields) {
        const index = this.data.medicines.findIndex(m => m.id === id);
        if (index === -1)
            throw new Error('Medicine not found');
        const updated = { ...this.data.medicines[index], ...fields };
        this.data.medicines[index] = updated;
        this.saveDatabase();
        return updated;
    }
    deleteMedicine(id) {
        const initialLen = this.data.medicines.length;
        this.data.medicines = this.data.medicines.filter(m => m.id !== id);
        if (this.data.medicines.length !== initialLen) {
            this.saveDatabase();
            return true;
        }
        return false;
    }
    // --- PHARMACIES ---
    getPharmacies() {
        return [...this.data.pharmacies];
    }
    getPharmacyById(id) {
        return this.data.pharmacies.find(p => p.id === id);
    }
    getNearbyPharmacies(userLat, userLng) {
        let list = [...this.data.pharmacies];
        if (userLat !== undefined && userLng !== undefined) {
            list.sort((a, b) => {
                const distA = Math.hypot(a.latitude - userLat, a.longitude - userLng);
                const distB = Math.hypot(b.latitude - userLat, b.longitude - userLng);
                return distA - distB;
            });
        }
        return list;
    }
    createPharmacy(pharmacy) {
        const newPharm = {
            ...pharmacy,
            id: `pharm-${Date.now()}`,
            medicines: pharmacy.medicines || []
        };
        this.data.pharmacies.unshift(newPharm);
        this.saveDatabase();
        return newPharm;
    }
    updatePharmacy(id, fields) {
        const index = this.data.pharmacies.findIndex(p => p.id === id);
        if (index === -1)
            throw new Error('Pharmacy not found');
        const updated = { ...this.data.pharmacies[index], ...fields };
        this.data.pharmacies[index] = updated;
        this.saveDatabase();
        return updated;
    }
    deletePharmacy(id) {
        const initialLen = this.data.pharmacies.length;
        this.data.pharmacies = this.data.pharmacies.filter(p => p.id !== id);
        if (this.data.pharmacies.length !== initialLen) {
            this.saveDatabase();
            return true;
        }
        return false;
    }
    // --- USERS ---
    getUsers() {
        return [...this.data.users];
    }
    getUserById(id) {
        return this.data.users.find(u => u.id === id);
    }
    getUserByEmail(email) {
        return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    createUser(user) {
        const newUser = {
            ...user,
            id: `usr-${Date.now()}`
        };
        this.data.users.unshift(newUser);
        this.saveDatabase();
        return newUser;
    }
    updateUserStatus(id, status) {
        const index = this.data.users.findIndex(u => u.id === id);
        if (index === -1)
            throw new Error('User not found');
        this.data.users[index].status = status;
        this.saveDatabase();
        return this.data.users[index];
    }
    deleteUser(id) {
        const initialLen = this.data.users.length;
        this.data.users = this.data.users.filter(u => u.id !== id);
        if (this.data.users.length !== initialLen) {
            this.saveDatabase();
            return true;
        }
        return false;
    }
    // --- AVAILABILITY / STOCK ---
    getAvailabilityRecords() {
        const records = [];
        let count = 1;
        this.data.pharmacies.forEach(pharmacy => {
            pharmacy.medicines.forEach(med => {
                records.push({
                    id: `avail-${count++}`,
                    pharmacyId: pharmacy.id,
                    pharmacyName: pharmacy.name,
                    medicineId: med.medicineId,
                    medicineName: med.medicineName,
                    quantity: med.quantity,
                    status: med.status,
                    lastUpdated: med.lastUpdated
                });
            });
        });
        return records;
    }
    updateStock(pharmacyId, medicineId, quantity, status) {
        const today = new Date().toISOString().split('T')[0];
        const pharmacy = this.data.pharmacies.find(p => p.id === pharmacyId);
        if (!pharmacy)
            return false;
        const medIndex = pharmacy.medicines.findIndex(m => m.medicineId === medicineId);
        if (medIndex !== -1) {
            pharmacy.medicines[medIndex].quantity = quantity;
            pharmacy.medicines[medIndex].status = status;
            pharmacy.medicines[medIndex].lastUpdated = today;
        }
        else {
            const medObj = this.data.medicines.find(m => m.id === medicineId);
            pharmacy.medicines.push({
                medicineId,
                medicineName: medObj ? medObj.name : 'Unknown Medicine',
                quantity,
                status,
                lastUpdated: today,
                price: medObj?.price || 50
            });
        }
        this.saveDatabase();
        return true;
    }
    // --- ADMIN STATS ---
    getDashboardStats() {
        let availableCount = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;
        this.data.medicines.forEach(m => {
            if (m.availabilityStatus === 'AVAILABLE')
                availableCount++;
            else if (m.availabilityStatus === 'LOW STOCK')
                lowStockCount++;
            else if (m.availabilityStatus === 'OUT OF STOCK')
                outOfStockCount++;
        });
        return {
            totalMedicines: this.data.medicines.length,
            totalPharmacies: this.data.pharmacies.length,
            totalUsers: this.data.users.length,
            availableMedicines: availableCount,
            lowStockMedicines: lowStockCount,
            outOfStockMedicines: outOfStockCount
        };
    }
    getSearchTrends() {
        return this.data.searchTrends;
    }
    getCategoryStats() {
        return this.data.categoryStats;
    }
    getUserGrowth() {
        return this.data.userGrowth;
    }
    // --- PRESCRIPTIONS ---
    getPrescriptionsByUserId(userId) {
        if (!this.data.prescriptions)
            this.data.prescriptions = [];
        return this.data.prescriptions
            .filter(p => p.userId === userId)
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    }
    getPrescriptionById(id) {
        if (!this.data.prescriptions)
            this.data.prescriptions = [];
        return this.data.prescriptions.find(p => p.id === id);
    }
    createPrescription(prescription) {
        if (!this.data.prescriptions)
            this.data.prescriptions = [];
        const newPrescription = {
            ...prescription,
            id: prescription.id || `presc-${Date.now()}`
        };
        this.data.prescriptions.unshift(newPrescription);
        this.saveDatabase();
        return newPrescription;
    }
    // --- FAVORITE MEDICINES ---
    getFavoritesByUserId(userId) {
        if (!this.data.favorites)
            this.data.favorites = [];
        return this.data.favorites.filter(f => f.userId === userId);
    }
    isFavorite(userId, medicineId) {
        if (!this.data.favorites)
            this.data.favorites = [];
        return this.data.favorites.some(f => f.userId === userId && f.medicineId === medicineId);
    }
    addFavorite(userId, medicineId) {
        if (!this.data.favorites)
            this.data.favorites = [];
        const existing = this.data.favorites.find(f => f.userId === userId && f.medicineId === medicineId);
        if (existing)
            return existing;
        const fav = {
            id: `fav-${Date.now()}`,
            userId,
            medicineId,
            createdAt: new Date().toISOString()
        };
        this.data.favorites.unshift(fav);
        this.saveDatabase();
        return fav;
    }
    removeFavorite(userId, medicineId) {
        if (!this.data.favorites)
            this.data.favorites = [];
        const initialLen = this.data.favorites.length;
        this.data.favorites = this.data.favorites.filter(f => !(f.userId === userId && f.medicineId === medicineId));
        if (this.data.favorites.length !== initialLen) {
            this.saveDatabase();
            return true;
        }
        return false;
    }
    // --- SEARCH HISTORY ---
    getSearchHistoryByUserId(userId) {
        if (!this.data.searchHistory)
            this.data.searchHistory = [];
        return this.data.searchHistory
            .filter(h => h.userId === userId)
            .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime());
    }
    addSearchHistory(userId, searchQuery, medicineId) {
        if (!this.data.searchHistory)
            this.data.searchHistory = [];
        const cleanQuery = searchQuery.trim();
        if (!cleanQuery)
            throw new Error('Search query cannot be empty');
        // Filter out recent duplicate entry for same user and query
        this.data.searchHistory = this.data.searchHistory.filter(h => !(h.userId === userId && h.searchQuery.toLowerCase() === cleanQuery.toLowerCase()));
        const item = {
            id: `sh-${Date.now()}`,
            userId,
            searchQuery: cleanQuery,
            medicineId,
            searchedAt: new Date().toISOString()
        };
        this.data.searchHistory.unshift(item);
        // Keep top 20 searches per user
        if (this.data.searchHistory.length > 100) {
            this.data.searchHistory = this.data.searchHistory.slice(0, 100);
        }
        this.saveDatabase();
        return item;
    }
    clearSearchHistory(userId) {
        if (!this.data.searchHistory)
            this.data.searchHistory = [];
        this.data.searchHistory = this.data.searchHistory.filter(h => h.userId !== userId);
        this.saveDatabase();
        return true;
    }
    // --- MEDICINE REFILL REMINDERS ---
    getRemindersByUserId(userId) {
        if (!this.data.reminders)
            this.data.reminders = [];
        return this.data.reminders
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    getReminderById(id) {
        if (!this.data.reminders)
            this.data.reminders = [];
        return this.data.reminders.find(r => r.id === id);
    }
    createReminder(reminder) {
        if (!this.data.reminders)
            this.data.reminders = [];
        const newRem = {
            ...reminder,
            id: `rem-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        this.data.reminders.unshift(newRem);
        this.saveDatabase();
        return newRem;
    }
    updateReminder(id, userId, fields) {
        if (!this.data.reminders)
            this.data.reminders = [];
        const index = this.data.reminders.findIndex(r => r.id === id && r.userId === userId);
        if (index === -1)
            throw new Error('Reminder not found or unauthorized');
        const updated = { ...this.data.reminders[index], ...fields };
        this.data.reminders[index] = updated;
        this.saveDatabase();
        return updated;
    }
    deleteReminder(id, userId) {
        if (!this.data.reminders)
            this.data.reminders = [];
        const initialLen = this.data.reminders.length;
        this.data.reminders = this.data.reminders.filter(r => !(r.id === id && r.userId === userId));
        if (this.data.reminders.length !== initialLen) {
            this.saveDatabase();
            return true;
        }
        return false;
    }
}
exports.db = new DatabaseManager();
