import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import webRoutes from './routes/web';
import { ChatSocket } from './sockets/chat.socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
});

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', webRoutes);

app.get('/', (req, res) => {
    res.send('Employee Task Management API Running');
});

// Initialize Socket Controller
new ChatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
