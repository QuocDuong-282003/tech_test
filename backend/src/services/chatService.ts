import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { ChatMessage } from '../models/Chat';

class ChatService {
    // Collection 
    private collection = db.collection('chats');

    async saveMessage(
        from: string,
        to: string,
        message: string
    ): Promise<ChatMessage> {
        const docRef = this.collection.doc();

        const timestamp = new Date();

        //  Firestore
        const data = {
            from,
            to,
            message,
            timestamp: Timestamp.fromDate(timestamp),
            isRecalled: false
        };

        // write data
        await docRef.set(data);


        return {
            id: docRef.id,
            from,
            to,
            message,
            timestamp,
            isRecalled: false
        };
    }

    // recall message
    async recallMessage(messageId: string): Promise<boolean> {
        try {
            await this.collection.doc(messageId).update({
                isRecalled: true
            });
            return true;
        } catch (error) {
            console.error('Error recalling message:', error);
            return false;
        }
    }

    // histori chat 2 user
    async getHistory(
        user1: string,
        user2: string
    ): Promise<ChatMessage[]> {

        // user 2 send user 1
        const sentSnapshot = await this.collection
            .where('from', '==', user1)
            .where('to', '==', user2)
            .get();

        // user 2 send user 1
        const receivedSnapshot = await this.collection
            .where('from', '==', user2)
            .where('to', '==', user1)
            .get();

        const messages: ChatMessage[] = [];

        // sent message
        sentSnapshot.forEach(doc => {
            const data = doc.data();

            messages.push({
                id: doc.id,
                from: data.from,
                to: data.to,
                message: data.message,
                timestamp: (data.timestamp as Timestamp).toDate(),
                isRecalled: data.isRecalled || false
            });
        });

        //received message
        receivedSnapshot.forEach(doc => {
            const data = doc.data();

            messages.push({
                id: doc.id,
                from: data.from,
                to: data.to,
                message: data.message,
                timestamp: (data.timestamp as Timestamp).toDate(),
                isRecalled: data.isRecalled || false
            });
        });

        // sort incream
        return messages.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
    }
}

export const chatService = new ChatService();
