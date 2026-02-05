import { Request, Response } from 'express';
import { TaskService } from '../services/taskSerivce';
import { Task } from '../models/Task';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response) => {
    const { title, description, assignedTo, deadline } = req.body;

    try {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'title is required' });
        }

        if (!assignedTo) {
            return res.status(400).json({ error: 'assignedTo is required' });
        }

        const newTask: Task = {
            title: title.trim(),
            description: description ? description.trim() : '',
            assignedTo,
            deadline: deadline || null,
            status: 'pending',
            createdAt: new Date()
        };

        await taskService.create(newTask);

        // console.log('task created', {
        //     title: newTask.title,
        //     assignedTo: newTask.assignedTo
        // });

        return res.status(201).json({
            message: 'task created successfully'
        });
    } catch (err: any) {
        //console.error('create task error', err);
        return res.status(500).json({ error: 'internal server error' });
    }
};

export const getTasksByEmployee = async (req: Request, res: Response) => {
    const { employeeId } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).json({ error: 'employeeId is required' });
        }

        const tasks = await taskService.getByEmployeeId(employeeId);

        return res.json({
            total: tasks.length,
            tasks
        });
    } catch (err: any) {
        // console.error('get tasks by employee error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const getAllTasks = async (_req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAll();

        return res.json({
            total: tasks.length,
            tasks
        });
    } catch (err: any) {
        //  console.error('get all tasks error', err);
        return res.status(500).json({ error: ' server error' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const { taskId, status } = req.body;
    const allowedStatus = ['pending', 'in_progress', 'done'];

    try {
        if (!taskId) {
            return res.status(400).json({ error: 'taskId is required' });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                error: `status must be one of: ${allowedStatus.join(', ')}`
            });
        }

        await taskService.updateStatus(taskId, status);

        // console.log('task status updated', {
        //     taskId,
        //     status
        // });

        return res.json({
            message: 'task status updated'
        });
    } catch (err: any) {
        //  console.error('update task status error', err);
        return res.status(500).json({ error: ' server error' });
    }
};
