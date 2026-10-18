export type UserRole = 'user' | 'admin' | 'pharmacy';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'blocked' | 'inactive';
  avatar?: string;
  dob?: string;
  emailVerified?: boolean;
  authProvider?: 'local' | 'google';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: UserRole;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob?: string;
  termsAccepted: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  requiresVerification?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface GoogleAuthPayload {
  credential: string;
}
