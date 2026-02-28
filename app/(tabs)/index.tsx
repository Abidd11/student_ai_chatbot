import {
  FlatList,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  ScrollView,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAIChat } from "@/hooks/use-ai-chat";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { MaterialDialog } from "@/components/ui/material-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUBJECTS = [
  { id: "math", label: "Math", icon: "calculate" },
  { id: "science", label: "Science", icon: "science" },
  { id: "physics", label: "Physics", icon: "bolt" },
  { id: "chemistry", label: "Chemistry", icon: "local-fire-department" },
  { id: "biology", label: "Biology", icon: "eco" },
  { id: "english", label: "English", icon: "language" },
  { id: "history", label: "History", icon: "history" },
  { id: "geography", label: "Geography", icon: "public" },
  { id: "islamic", label: "Islamic", icon: "menu-book" },
];

const WHATSAPP_DIALOG_KEY = "studyai_whatsapp_shown";

export default function ChatScreen() {
  const colors = useColors();
  const { messages, isLoading, sendMessage, error, clearMessages } = useAIChat();
  const [inputText, setInputText] = useState("");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // Check if WhatsApp dialog has been shown before
  useEffect(() => {
    checkWhatsAppDialog();
  }, []);

  const checkWhatsAppDialog = async () => {
    try {
      const shown = await AsyncStorage.getItem(WHATSAPP_DIALOG_KEY);
      if (!shown) {
        setShowWhatsAppDialog(true);
      }
    } catch (error) {
      console.error("Failed to check WhatsApp dialog:", error);
    }
  };

  const handleWhatsAppDialogClose = async () => {
    try {
      await AsyncStorage.setItem(WHATSAPP_DIALOG_KEY, "true");
      setShowWhatsAppDialog(false);
    } catch (error) {
      console.error("Failed to save WhatsApp dialog state:", error);
    }
  };

  const handleOpenWhatsApp = async () => {
    try {
      await handleWhatsAppDialogClose();
      // Open WhatsApp link - you can replace with actual WhatsApp group link
      const whatsappLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK"; // Replace with actual link
      // For now, we'll just close the dialog
    } catch (error) {
      console.error("Failed to open WhatsApp:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const messageText = inputText;
    setInputText("");

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Send message through AI hook with selected subject
    await sendMessage(messageText);
  };

  const handleCopyMessage = (content: string) => {
    setCopiedMessage(content);
    setShowCopyDialog(true);
  };

  const confirmCopy = async () => {
    try {
      await Clipboard.setStringAsync(copiedMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowCopyDialog(false);
      setCopiedMessage("");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShareMessage = async (content: string) => {
    try {
      await Share.share({
        message: content,
        title: "StudyAI Message",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: { role: "user" | "assistant"; content: string };
    index: number;
  }) => {
    const isUser = item.role === "user";
    const isSelected = selectedMessageIndex === index;

    return (
      <Pressable
        onLongPress={() => setSelectedMessageIndex(isSelected ? null : index)}
        onPress={() => setSelectedMessageIndex(null)}
        style={{ opacity: 1 }}
      >
        <View
          className={`flex-row mb-4 px-4 ${isUser ? "justify-end" : "justify-start"}`}
        >
          <View
            className={`max-w-xs rounded-3xl px-5 py-3 ${
              isUser ? "bg-primary" : "bg-surface border border-border"
            }`}
            style={{
              backgroundColor: isUser ? colors.primary : colors.surface,
              borderColor: isUser ? colors.primary : colors.border,
              shadowColor: colors.foreground,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text
              className={`text-base leading-relaxed ${
                isUser ? "text-white" : "text-foreground"
              }`}
              style={{
                color: isUser ? "#FFFFFF" : colors.foreground,
              }}
            >
              {item.content}
            </Text>

            {/* Message Actions */}
            {isSelected && (
              <View className="flex-row gap-2 mt-3 pt-3 border-t" style={{ borderColor: isUser ? "#FFFFFF" : colors.border }}>
                <Pressable
                  onPress={() => handleCopyMessage(item.content)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="content-copy"
                      size={14}
                      color={isUser ? "#FFFFFF" : colors.primary}
                    />
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color: isUser ? "#FFFFFF" : colors.primary,
                      }}
                    >
                      Copy
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => handleShareMessage(item.content)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="share"
                      size={14}
                      color={isUser ? "#FFFFFF" : colors.primary}
                    />
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color: isUser ? "#FFFFFF" : colors.primary,
                      }}
                    >
                      Share
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const renderTypingIndicator = () => {
    if (!isLoading) return null;
    return (
      <View className="flex-row mb-4 px-4 justify-start">
        <View
          className="rounded-3xl px-5 py-3 flex-row gap-1.5"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.muted }}
          />
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.muted, opacity: 0.7 }}
          />
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.muted, opacity: 0.4 }}
          />
        </View>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <View className="mx-4 mb-4 bg-error bg-opacity-10 border border-error rounded-2xl p-4 flex-row items-start gap-3">
        <MaterialIcons name="error-outline" size={20} color={colors.error} />
        <Text
          className="text-sm flex-1 text-error"
          style={{ color: colors.error }}
        >
          {error}
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (messages.length > 0) return null;
    return (
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <MaterialIcons
            name="auto-awesome"
            size={40}
            color={colors.primary}
          />
        </View>
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-foreground text-center">
            Welcome to StudyAI
          </Text>
          <Text
            className="text-base text-muted text-center leading-relaxed"
            style={{ color: colors.muted }}
          >
            Ask me anything about {selectedSubject}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-background flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        className="flex-1"
      >
        {/* Header */}
        <View
          className="border-b border-border py-4 px-4 flex-row justify-between items-center"
          style={{ backgroundColor: colors.background }}
        >
          <View>
            <Text className="text-2xl font-bold text-foreground">StudyAI</Text>
            <Text className="text-xs text-muted mt-0.5">
              {selectedSubject}
            </Text>
          </View>
          {messages.length > 0 && (
            <Pressable
              onPress={clearMessages}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialIcons
                name="refresh"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          )}
        </View>

        {/* Subject Shortcuts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-border px-2 py-2"
          style={{ backgroundColor: colors.background }}
          scrollEventThrottle={16}
        >
          <View className="flex-row gap-2">
            {SUBJECTS.map((subject) => (
              <Pressable
                key={subject.id}
                onPress={() => handleSubjectChange(subject.label)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View
                  className="px-4 py-2 rounded-full border flex-row items-center gap-2"
                  style={{
                    borderColor:
                      selectedSubject === subject.label
                        ? colors.primary
                        : colors.border,
                    backgroundColor:
                      selectedSubject === subject.label
                        ? colors.primary + "15"
                        : colors.surface,
                  }}
                >
                  <MaterialIcons
                    name={subject.icon as any}
                    size={16}
                    color={
                      selectedSubject === subject.label
                        ? colors.primary
                        : colors.muted
                    }
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color:
                        selectedSubject === subject.label
                          ? colors.primary
                          : colors.foreground,
                    }}
                  >
                    {subject.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Messages List */}
        {renderError()}
        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            ListFooterComponent={renderTypingIndicator}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input Area */}
        <View
          className="border-t border-border px-4 py-4"
          style={{ backgroundColor: colors.background }}
        >
          <View
            className="flex-row items-center gap-3 rounded-full px-4 py-3 border border-border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <MaterialIcons
              name="edit"
              size={20}
              color={colors.muted}
            />
            <TextInput
              ref={inputRef}
              className="flex-1 text-base text-foreground"
              placeholder="Ask a question..."
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              editable={!isLoading}
              multiline={false}
              style={{
                color: colors.foreground,
              }}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={isLoading || inputText.trim() === ""}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : isLoading || inputText.trim() === "" ? 0.4 : 1,
                },
              ]}
            >
              <MaterialIcons
                name="send"
                size={20}
                color={
                  isLoading || inputText.trim() === ""
                    ? colors.muted
                    : colors.primary
                }
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Copy Dialog */}
      <MaterialDialog
        visible={showCopyDialog}
        title="Copy Message"
        message="Copy this message to clipboard?"
        confirmText="Copy"
        cancelText="Cancel"
        onConfirm={confirmCopy}
        onCancel={() => {
          setShowCopyDialog(false);
          setCopiedMessage("");
        }}
      />

      {/* WhatsApp Join Dialog */}
      <MaterialDialog
        visible={showWhatsAppDialog}
        title="Join Our WhatsApp Group"
        message="Join our WhatsApp community to get instant study tips, doubt solving, and connect with other students!"
        confirmText="Join Now"
        cancelText="Later"
        onConfirm={handleOpenWhatsApp}
        onCancel={handleWhatsAppDialogClose}
      />
    </ScreenContainer>
  );
}
