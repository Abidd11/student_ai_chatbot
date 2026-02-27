import { useState, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MESSAGES_STORAGE_KEY = "studyai_messages";

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
  const [isInitialized, setIsInitialized] = useState(false);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsInitialized(true);
    }
  };

  const saveMessages = async (newMessages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(newMessages)
      );
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

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
        await saveMessages(updatedMessages);

        // Call AI API
        const response = await sendMessageMutation.mutateAsync({
          messages: updatedMessages,
          subject: options?.subject,
          mode: options?.mode,
        });

        if (response.success) {
          // Add AI response to local state
          const finalMessages: ChatMessage[] = [
            ...updatedMessages,
            {
              role: "assistant" as const,
              content: typeof response.response === "string" ? response.response : "",
            },
          ];
          setMessages(finalMessages);
          await saveMessages(finalMessages);
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

  const clearMessages = useCallback(async () => {
    setMessages([]);
    setError(null);
    try {
      await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isInitialized,
  };
}

export async function clearAllChatHistory() {
  try {
    await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
}
