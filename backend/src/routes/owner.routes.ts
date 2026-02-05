import { Router } from 'express';
import { createNewAccessCode, validateAccessCode, createEmployee, getEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/ownerController';

const router = Router();

router.post('/CreateNewAccessCode', createNewAccessCode);
router.post('/ValidateAccessCode', validateAccessCode);
router.post('/CreateEmployee', createEmployee);
router.post('/GetEmployee', getEmployee);
router.get('/GetEmployees', getEmployees); // Using GET for list
router.post('/DeleteEmployee', deleteEmployee);
router.post('/UpdateEmployee', updateEmployee);

export default router;
