export interface Task {
    id?: string;
    title: string;
    description: string;
    assignedTo: string; // Employee ID
    deadline?: string;
    status: 'pending' | 'in-progress' | 'done';
    createdAt: Date;
}
