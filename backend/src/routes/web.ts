import { Router } from 'express';
import { loginEmail, validateEmployeeAccessCode, updateProfile }
    from '../controllers/employeeController';
import { createNewAccessCode, validateAccessCode, createEmployee, getEmployee, deleteEmployee, getEmployees, updateEmployee }
    from '../controllers/ownerController';
import * as chatController from '../controllers/chatController';
import { createTask, getTasksByEmployee, updateTaskStatus, getAllTasks } from '../controllers/taskController';

const router = Router();

// empl
router.post('/employee/loginEmail', loginEmail);
router.post('/employee/validateAccessCode', validateEmployeeAccessCode);
router.post('/employee/updateProfile', updateProfile);

// owner
router.post('/owner/createNewAccessCode', createNewAccessCode);
router.post('/owner/validateAccessCode', validateAccessCode);
router.post('/owner/createEmployee', createEmployee);
router.post('/owner/getEmployee', getEmployee);
router.get('/owner/getEmployees', getEmployees);
router.post('/owner/deleteEmployee', deleteEmployee);
router.post('/owner/updateEmployee', updateEmployee);

// task
router.post('/task/createTask', createTask);
router.post('/task/getAllTasks', getAllTasks);
router.post('/task/getTasks', getTasksByEmployee);
router.post('/task/updateTaskStatus', updateTaskStatus);

// chat
router.get('/chat/history/:userId/:otherId', chatController.getHistory);

export default router;