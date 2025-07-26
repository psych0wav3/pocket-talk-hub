import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-chat-border bg-chat-input-background p-4 safe-area-inset-bottom">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={disabled || isLoading}
            className={cn(
              "min-h-[44px] max-h-[120px] resize-none border-chat-border focus:ring-2 focus:ring-primary focus:border-transparent bg-chat-input-background text-sm",
              "placeholder:text-muted-foreground"
            )}
            rows={1}
          />
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          size="icon"
          className={cn(
            "h-[44px] w-[44px] rounded-full transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-95 hover:scale-105"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};