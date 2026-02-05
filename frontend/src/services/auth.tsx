import api from '../api/client';

export const loginEmail = (email: string) => {
    return api.post('/employee/loginEmail', { email });
};

export const validateEmployeeAccessCode = (email: string, accessCode: string) => {
    return api.post('/employee/validateAccessCode', { email, accessCode });
};

export const validateOwnerAccessCode = (phoneNumber: string, accessCode: string) => {
    return api.post('/owner/validateAccessCode', { phoneNumber, accessCode });
};

export const createOwnerAccessCode = (phoneNumber: string) => {
    return api.post('/owner/createNewAccessCode', { phoneNumber });
};
