import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { EmployeeService } from '../services/employeeService';
import { Employee } from '../models/Employee';
import { NotificationService } from '../services/notificaService';

const authService = new AuthService();
const employeeService = new EmployeeService();
const notificationService = new NotificationService();


export const createNewAccessCode = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    try {
        if (!phoneNumber) {
            return res.status(400).json({ error: 'phone number is required' });
        }

        const code = await authService.createAccessCode(phoneNumber);

        // send sms to user
        await notificationService.sendSMS(
            phoneNumber,
            `your skipli access code is: ${code}`
        );

        // console.log('access code created', { phoneNumber });

        return res.json({ code });
    } catch (err: any) {
        // console.error('create access code error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const validateAccessCode = async (req: Request, res: Response) => {
    const { phoneNumber, accessCode } = req.body;

    try {
        if (!phoneNumber || !accessCode) {
            return res.status(400).json({ error: 'phoneNumber and accessCode are required' });
        }

        const isValid = await authService.validateAccessCode(phoneNumber, accessCode);

        if (!isValid) {
            return res.status(400).json({ error: 'invalid access code' });
        }

        //console.log('access code validated', { phoneNumber });

        return res.json({ success: true });
    } catch (err: any) {
        //console.error('validate access code error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    const { name, email, department, role, phone, workSchedule } = req.body;

    try {
        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }

        const newEmployee: Employee = {
            name: name.trim(),
            email: email.trim(),
            department,
            role: role || 'Employee',
            phone: phone || '',
            status: 'Active',
            createdAt: new Date(),
            workSchedule: workSchedule || null
        };

        const employeeId = await employeeService.create(newEmployee);

        // send welcome email
        await notificationService.sendEmail(
            email,
            'welcome to skipli',
            'your account has been created. please contact your administrator for login details.'
        );

        // console.log('employee created', {
        //     employeeId,
        //     email
        // });

        return res.json({ success: true, employeeId });
    } catch (err: any) {
        // console.error('create employee error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const getEmployee = async (req: Request, res: Response) => {
    const { employeeId } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }

        const employee = await employeeService.getById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: 'employee not found' });
        }

        return res.json(employee);
    } catch (err: any) {
        //      console.error('get employee error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const getEmployees = async (_req: Request, res: Response) => {
    try {
        const employees = await employeeService.getAll();

        return res.json({
            total: employees.length,
            employees
        });
    } catch (err: any) {
        //console.error('get employees error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const { employeeId } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }

        await employeeService.delete(employeeId);

        // console.log('employee deleted', { employeeId });

        return res.json({ success: true });
    } catch (err: any) {
        console.error('delete employee error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    const { employeeId, name, email, department, role, phone, status, workSchedule } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }

        const updateData: any = {
            name,
            email,
            department,
            role,
            phone,
            status,
            workSchedule
        };

        // remove undefined fields before update
        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        // force logout if employee is disabled
        if (status && status !== 'Active') {
            const { io } = require('../server');
            io.to(employeeId).emit('forceLogout', { reason: status });

            console.log('employee forced logout', {
                employeeId,
                reason: status
            });
        }

        await employeeService.update(employeeId, updateData);

        console.log('employee updated', {
            employeeId,
            updateData
        });

        return res.json({ success: true });
    } catch (err: any) {
        console.error('update employee error', err);
        return res.status(500).json({ error: ' server error' });
    }
};
