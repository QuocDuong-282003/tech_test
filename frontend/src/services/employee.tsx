import api from '../api/client';

export const updateProfile = (data: { employeeId: string; name?: string; phone?: string; }) => {
    return api.post('/employee/updateProfile', data);
};
