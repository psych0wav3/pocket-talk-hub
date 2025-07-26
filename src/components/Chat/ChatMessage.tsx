import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-chat-user-message text-white rounded-br-md"
            : "bg-chat-bot-message text-foreground border border-chat-border rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};