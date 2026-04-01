export interface User {
    id: number;
    name: String;
    email: String;
    password: String;
    role: 'admin'| 'superadmin';
    isActive: boolean;
    createAt: Date;
}