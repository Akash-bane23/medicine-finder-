import axios from 'axios';
import type { Medicine, Pharmacy, User, AvailabilityRecord, MedicineFilterState, DashboardStats, SearchTrend, CategoryStat, UserGrowth, Prescription, SearchHistoryItem, MedicineReminder } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('medifind_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const medicineService = {
  async getAll(filters?: Partial<MedicineFilterState>): Promise<Medicine[]> {
    try {
      const response = await apiClient.get('/medicines', { params: filters });
      return response.data;
    } catch (err) {
      console.error('Error fetching medicines:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Medicine | undefined> {
    try {
      const response = await apiClient.get(`/medicines/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching medicine ${id}:`, err);
      return undefined;
    }
  },

  async create(medicine: Omit<Medicine, 'id'>): Promise<Medicine> {
    const response = await apiClient.post('/medicines', medicine);
    return response.data;
  },

  async update(id: string, updatedFields: Partial<Medicine>): Promise<Medicine> {
    const response = await apiClient.put(`/medicines/${id}`, updatedFields);
    return response.data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/medicines/${id}`);
    return response.data.success ?? true;
  }
};

export const pharmacyService = {
  async getAll(): Promise<Pharmacy[]> {
    try {
      const response = await apiClient.get('/pharmacies');
      return response.data;
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Pharmacy | undefined> {
    try {
      const response = await apiClient.get(`/pharmacies/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching pharmacy ${id}:`, err);
      return undefined;
    }
  },

  async getNearby(userLat?: number, userLng?: number): Promise<Pharmacy[]> {
    try {
      const response = await apiClient.get('/pharmacies/nearby', {
        params: { lat: userLat, lng: userLng }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching nearby pharmacies:', err);
      return [];
    }
  },

  async create(pharmacy: Omit<Pharmacy, 'id'>): Promise<Pharmacy> {
    const response = await apiClient.post('/pharmacies', pharmacy);
    return response.data;
  },

  async update(id: string, updatedFields: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await apiClient.put(`/pharmacies/${id}`, updatedFields);
    return response.data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/pharmacies/${id}`);
    return response.data.success ?? true;
  }
};

export const userService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  async updateStatus(id: string, status: 'active' | 'blocked' | 'inactive'): Promise<User> {
    const response = await apiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data.success ?? true;
  }
};

export const availabilityService = {
  async getAllRecords(): Promise<AvailabilityRecord[]> {
    try {
      const response = await apiClient.get('/availability');
      return response.data;
    } catch (err) {
      console.error('Error fetching availability records:', err);
      return [];
    }
  },

  async updateStock(pharmacyId: string, medicineId: string, quantity: number, status: 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK'): Promise<boolean> {
    const response = await apiClient.put('/availability', {
      pharmacyId,
      medicineId,
      quantity,
      status
    });
    return response.data.success ?? true;
  }
};

export const adminService = {
  async getDashboardData(): Promise<{
    stats: DashboardStats;
    searchTrends: SearchTrend[];
    categoryStats: CategoryStat[];
    userGrowth: UserGrowth[];
  }> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  }
};

export const authService = {
  async login(email: string, pass: string, role: 'user' | 'admin') {
    const response = await apiClient.post('/auth/login', { email, password: pass, role });
    return response.data;
  },

  async register(name: string, email: string, phone: string, pass: string) {
    const response = await apiClient.post('/auth/register', { fullName: name, email, phone, password: pass });
    return response.data;
  },

  async me() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export const prescriptionService = {
  async uploadPrescription(file: File): Promise<{ success: boolean; message: string; prescription?: Prescription }> {
    const formData = new FormData();
    formData.append('prescription', file);

    const response = await apiClient.post('/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getMyPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await apiClient.get('/prescriptions/my-prescriptions');
      return response.data.prescriptions || [];
    } catch (err) {
      console.error('Error fetching user prescriptions:', err);
      return [];
    }
  },

  getPrescriptionFileUrl(id: string): string {
    return `${API_BASE_URL}/prescriptions/file/${id}`;
  }
};

export const favoriteService = {
  async getFavorites(): Promise<Medicine[]> {
    try {
      const response = await apiClient.get('/favorites');
      return response.data.medicines || [];
    } catch (err) {
      console.error('Error fetching favorites:', err);
      return [];
    }
  },

  async isFavorite(medicineId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/favorites/check/${medicineId}`);
      return Boolean(response.data.isFavorite);
    } catch {
      return false;
    }
  },

  async addFavorite(medicineId: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/favorites', { medicineId });
      return response.data.success;
    } catch {
      return false;
    }
  },

  async removeFavorite(medicineId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/favorites/${medicineId}`);
      return response.data.success;
    } catch {
      return false;
    }
  }
};

export const reminderService = {
  async getReminders(): Promise<MedicineReminder[]> {
    try {
      const response = await apiClient.get('/reminders');
      return response.data.reminders || [];
    } catch (err) {
      console.error('Error fetching reminders:', err);
      return [];
    }
  },

  async createReminder(reminderData: Omit<MedicineReminder, 'id' | 'userId' | 'createdAt'>): Promise<{ success: boolean; reminder?: MedicineReminder; warning?: string; message?: string }> {
    const response = await apiClient.post('/reminders', reminderData);
    return response.data;
  },

  async updateReminder(id: string, fields: Partial<MedicineReminder>): Promise<boolean> {
    try {
      const response = await apiClient.put(`/reminders/${id}`, fields);
      return response.data.success;
    } catch {
      return false;
    }
  },

  async deleteReminder(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/reminders/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  }
};

export const searchHistoryService = {
  async getHistory(): Promise<SearchHistoryItem[]> {
    try {
      const response = await apiClient.get('/search-history');
      return response.data.history || [];
    } catch (err) {
      console.error('Error fetching search history:', err);
      return [];
    }
  },

  async recordSearch(query: string, medicineId?: string): Promise<void> {
    try {
      if (!query.trim()) return;
      await apiClient.post('/search-history', { searchQuery: query, medicineId });
    } catch (err) {
      console.warn('Failed to record search history:', err);
    }
  },

  async clearHistory(): Promise<boolean> {
    try {
      const response = await apiClient.delete('/search-history');
      return response.data.success;
    } catch {
      return false;
    }
  }
};

export const aiService = {
  async ask(question: string): Promise<{ success: boolean; answer: string; disclaimer: string; relatedMedicines?: Medicine[] }> {
    const response = await apiClient.post('/ai/ask', { question });
    return response.data;
  }
};

