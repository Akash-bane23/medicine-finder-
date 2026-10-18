import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, RegisterData, AuthResponse } from '../types/auth';
import { authService } from '../services/authService';
import { initialUsers } from '../data/users';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  loginUser: (email: string, pass: string, rememberMe?: boolean) => Promise<AuthResponse>;
  loginAdmin: (email: string, pass: string) => Promise<AuthResponse>;
  registerUser: (data: RegisterData) => Promise<AuthResponse>;
  googleAuth: (credential: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUserProfile: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('medifind_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('medifind_role') as UserRole;
    return savedRole || (user ? user.role : null);
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('medifind_user', JSON.stringify(user));
      localStorage.setItem('medifind_role', user.role);
      setRole(user.role);
    } else {
      localStorage.removeItem('medifind_user');
      localStorage.removeItem('medifind_role');
      localStorage.removeItem('medifind_auth_token');
      setRole(null);
    }
    setLoading(false);
  }, [user]);

  const setAuthenticatedSession = (token: string, u: User) => {
    localStorage.setItem('medifind_auth_token', token);
    setUser(u);
    setRole(u.role);
  };

  const loginUser = async (email: string, pass: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Please enter email and password.' };
    }

    try {
      const res = await authService.login({ email: cleanEmail, password: pass, rememberMe, role: 'user' });
      if (res.success && res.token && res.user) {
        setAuthenticatedSession(res.token, res.user);
      }
      return res;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      
      // Local fallback for offline mode
      const existing = initialUsers.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (existing) {
        if (existing.status === 'blocked') {
          return { success: false, message: 'Account is suspended. Please contact support.' };
        }
        const mockUser: User = { ...existing, role: existing.role as UserRole };
        setAuthenticatedSession(`mock_token_${mockUser.id}`, mockUser);
        return { success: true, message: 'Login successful!', user: mockUser, token: `mock_token_${mockUser.id}` };
      }
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const loginAdmin = async (email: string, pass: string): Promise<AuthResponse> => {
    const cleanEmail = email ? email.trim() : '';
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Please enter administrative credentials.' };
    }

    try {
      const res = await authService.login({ email: cleanEmail, password: pass, role: 'admin' });
      if (res.success && res.token && res.user) {
        if (res.user.role !== 'admin') {
          return { success: false, message: 'Access denied. Administrative privileges required.' };
        }
        setAuthenticatedSession(res.token, res.user);
      }
      return res;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      return { success: false, message: 'Invalid admin credentials.' };
    }
  };

  const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const res = await authService.register(data);
      if (res.success && res.token && res.user && !res.requiresVerification) {
        setAuthenticatedSession(res.token, res.user);
      }
      return res;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const googleAuth = async (credential: string): Promise<AuthResponse> => {
    try {
      const res = await authService.googleLogin({ credential });
      if (res.success && res.token && res.user) {
        setAuthenticatedSession(res.token, res.user);
      }
      return res;
    } catch (err: any) {
      if (err.response?.data) return err.response.data;
      return { success: false, message: 'Google authentication failed.' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setRole(null);
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isAdmin: role === 'admin' || user?.role === 'admin',
        loading,
        loginUser,
        loginAdmin,
        registerUser,
        googleAuth,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
