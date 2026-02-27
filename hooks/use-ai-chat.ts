import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseAIChatOptions {
  subject?: string;
  mode?: "general" | "homework" | "exam" | "doubt";
}

export function useAIChat(options?: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsLoading(true);

      try {
      // Add user message to local state
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { role: "user" as const, content: userMessage },
      ];
        setMessages(updatedMessages);

        // Call AI API
        const response = await sendMessageMutation.mutateAsync({
          messages: updatedMessages,
          subject: options?.subject,
          mode: options?.mode,
        });

        if (response.success) {
          // Add AI response to local state
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant" as const,
              content: typeof response.response === "string" ? response.response : "",
            },
          ]);
        } else {
          setError(response.error || "Failed to get response");
          // Remove the user message if AI failed
          setMessages(messages);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        // Remove the user message if request failed
        setMessages(messages);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options, sendMessageMutation]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
