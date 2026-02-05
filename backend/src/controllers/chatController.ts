import { Request, Response } from 'express';
import { chatService } from '../services/chatService';


export const getHistory = async (req: Request, res: Response) => {
    const { userId, otherId } = req.params;

    try {
        // validate 
        if (!userId || !otherId) {
            return res.status(400).json({
                error: 'userId and otherId are required'
            });
        }

        if (typeof userId !== 'string' || typeof otherId !== 'string') {
            return res.status(400).json({
                error: 'userId or otherId is not a valid string'
            });
        }

        if (userId === otherId) {
            return res.status(400).json({
                error: 'cannot get chat history with the same user'
            });
        }

        const messages = await chatService.getHistory(userId, otherId);

        // console.log('chat history fetched successfully', {
        //     fromUser: userId,
        //     toUser: otherId,
        //     totalMessages: messages.length
        // });

        return res.json({
            total: messages.length,
            messages: messages
        });
    } catch (err: any) {
        console.error('error while fetching chat history', err);
        return res.status(500).json({
            error: ' server error'
        });
    }
};
