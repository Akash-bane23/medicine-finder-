import fs from 'fs';
import path from 'path';
import { Medicine, Pharmacy, User, AvailabilityRecord, DashboardStats, SearchTrend, CategoryStat, UserGrowth, Prescription, FavoriteMedicine, SearchHistoryItem, MedicineReminder } from '../types';
import { initialMedicines, initialPharmacies, initialUsers, searchTrends, categoryStats, userGrowth } from './initialData';

interface DatabaseSchema {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  users: User[];
  searchTrends: SearchTrend[];
  categoryStats: CategoryStat[];
  userGrowth: UserGrowth[];
  prescriptions?: Prescription[];
  favorites?: FavoriteMedicine[];
  searchHistory?: SearchHistoryItem[];
  reminders?: MedicineReminder[];
}

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading db.json, re-initializing with seed data:', err);
      }
    }

    const defaultData: DatabaseSchema = {
      medicines: [...initialMedicines],
      pharmacies: [...initialPharmacies],
      users: [...initialUsers],
      searchTrends: [...searchTrends],
      categoryStats: [...categoryStats],
      userGrowth: [...userGrowth],
      prescriptions: [],
      favorites: [],
      searchHistory: [],
      reminders: []
    };

    this.saveDatabase(defaultData);
    return defaultData;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- MEDICINES ---
  public getMedicines(filters?: {
    searchQuery?: string;
    category?: string;
    brand?: string;
    dosageForm?: string;
    prescriptionRequired?: string;
    availability?: string;
  }): Medicine[] {
    let result = [...this.data.medicines];

    if (!filters) return result;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.brandName.toLowerCase().includes(q) ||
          m.uses.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(m => m.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }

    if (filters.brand) {
      result = result.filter(m => m.brandName.toLowerCase().includes(filters.brand!.toLowerCase()));
    }

    if (filters.dosageForm) {
      result = result.filter(m => m.dosageForm.toLowerCase() === filters.dosageForm!.toLowerCase());
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

  public getMedicineById(id: string): Medicine | undefined {
    return this.data.medicines.find(m => m.id === id);
  }

  public createMedicine(medicine: Omit<Medicine, 'id'>): Medicine {
    const newMed: Medicine = {
      ...medicine,
      id: `med-${Date.now()}`
    };
    this.data.medicines.unshift(newMed);
    this.saveDatabase();
    return newMed;
  }

  public updateMedicine(id: string, fields: Partial<Medicine>): Medicine {
    const index = this.data.medicines.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Medicine not found');

    const updated = { ...this.data.medicines[index], ...fields };
    this.data.medicines[index] = updated;
    this.saveDatabase();
    return updated;
  }

  public deleteMedicine(id: string): boolean {
    const initialLen = this.data.medicines.length;
    this.data.medicines = this.data.medicines.filter(m => m.id !== id);
    if (this.data.medicines.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- PHARMACIES ---
  public getPharmacies(): Pharmacy[] {
    return [...this.data.pharmacies];
  }

  public getPharmacyById(id: string): Pharmacy | undefined {
    return this.data.pharmacies.find(p => p.id === id);
  }

  public getNearbyPharmacies(userLat?: number, userLng?: number): Pharmacy[] {
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

  public createPharmacy(pharmacy: Omit<Pharmacy, 'id'>): Pharmacy {
    const newPharm: Pharmacy = {
      ...pharmacy,
      id: `pharm-${Date.now()}`,
      medicines: pharmacy.medicines || []
    };
    this.data.pharmacies.unshift(newPharm);
    this.saveDatabase();
    return newPharm;
  }

  public updatePharmacy(id: string, fields: Partial<Pharmacy>): Pharmacy {
    const index = this.data.pharmacies.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pharmacy not found');

    const updated = { ...this.data.pharmacies[index], ...fields };
    this.data.pharmacies[index] = updated;
    this.saveDatabase();
    return updated;
  }

  public deletePharmacy(id: string): boolean {
    const initialLen = this.data.pharmacies.length;
    this.data.pharmacies = this.data.pharmacies.filter(p => p.id !== id);
    if (this.data.pharmacies.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- USERS ---
  public getUsers(): User[] {
    return [...this.data.users];
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`
    };
    this.data.users.unshift(newUser);
    this.saveDatabase();
    return newUser;
  }

  public updateUserStatus(id: string, status: 'active' | 'blocked' | 'inactive'): User {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    this.data.users[index].status = status;
    this.saveDatabase();
    return this.data.users[index];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- AVAILABILITY / STOCK ---
  public getAvailabilityRecords(): AvailabilityRecord[] {
    const records: AvailabilityRecord[] = [];
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

  public updateStock(pharmacyId: string, medicineId: string, quantity: number, status: 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK'): boolean {
    const today = new Date().toISOString().split('T')[0];
    const pharmacy = this.data.pharmacies.find(p => p.id === pharmacyId);
    if (!pharmacy) return false;

    const medIndex = pharmacy.medicines.findIndex(m => m.medicineId === medicineId);
    if (medIndex !== -1) {
      pharmacy.medicines[medIndex].quantity = quantity;
      pharmacy.medicines[medIndex].status = status;
      pharmacy.medicines[medIndex].lastUpdated = today;
    } else {
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
  public getDashboardStats(): DashboardStats {
    let availableCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    this.data.medicines.forEach(m => {
      if (m.availabilityStatus === 'AVAILABLE') availableCount++;
      else if (m.availabilityStatus === 'LOW STOCK') lowStockCount++;
      else if (m.availabilityStatus === 'OUT OF STOCK') outOfStockCount++;
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

  public getSearchTrends(): SearchTrend[] {
    return this.data.searchTrends;
  }

  public getCategoryStats(): CategoryStat[] {
    return this.data.categoryStats;
  }

  public getUserGrowth(): UserGrowth[] {
    return this.data.userGrowth;
  }

  // --- PRESCRIPTIONS ---
  public getPrescriptionsByUserId(userId: string): Prescription[] {
    if (!this.data.prescriptions) this.data.prescriptions = [];
    return this.data.prescriptions
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  public getPrescriptionById(id: string): Prescription | undefined {
    if (!this.data.prescriptions) this.data.prescriptions = [];
    return this.data.prescriptions.find(p => p.id === id);
  }

  public createPrescription(prescription: Omit<Prescription, 'id'> & { id?: string }): Prescription {
    if (!this.data.prescriptions) this.data.prescriptions = [];
    const newPrescription: Prescription = {
      ...prescription,
      id: prescription.id || `presc-${Date.now()}`
    };
    this.data.prescriptions.unshift(newPrescription);
    this.saveDatabase();
    return newPrescription;
  }

  // --- FAVORITE MEDICINES ---
  public getFavoritesByUserId(userId: string): FavoriteMedicine[] {
    if (!this.data.favorites) this.data.favorites = [];
    return this.data.favorites.filter(f => f.userId === userId);
  }

  public isFavorite(userId: string, medicineId: string): boolean {
    if (!this.data.favorites) this.data.favorites = [];
    return this.data.favorites.some(f => f.userId === userId && f.medicineId === medicineId);
  }

  public addFavorite(userId: string, medicineId: string): FavoriteMedicine {
    if (!this.data.favorites) this.data.favorites = [];
    const existing = this.data.favorites.find(f => f.userId === userId && f.medicineId === medicineId);
    if (existing) return existing;

    const fav: FavoriteMedicine = {
      id: `fav-${Date.now()}`,
      userId,
      medicineId,
      createdAt: new Date().toISOString()
    };
    this.data.favorites.unshift(fav);
    this.saveDatabase();
    return fav;
  }

  public removeFavorite(userId: string, medicineId: string): boolean {
    if (!this.data.favorites) this.data.favorites = [];
    const initialLen = this.data.favorites.length;
    this.data.favorites = this.data.favorites.filter(f => !(f.userId === userId && f.medicineId === medicineId));
    if (this.data.favorites.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- SEARCH HISTORY ---
  public getSearchHistoryByUserId(userId: string): SearchHistoryItem[] {
    if (!this.data.searchHistory) this.data.searchHistory = [];
    return this.data.searchHistory
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime());
  }

  public addSearchHistory(userId: string, searchQuery: string, medicineId?: string): SearchHistoryItem {
    if (!this.data.searchHistory) this.data.searchHistory = [];
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) throw new Error('Search query cannot be empty');

    // Filter out recent duplicate entry for same user and query
    this.data.searchHistory = this.data.searchHistory.filter(
      h => !(h.userId === userId && h.searchQuery.toLowerCase() === cleanQuery.toLowerCase())
    );

    const item: SearchHistoryItem = {
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

  public clearSearchHistory(userId: string): boolean {
    if (!this.data.searchHistory) this.data.searchHistory = [];
    this.data.searchHistory = this.data.searchHistory.filter(h => h.userId !== userId);
    this.saveDatabase();
    return true;
  }

  // --- MEDICINE REFILL REMINDERS ---
  public getRemindersByUserId(userId: string): MedicineReminder[] {
    if (!this.data.reminders) this.data.reminders = [];
    return this.data.reminders
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReminderById(id: string): MedicineReminder | undefined {
    if (!this.data.reminders) this.data.reminders = [];
    return this.data.reminders.find(r => r.id === id);
  }

  public createReminder(reminder: Omit<MedicineReminder, 'id' | 'createdAt'>): MedicineReminder {
    if (!this.data.reminders) this.data.reminders = [];
    const newRem: MedicineReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.reminders.unshift(newRem);
    this.saveDatabase();
    return newRem;
  }

  public updateReminder(id: string, userId: string, fields: Partial<MedicineReminder>): MedicineReminder {
    if (!this.data.reminders) this.data.reminders = [];
    const index = this.data.reminders.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) throw new Error('Reminder not found or unauthorized');

    const updated = { ...this.data.reminders[index], ...fields };
    this.data.reminders[index] = updated;
    this.saveDatabase();
    return updated;
  }

  public deleteReminder(id: string, userId: string): boolean {
    if (!this.data.reminders) this.data.reminders = [];
    const initialLen = this.data.reminders.length;
    this.data.reminders = this.data.reminders.filter(r => !(r.id === id && r.userId === userId));
    if (this.data.reminders.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }
}

export const db = new DatabaseManager();
