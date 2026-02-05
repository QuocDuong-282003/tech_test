import api from '../api/client';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    deadline: string;
    assignedTo?: string; // Optional
}

export const getTasksByEmployee = (employeeId: string) => {
    return api.post('/task/getTasks', {
        employeeId,
    });
};

export const updateTaskStatus = (taskId: string, status: 'done' | 'pending') => {
    return api.post('/task/updateTaskStatus', {
        taskId,
        status,
    });
};

export const getAllTasks = () => {
    return api.post('/task/getAllTasks');
};

export const createTask = (data: { title: string; description: string; deadline: string; assignedTo: string }) => {
    return api.post('/task/createTask', data);
};
