import { Server, Socket } from 'socket.io';
import { chatService } from '../services/chatService';

export class ChatSocket {
    constructor(private io: Server) {
        this.initialize();
    }

    private initialize() {
        this.io.on('connection', (socket: Socket) => {
            console.log('user connected', socket.id);

            // user join room theo userId
            socket.on('join', (userId: string) => {
                if (!userId) return;

                socket.join(userId);
                console.log('socket joined room', {
                    socketId: socket.id,
                    userId
                });
            });

            // gửi tin nhắn
            socket.on('sendMessage', async (data) => {
                try {
                    const { from, to, message } = data;

                    if (!from || !to || !message) return;

                    const savedMessage = await chatService.saveMessage(
                        from,
                        to,
                        message
                    );

                    // gửi cho người nhận
                    this.io.to(to).emit('receiveMessage', savedMessage);

                    // confirm cho người gửi
                    this.io.to(from).emit(
                        'messageSentConfirmation',
                        savedMessage
                    );
                } catch (error) {
                    console.error('send message error', error);
                }
            });

            // thu hồi tin nhắn
            socket.on('recallMessage', async (data) => {
                try {
                    const { messageId, from, to } = data;

                    if (!messageId || !from || !to) return;

                    const success = await chatService.recallMessage(messageId);

                    if (!success) return;


                    this.io.to(to).emit('messageRecalled', { messageId });
                    this.io.to(from).emit('messageRecalled', { messageId });
                } catch (error) {
                    console.error('recall message error', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('user disconnected', socket.id);
            });
        });
    }
}
