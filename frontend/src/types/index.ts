export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';
export type UserRole = 'admin' | 'superadmin';
export type AdminStatus = 'Active' | 'Pending' | 'Suspended';

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

export interface CustomerInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  notes?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  status: AdminStatus;
  createdAt: string;
}

export interface AdminUserInput {
  name: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'admin'>;
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
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

export interface CRMContextType {
  customers: Customer[];
  admins: AdminUser[];
  customersLoading: boolean;
  adminsLoading: boolean;
  customerError: string | null;
  adminError: string | null;
  fetchCustomers: () => Promise<Customer[]>;
  fetchAdmins: () => Promise<AdminUser[]>;
  addCustomer: (input: CustomerInput) => Promise<Customer>;
  updateCustomer: (customerId: string, input: CustomerInput) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<void>;
  getCustomerById: (customerId: string) => Customer | undefined;
  createAdmin: (input: AdminUserInput) => Promise<AdminUser>;
  toggleAdminStatus: (adminId: string) => Promise<AdminUser | null>;
  deleteAdmin: (adminId: string) => Promise<void>;
  clearCustomerError: () => void;
  clearAdminError: () => void;
}
