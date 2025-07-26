import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatAppProps {
  apiEndpoint: string;
  welcomeMessage?: string;
  errorMessage?: string;
  className?: string;
  headers?: Record<string, string>;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    userMessageColor?: string;
    botMessageColor?: string;
  };
}

export const ChatApp = ({ 
  apiEndpoint,
  welcomeMessage = "Olá! Como posso ajudá-lo hoje?",
  errorMessage = "Desculpe, ocorreu um erro. Tente novamente.",
  className = "",
  headers = {},
  theme = {}
}: ChatAppProps) => {
  const { messages, isLoading, sendMessage, addMessage } = useChat({
    apiEndpoint,
    errorMessage,
    headers
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adiciona mensagem de boas-vindas
    if (messages.length === 0) {
      addMessage({
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date()
      });
    }
  }, [welcomeMessage, addMessage, messages.length]);

  useEffect(() => {
    // Auto scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Aplica tema personalizado se fornecido
  useEffect(() => {
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
    }
    if (theme.backgroundColor) {
      document.documentElement.style.setProperty('--chat-background', theme.backgroundColor);
    }
    if (theme.userMessageColor) {
      document.documentElement.style.setProperty('--chat-user-message', theme.userMessageColor);
    }
    if (theme.botMessageColor) {
      document.documentElement.style.setProperty('--chat-bot-message', theme.botMessageColor);
    }
  }, [theme]);

  return (
    <div className={cn("flex flex-col h-screen bg-chat-background chat-container", className)}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-center">Chat</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <ChatMessage
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-chat-bot-message border border-chat-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};