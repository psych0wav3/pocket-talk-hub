import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatOptions {
  apiEndpoint: string;
  errorMessage?: string;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
}

export const useChat = ({
  apiEndpoint,
  errorMessage = "Desculpe, ocorreu um erro. Tente novamente.",
  onError,
  headers = {}
}: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addMessage = useCallback((message: Omit<ChatMessage, "id">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substring(2)
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    // Adiciona mensagem do usuário
    const userMessage = addMessage({
      text,
      isUser: true,
      timestamp: new Date()
    });

    setIsLoading(true);

    try {
      const sessionId = localStorage.getItem("chatSessionId") || generateSessionId();
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          sessionId,
          // Compatibilidade com n8n
          chatId: sessionId,
          userId: sessionId,
          input: text
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Tenta extrair a resposta de diferentes formatos possíveis do n8n
      const botResponseText = 
        data.response || 
        data.message || 
        data.text || 
        data.output || 
        data.reply || 
        data.answer ||
        JSON.stringify(data);

      addMessage({
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      });

    } catch (error) {
      console.error("Erro no chat:", error);
      
      addMessage({
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      });

      if (onError) {
        onError(error as Error);
      } else {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível enviar sua mensagem.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, headers, errorMessage, onError, toast, addMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const generateSessionId = () => {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("chatSessionId", sessionId);
    return sessionId;
  };

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    clearChat
  };
};