import { db } from '../config/firebase';
import { Task } from '../models/Task';

export class TaskService {
    private collection = db.collection('tasks');

    // Tạo task mới
    async create(data: Task): Promise<string> {
        const docRef = await this.collection.add(data);
        return docRef.id;
    }

    // Lấy danh sách task theo employeeId
    async getByEmployeeId(employeeId: string): Promise<Task[]> {
        const snapshot = await this.collection
            .where('assignedTo', '==', employeeId)
            .get();

        const tasks: Task[] = [];

        snapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            } as Task);
        });

        return tasks;
    }

    async updateStatus(id: string, status: Task['status']): Promise<void> {
        await this.collection.doc(id).update({
            status
        });
    }

    async getAll(): Promise<Task[]> {
        const snapshot = await this.collection.get();

        const tasks: Task[] = [];

        snapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                ...doc.data()
            } as Task);
        });

        return tasks;
    }
}
