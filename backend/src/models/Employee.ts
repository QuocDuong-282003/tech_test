export interface Employee {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    role: string; // 'Owner' | 'Employee'
    status?: 'Active' | 'Inactive' | 'Pending';
    createdAt: Date;
}
