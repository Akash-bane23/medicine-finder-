export type UserRole = 'user' | 'admin' | 'pharmacy';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  status: 'active' | 'blocked' | 'inactive';
  avatar?: string;
  dob?: string;
  passwordHash?: string;
  authProvider?: 'local' | 'google';
  googleId?: string;
  emailVerified?: boolean;
  lastLogin?: string;
}

export interface VerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface LoginAttempt {
  email: string;
  ipAddress: string;
  attemptedAt: string;
  success: boolean;
}

export type AvailabilityStatus = 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  uses: string;
  precautions: string;
  sideEffects: string;
  storage: string;
  prescriptionRequired: boolean;
  availabilityStatus?: AvailabilityStatus;
  price?: number;
  description?: string;
  drugInteractions?: string;
  stockCount?: number;
}

export interface PharmacyMedicine {
  medicineId: string;
  medicineName: string;
  quantity: number;
  status: AvailabilityStatus;
  lastUpdated: string;
  price: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  status: 'Open' | 'Closed';
  distance?: string;
  rating?: number;
  medicines: PharmacyMedicine[];
}

export interface AvailabilityRecord {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  status: AvailabilityStatus;
  lastUpdated: string;
}

export interface DashboardStats {
  totalMedicines: number;
  totalPharmacies: number;
  totalUsers: number;
  availableMedicines: number;
  lowStockMedicines: number;
  outOfStockMedicines: number;
}

export interface SearchTrend {
  month: string;
  searches: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface UserGrowth {
  month: string;
  users: number;
}

export type PrescriptionStatus = 'Uploaded' | 'Under Review' | 'Verified' | 'Rejected';

export interface Prescription {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
  status: PrescriptionStatus;
  notes?: string;
  ocrData?: {
    status?: 'pending' | 'completed' | 'failed';
    extractedMedicines?: string[];
    dosage?: string[];
    frequency?: string[];
    duration?: string[];
    rawText?: string;
  };
}

export interface FavoriteMedicine {
  id: string;
  userId: string;
  medicineId: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  medicineId?: string;
  searchQuery: string;
  searchedAt: string;
}

export type ReminderFrequency = 'Once Daily' | 'Twice Daily' | 'Every 8 Hours' | 'Every 12 Hours' | 'Custom';

export interface MedicineReminder {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: ReminderFrequency;
  reminderTime: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  disclaimer?: string;
  relatedMedicines?: Medicine[];
}


