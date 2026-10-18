import type { User } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    fullName: 'Rahul Sharma',
    email: 'user@medifind.com',
    phone: '+91 98765 11223',
    role: 'user',
    createdAt: '2026-08-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    fullName: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98112 33445',
    role: 'user',
    createdAt: '2026-08-20',
    status: 'active'
  },
  {
    id: 'usr-3',
    fullName: 'Vikramaditya Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 97123 44556',
    role: 'user',
    createdAt: '2026-09-01',
    status: 'active'
  },
  {
    id: 'usr-4',
    fullName: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    phone: '+91 96543 22110',
    role: 'user',
    createdAt: '2026-09-10',
    status: 'blocked'
  },
  {
    id: 'usr-5',
    fullName: 'David Miller',
    email: 'david.m@example.com',
    phone: '+91 95432 11009',
    role: 'user',
    createdAt: '2026-09-18',
    status: 'active'
  },
  {
    id: 'admin-1',
    fullName: 'System Administrator',
    email: 'admin@medifind.com',
    phone: '+91 99999 00000',
    role: 'admin',
    createdAt: '2026-01-01',
    status: 'active'
  }
];
