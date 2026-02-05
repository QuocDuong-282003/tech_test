import { Router } from 'express';
import { createTask, getTasksByEmployee, updateTaskStatus, getAllTasks } from '../controllers/taskController';

const router = Router();

router.post('/CreateTask', createTask);
router.post('/GetAllTasks', getAllTasks); // Changed to match frontend
router.post('/GetTasks', getTasksByEmployee);
router.post('/UpdateTaskStatus', updateTaskStatus);

export default router;
