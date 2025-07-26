# Chat Mobile para React

Este é um componente de chat otimizado para dispositivos móveis, especialmente para uso em WebView de aplicações React Native.

## Características

- ✅ **Mobile-First**: Otimizado para dispositivos móveis
- ✅ **WebView Compatible**: Funciona perfeitamente em WebView do React Native  
- ✅ **n8n Integration**: Compatível com webhooks do n8n
- ✅ **Themes**: Sistema de temas personalizável
- ✅ **TypeScript**: Totalmente tipado
- ✅ **Responsive**: Design responsivo
- ✅ **Acessível**: Suporte a screen readers

## Uso Básico

```tsx
import { ChatApp } from "@/components/Chat/ChatApp";

function App() {
  return (
    <ChatApp 
      apiEndpoint="https://sua-api.com/webhook/chat"
      welcomeMessage="Olá! Como posso ajudá-lo?"
    />
  );
}
```

## Configuração com n8n

Para usar com n8n, configure seu webhook para aceitar o seguinte formato:

### Request Body (enviado pelo chat):
```json
{
  "message": "Pergunta do usuário",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sessionId": "chat_123456789_abc",
  "chatId": "chat_123456789_abc",
  "userId": "chat_123456789_abc", 
  "input": "Pergunta do usuário"
}
```

### Response Body (esperado do n8n):
```json
{
  "response": "Resposta do bot"
}
```

O chat também aceita estas variações de resposta:
- `message`
- `text` 
- `output`
- `reply`
- `answer`

## Temas Disponíveis

```tsx
import { chatThemes } from "@/lib/chatThemes";

// Temas disponíveis: default, blue, green, orange, red, dark
<ChatApp theme={chatThemes.blue} />
```

## Customização de Tema

```tsx
<ChatApp 
  theme={{
    primaryColor: "217 91% 60%",      // Cor principal (HSL)
    backgroundColor: "240 249 255",   // Fundo do chat  
    userMessageColor: "217 91% 60%",  // Cor das mensagens do usuário
    botMessageColor: "0 0% 100%"      // Cor das mensagens do bot
  }}
/>
```

## Headers Personalizados

```tsx
<ChatApp 
  headers={{
    'Authorization': 'Bearer seu-token',
    'X-Custom-Header': 'valor'
  }}
/>
```

## Props do ChatApp

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `apiEndpoint` | string | ✅ | URL do webhook/API |
| `welcomeMessage` | string | ❌ | Mensagem inicial |
| `errorMessage` | string | ❌ | Mensagem de erro |
| `className` | string | ❌ | Classes CSS adicionais |
| `headers` | object | ❌ | Headers HTTP personalizados |
| `theme` | object | ❌ | Configuração de tema |

## Integração com React Native WebView

```jsx
// No seu app React Native
import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'https://seu-chat.com' }}
  style={{ flex: 1 }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
/>
```

## Sessões de Chat

O chat mantém uma sessão através do `localStorage` com chave `chatSessionId`. Isso permite:
- Continuidade da conversa
- Identificação do usuário no webhook
- Histórico persistente (apenas na sessão atual)

## Funcionalidades Mobile

- **Safe Area**: Suporte automático para safe area em dispositivos iOS
- **Touch Friendly**: Botões e áreas de toque otimizadas
- **Keyboard Handling**: Teclado virtual tratado corretamente
- **Scroll Behavior**: Auto-scroll para mensagens novas
- **Loading States**: Indicadores visuais de carregamento

## Exemplo Completo

```tsx
import { ChatApp } from "@/components/Chat/ChatApp";
import { chatThemes } from "@/lib/chatThemes";

function MeuChat() {
  return (
    <div className="h-screen">
      <ChatApp 
        apiEndpoint="https://meu-n8n.com/webhook/chat"
        welcomeMessage="Olá! Sou seu assistente. Como posso ajudar?"
        errorMessage="Ops! Algo deu errado. Tente novamente."
        theme={chatThemes.blue}
        headers={{
          'Authorization': 'Bearer meu-token-secreto',
          'Content-Type': 'application/json'
        }}
        className="custom-chat-styles"
      />
    </div>
  );
}
```