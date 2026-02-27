import { useState, useCallback } from "react";
import { Platform } from "react-native";

interface UseVoiceInputOptions {
  onTranscription?: (text: string) => void;
  language?: string;
}

export function useVoiceInput(options?: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(async () => {
    if (Platform.OS === "web") {
      setError("Voice input is not available on web. Please use text input.");
      return;
    }

    try {
      setError(null);
      setIsListening(true);
      setTranscript("");
      console.log("Voice input started");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start voice input";
      setError(errorMessage);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      setIsListening(false);
      if (transcript && options?.onTranscription) {
        options.onTranscription(transcript);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop voice input";
      setError(errorMessage);
    }
  }, [transcript, options]);

  const speak = useCallback(
    async (text: string) => {
      try {
        console.log("Speaking:", text);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to speak";
        setError(errorMessage);
      }
    },
    [options?.language]
  );

  const stopSpeaking = useCallback(async () => {
    try {
      console.log("Stopped speaking");
    } catch (err) {
      console.error("Failed to stop speaking:", err);
    }
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
