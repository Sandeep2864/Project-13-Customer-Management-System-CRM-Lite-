export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';
export type UserRole = 'admin' | 'superadmin';

export interface Customer {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}