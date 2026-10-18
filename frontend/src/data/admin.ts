import type { DashboardStats, SearchTrend, CategoryStat, UserGrowth } from '../types';

export const mockDashboardStats: DashboardStats = {
  totalMedicines: 1250,
  totalPharmacies: 85,
  totalUsers: 4250,
  availableMedicines: 980,
  lowStockMedicines: 120,
  outOfStockMedicines: 150
};

export const mockSearchTrends: SearchTrend[] = [
  { month: 'Apr', searches: 1200 },
  { month: 'May', searches: 1850 },
  { month: 'Jun', searches: 2400 },
  { month: 'Jul', searches: 3100 },
  { month: 'Aug', searches: 4500 },
  { month: 'Sep', searches: 5800 }
];

export const mockAvailabilityStats = [
  { name: 'Available', value: 980, color: '#10b981' },
  { name: 'Low Stock', value: 120, color: '#f59e0b' },
  { name: 'Out of Stock', value: 150, color: '#ef4444' }
];

export const mockCategoryStats: CategoryStat[] = [
  { category: 'Analgesics / Pain', count: 340 },
  { category: 'Antibiotics', count: 280 },
  { category: 'Anti-Diabetic', count: 210 },
  { category: 'Cardiovascular', count: 190 },
  { category: 'Gastrointestinal', count: 150 },
  { category: 'Antihistamines', count: 80 }
];

export const mockUserGrowth: UserGrowth[] = [
  { month: 'Apr', users: 800 },
  { month: 'May', users: 1400 },
  { month: 'Jun', users: 2100 },
  { month: 'Jul', users: 2900 },
  { month: 'Aug', users: 3600 },
  { month: 'Sep', users: 4250 }
];

export const mockMostSearchedMedicines = [
  { name: 'Paracetamol 500mg', searches: 3420 },
  { name: 'Amoxicillin 500mg', searches: 2890 },
  { name: 'Omeprazole 20mg', searches: 2150 },
  { name: 'Cetirizine 10mg', searches: 1980 },
  { name: 'Metformin 500mg', searches: 1650 },
  { name: 'Azithromycin 500mg', searches: 1420 }
];
