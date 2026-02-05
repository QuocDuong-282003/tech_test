import { db } from '../config/firebase';
import { Employee } from '../models/Employee';
import { NotificationService } from './notificaService';

export class EmployeeService {
    // Collection   firestore
    private collection = db.collection('employees');

    // notifi (email)
    private notificationService = new NotificationService();


    async create(data: Employee): Promise<string> {
        const docRef = await this.collection.add(data);


        const inviteLink = 'http://localhost:5173/employee/login';


        await this.notificationService.sendEmail(
            data.email,
            'Welcome to Skipli - Your Employee Account',
            `
                <h3>Welcome ${data.name}!</h3>
                <p>You have been added to the Skipli workspace.</p>
                <ul>
                    <li><strong>Role:</strong> ${data.role}</li>
                    <li><strong>Department:</strong> ${data.department}</li>
                </ul>
                <p>
                    Please login using your email here:
                    <a href="${inviteLink}">${inviteLink}</a>
                </p>
                <br/>
                <p>Best regards,<br/>Skipli Team</p>
            `
        );


        return docRef.id;
    }


    async getById(id: string): Promise<Employee | null> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data()
        } as Employee;
    }


    async getAll(): Promise<Employee[]> {
        const snapshot = await this.collection.get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Employee));
    }


    async getByEmail(email: string): Promise<Employee | null> {
        const snapshot = await this.collection
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];

        return { id: doc.id, ...doc.data() } as Employee;
    }


    async update(id: string, data: Partial<Employee>): Promise<void> {
        await this.collection.doc(id).update(data);
    }

    // delete 
    async delete(id: string): Promise<void> {
        await this.collection.doc(id).delete();
    }
}
