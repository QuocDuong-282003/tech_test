export interface ChatMessage {
    id?: string;
    from: string;
    to: string;
    message: string;
    timestamp: Date;
    isRecalled: boolean;
}
