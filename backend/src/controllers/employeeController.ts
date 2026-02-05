import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { EmployeeService } from '../services/employeeService';
import { NotificationService } from '../services/notificaService';

const authService = new AuthService();
const employeeService = new EmployeeService();
const notificationService = new NotificationService();


export const loginEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }

        const employee = await employeeService.getByEmail(email);

        if (!employee) {
            return res.status(404).json({ error: 'employee not found' });
        }

        if (employee.status === 'Inactive') {
            return res.status(403).json({
                error: 'tài khoản bạn đang bị vô hiệu hóa. vui lòng liên hệ admin để được hỗ trợ'
            });
        }

        if (employee.status === 'Pending') {
            return res.status(403).json({
                error: 'tài khoản đang chờ duyệt. vui lòng liên hệ admin để được hỗ trợ'
            });
        }

        const code = await authService.createAccessCode(email);

        // send login code  email
        await notificationService.sendEmail(
            email,
            'your skipli login code',
            `
                <h3>welcome back ${employee.name}!</h3>
                <p>you requested a login code for skipli workspace.</p>
                <ul>
                    <li><strong>role:</strong> ${employee.role}</li>
                    <li><strong>department:</strong> ${employee.department}</li>
                    <br/>
                    <li>
                        <strong>login code:</strong>
                        <span style="font-size: 24px; font-weight: bold; color: #16a34a;">
                            ${code}
                        </span>
                    </li>
                </ul>
                <p>this code expires in 5 minutes.</p>
                <br/>
                <p>best regards,<br/>skipli team</p>
            `
        );

        //  console.log('login code sent', { email });

        return res.json({ success: true });
    } catch (err: any) {
        console.error('login email error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const validateEmployeeAccessCode = async (req: Request, res: Response) => {
    const { email, accessCode } = req.body;

    try {
        if (!email || !accessCode) {
            return res.status(400).json({
                error: 'email and accessCode are required'
            });
        }

        const isValid = await authService.validateAccessCode(email, accessCode);

        if (!isValid) {
            return res.status(400).json({ error: 'invalid code' });
        }

        const employee = await employeeService.getByEmail(email);

        if (!employee) {
            return res.status(404).json({ error: 'employee record missing' });
        }

        if (employee.status === 'Inactive') {
            return res.status(403).json({
                error: 'tài khoản bạn đang bị vô hiệu hóa. vui lòng liên hệ admin để được hỗ trợ'
            });
        }

        if (employee.status === 'Pending') {
            return res.status(403).json({
                error: 'tài khoản đang chờ duyệt. vui lòng liên hệ admin để được hỗ trợ'
            });
        }

        console.log('login code validated', {
            email,
            employeeId: employee.id
        });

        return res.json({
            success: true,
            employee
        });
    } catch (err: any) {
        console.error('validate access code error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { employeeId, ...updates } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }

        // remove undefined field
        Object.keys(updates).forEach(
            key => updates[key] === undefined && delete updates[key]
        );

        await employeeService.update(employeeId, updates);

        // console.log('employee profile updated', {
        //     employeeId,
        //     updates
        // });

        return res.json({ success: true });
    } catch (err: any) {
        console.error('update profile error', err);
        return res.status(500).json({ error: ' server error' });
    }
};
