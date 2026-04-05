export type UserRole = "admin" | "superadmin";
export type AdminStatus = "Active" | "Pending" | "Suspended";
export type CustomerStatus = "Lead" | "Active" | "InActive";

export interface Customer { 
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  is_active: boolean; 
  notes?: string;
  created_at: string; 
  updated_at: string; 
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
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AdminStatus; // Added to match SuperAdminPanel logic
  is_active: boolean; 
  created_at: string; 
  updated_at: string; 
}

export interface AdminUserInput {
  name: string;
  email: string;
  password?: string; // Optional for updates, required for creation
  role: UserRole;
}

// Ensure AuthUser matches what the login API sends back
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** * Added LoginResponse to fix the import error in authApi.ts
 */
export interface LoginResponse {
  user: AuthUser;
  token: string;
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
  updateCustomer: (
    customerId: string,
    input: CustomerInput,
  ) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<void>;
  getCustomerById: (customerId: string) => Customer | undefined;
  createAdmin: (input: AdminUserInput) => Promise<AdminUser>;
  toggleAdminStatus: (adminId: string) => Promise<AdminUser | null>;
  deleteAdmin: (adminId: string) => Promise<void>;
  clearCustomerError: () => void;
  clearAdminError: () => void;
}