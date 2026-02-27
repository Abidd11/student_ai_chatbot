import { FlatList, Text, View, TextInput, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRef, useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAIChat } from "@/hooks/use-ai-chat";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function ChatScreen() {
  const colors = useColors();
  const { messages, isLoading, sendMessage, error } = useAIChat();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Add initial greeting message on mount
  useEffect(() => {
    if (messages.length === 0) {
      // Initial greeting is handled by the hook
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const messageText = inputText;
    setInputText("");

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Send message through AI hook
    await sendMessage(messageText);
  };

  const renderMessage = ({ item }: { item: { role: "user" | "assistant"; content: string } }) => {
    const isUser = item.role === "user";
    return (
      <View
        className={`flex-row mb-3 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-xs rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary"
              : "bg-surface border border-border"
          }`}
          style={{
            backgroundColor: isUser ? colors.primary : colors.surface,
            borderColor: isUser ? colors.primary : colors.border,
          }}
        >
          <Text
            className={`text-base ${
              isUser ? "text-white" : "text-foreground"
            }`}
            style={{
              color: isUser ? "#FFFFFF" : colors.foreground,
            }}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isLoading) return null;
    return (
      <View className="flex-row mb-3 justify-start">
        <View
          className="rounded-2xl px-4 py-3 flex-row gap-1"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <View
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: colors.muted }}
          />
          <View
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: colors.muted, animationDelay: "0.1s" }}
          />
          <View
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: colors.muted, animationDelay: "0.2s" }}
          />
        </View>
      </View>
    );
  };

  // Show error if any
  const renderError = () => {
    if (!error) return null;
    return (
      <View className="bg-error bg-opacity-10 border border-error rounded-lg p-3 mb-3">
        <Text className="text-error text-sm" style={{ color: colors.error }}>
          {error}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={100}
    >
      <ScreenContainer className="bg-background flex-1 justify-between">
        {/* Header */}
        <View className="border-b border-border py-4 px-4">
          <Text className="text-2xl font-bold text-foreground">StudyAI</Text>
          <Text className="text-sm text-muted mt-1">
            Your AI Study Assistant
          </Text>
        </View>

        {/* Messages List */}
        {renderError()}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={renderTypingIndicator}
          scrollEnabled={true}
        />

        {/* Input Area */}
        <View
          className="border-t border-border px-4 py-3"
          style={{ backgroundColor: colors.background }}
        >
          <View
            className="flex-row items-center rounded-full px-4 py-2 border border-border"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <TextInput
              className="flex-1 text-foreground text-base"
              placeholder="Ask a question..."
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              style={{ color: colors.foreground, maxHeight: 100 }}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={inputText.trim() === "" || isLoading}
              style={({ pressed }) => ([
                {
                  opacity: pressed ? 0.7 : inputText.trim() === "" || isLoading ? 0.5 : 1,
                },
              ])}
              className="ml-2"
            >
              <MaterialIcons
                name="send"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
