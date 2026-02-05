import api from '../api/client';

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    department?: string;
    status?: 'Active' | 'Inactive' | 'Pending';
}

export const getEmployees = () => {
    return api.get('/owner/getEmployees');
};

export const createEmployee = (data: Partial<Employee>) => {
    return api.post('/owner/createEmployee', data);
};

export const updateEmployee = (data: Partial<Employee> & { employeeId: string }) => {
    return api.post('/owner/updateEmployee', data);
};

export const deleteEmployee = (employeeId: string) => {
    return api.post('/owner/deleteEmployee', { employeeId });
};
