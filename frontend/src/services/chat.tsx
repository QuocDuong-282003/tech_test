import api from '../api/client';

export interface ChatMessage {
    id: string;
    from: string;
    to: string;
    message: string;
    timestamp: Date;
    isSelf: boolean;
    isRecalled: boolean;
}

export const getChatHistory = (userId: string, otherId: string) => {
    return api.get(`/chat/history/${userId}/${otherId}`);
};
