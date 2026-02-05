import { Router } from 'express';
import { loginEmail, validateEmployeeAccessCode, updateProfile } from '../controllers/employeeController';

const router = Router();

router.post('/LoginEmail', loginEmail);
router.post('/ValidateAccessCode', validateEmployeeAccessCode);
router.post('/UpdateProfile', updateProfile);

export default router;
