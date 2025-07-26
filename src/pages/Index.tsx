import { ChatApp } from "@/components/Chat/ChatApp";
import { chatThemes } from "@/lib/chatThemes";

const Index = () => {
  return (
    <div className="h-screen">
      <ChatApp 
        apiEndpoint="https://seu-webhook-n8n.com/webhook/chat"
        welcomeMessage="Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?"
        errorMessage="Desculpe, não consegui processar sua mensagem. Tente novamente em alguns instantes."
        theme={chatThemes.default}
        headers={{
          'Authorization': 'Bearer seu-token-aqui',
          'X-Custom-Header': 'valor-personalizado'
        }}
      />
    </div>
  );
};

export default Index;
