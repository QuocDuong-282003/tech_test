import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getEmployees, type Employee } from '../../services/owner';
import { getChatHistory, type ChatMessage } from '../../services/chat';
import { Search, Send, User, Trash2 } from 'lucide-react';

const OwnerChat = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [activeChat, setActiveChat] = useState<Employee | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    // Owner ID
    const ownerId = "OWNER";

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Socket connection
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);

        newSocket.emit('join', ownerId);

        newSocket.on('receiveMessage', (data: any) => {
            setMessages((prev) => {
                return [...prev, {
                    id: data.id,
                    from: data.from,
                    to: ownerId,
                    message: data.message,
                    timestamp: new Date(data.timestamp),
                    isSelf: false,
                    isRecalled: data.isRecalled
                }];
            });
        });

        newSocket.on('messageSentConfirmation', (data: any) => {
            setMessages(prev => prev.map(m =>
                (m.timestamp.getTime() === new Date(data.timestamp).getTime() && m.isSelf)
                    ? { ...m, id: data.id }
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
    }, []); // Only connect once

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch history when active chat changes
    useEffect(() => {
        if (!activeChat) return;
        setMessages([]); // Clear previous

        const fetchHistory = async () => {
            try {
                const res = await getChatHistory(ownerId, activeChat.id);
                const history = res.data.messages.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                    isSelf: m.from === ownerId
                }));
                // We overwrite messages here
                setMessages(history);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };

        fetchHistory();

    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeChat || !socket) return;

        const msgData = {
            to: activeChat.id,
            from: ownerId,
            message: input
        };

        socket.emit('sendMessage', msgData);

        setMessages((prev) => [...prev, {
            id: 'temp-' + Date.now(),
            from: ownerId,
            to: activeChat.id,
            message: input,
            timestamp: new Date(),
            isSelf: true,
            isRecalled: false
        }]);

        setInput('');
    };

    const handleRecall = (msgId: string) => {
        if (!socket || !activeChat) return;
        if (confirm('Are you sure you want to recall this message?')) {
            socket.emit('recallMessage', { messageId: msgId, to: activeChat.id, from: ownerId });
        }
    };


    const displayMessages = activeChat
        ? messages.filter(m => m.from === activeChat.id || m.to === activeChat.id)
        : [];

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sidebar - List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">All Message</h2>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-gray-700"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {employees.map(emp => (
                        <div
                            key={emp.id}
                            onClick={() => setActiveChat(emp)}
                            className={`p-4 rounded-xl flex items-center space-x-4 cursor-pointer transition-colors ${activeChat?.id === emp.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-semibold truncate ${activeChat?.id === emp.id ? 'text-blue-900' : 'text-gray-900'}`}>{emp.name}</h3>
                                    <span className="text-xs text-gray-400">12:30</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {emp.department} • {emp.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{activeChat.name}</h3>
                                <span className="text-xs text-green-500 font-medium">Online</span>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {displayMessages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10">Start a conversation with {activeChat.name}</div>
                            )}
                            {displayMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'} group`}>
                                    <div className={`relative max-w-[70%] p-4 rounded-2xl ${msg.isSelf
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                                        }`}>

                                        {msg.isRecalled ? (
                                            <p className="italic text-sm opacity-70 border border-current px-2 py-1 rounded">Message recalled</p>
                                        ) : (
                                            <p>{msg.message}</p>
                                        )}

                                        <p className={`text-[10px] mt-1 text-right ${msg.isSelf ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>

                                        {/* Recall Button */}
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

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Reply message..."
                                    className="w-full pl-6 pr-12 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-10 h-10 transform -rotate-45 mb-1 mr-1" />
                        </div>
                        <p className="text-lg font-medium">Select an employee to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerChat;
