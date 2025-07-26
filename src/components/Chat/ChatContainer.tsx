import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  apiEndpoint?: string;
  welcomeMessage?: string;
  errorMessage?: string;
  className?: string;
}

export const ChatContainer = ({ 
  apiEndpoint = "/api/chat", 
  welcomeMessage = "Olá! Como posso ajudá-lo hoje?",
  errorMessage = "Desculpe, ocorreu um erro. Tente novamente.",
  className = ""
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Adiciona mensagem de boas-vindas
    setMessages([{
      id: "welcome",
      text: welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [welcomeMessage]);

  useEffect(() => {
    // Auto scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Compatível com webhook do n8n
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          sessionId: localStorage.getItem("chatSessionId") || generateSessionId()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Adapta resposta do n8n (pode vir como 'response', 'message', ou 'text')
      const botResponseText = data.response || data.message || data.text || data.output || errorMessage;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorBotMessage]);
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível enviar sua mensagem. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSessionId = () => {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("chatSessionId", sessionId);
    return sessionId;
  };

  return (
    <div className={`flex flex-col h-screen bg-chat-background ${className}`}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-center">Chat</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
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