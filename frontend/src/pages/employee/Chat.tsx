import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, Trash2 } from 'lucide-react';
import { getChatHistory, type ChatMessage } from '../../services/chat';

const EmployeeChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const empId = localStorage.getItem('employee_id');
    const ownerId = "OWNER";

    useEffect(() => {
        if (!empId) return;

        // Fetch History
        const fetchHistory = async () => {
            try {
                const res = await getChatHistory(empId, ownerId);
                const history = res.data.messages.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                    isSelf: m.from === empId
                }));
                setMessages(history);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();

        // Socket setup
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);

        newSocket.emit('join', empId);

        // Listeners
        newSocket.on('receiveMessage', (data: any) => {
            setMessages((prev) => [...prev, {
                id: data.id,
                from: data.from,
                to: empId,
                message: data.message,
                timestamp: new Date(data.timestamp),
                isSelf: false,
                isRecalled: data.isRecalled
            }]);
        });

        newSocket.on('messageSentConfirmation', (data: any) => {
            setMessages(prev => prev.map(m =>
                (m.timestamp.getTime() === new Date(data.timestamp).getTime() && m.isSelf)
                    ? { ...m, id: data.id } // Update with real ID from server
                    : m
            ));
        });

        newSocket.on('messageRecalled', (data: { messageId: string }) => {
            setMessages(prev => prev.map(m =>
                m.id === data.messageId ? { ...m, isRecalled: true } : m
            ));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [empId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !socket || !empId) return;

        const msgData = {
            to: ownerId,
            from: empId,
            message: input
        };

        socket.emit('sendMessage', msgData);

        // Optimistic Update
        setMessages((prev) => [...prev, {
            id: 'temp-' + Date.now(), // Temp ID until confirmed
            from: empId,
            to: ownerId,
            message: input,
            timestamp: new Date(),
            isSelf: true,
            isRecalled: false
        }]);

        setInput('');
    };

    const handleRecall = (msgId: string) => {
        if (!socket) return;
        if (confirm('Are you sure you want to recall this message?')) {
            socket.emit('recallMessage', { messageId: msgId, to: ownerId, from: empId });
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sidebar - List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Message</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="p-4 rounded-xl flex items-center space-x-4 cursor-pointer bg-blue-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-blue-900 truncate">Owner</h3>
                            <p className="text-sm text-gray-500 truncate">Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {/* Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Owner</h3>
                        <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-10">Send a message to the Owner</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'} group`}>
                            {/* Message Bubble */}
                            <div className={`relative max-w-[70%] p-4 rounded-2xl ${msg.isSelf
                                ? 'bg-green-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                                }`}>

                                {msg.isRecalled ? (
                                    <p className="italic text-sm opacity-70 border border-current px-2 py-1 rounded">Message recalled</p>
                                ) : (
                                    <p>{msg.message}</p>
                                )}

                                <p className={`text-[10px] mt-1 text-right ${msg.isSelf ? 'text-green-200' : 'text-gray-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>

                                {/* Recall Button (Only for Self and not already recalled) */}
                                {msg.isSelf && !msg.isRecalled && !msg.id.startsWith('temp-') && (
                                    <button
                                        onClick={() => handleRecall(msg.id)}
                                        className="absolute -left-10 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-600"
                                        title="Recall message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Reply message..."
                            className="w-full pl-6 pr-12 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 text-gray-700 placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeChat;
