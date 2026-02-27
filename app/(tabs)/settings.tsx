import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const STORAGE_KEYS = {
  THEME: "studyai_theme",
  NOTIFICATIONS: "studyai_notifications",
  VOICE_ENABLED: "studyai_voice_enabled",
  VOICE_LANGUAGE: "studyai_voice_language",
  VOICE_SPEED: "studyai_voice_speed",
};

interface SettingsState {
  theme: "light" | "dark" | "auto";
  notificationsEnabled: boolean;
  voiceEnabled: boolean;
  voiceLanguage: string;
  voiceSpeed: number;
}

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<SettingsState>({
    theme: "auto",
    notificationsEnabled: true,
    voiceEnabled: false,
    voiceLanguage: "en",
    voiceSpeed: 1.0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.multiGet([
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.VOICE_ENABLED,
        STORAGE_KEYS.VOICE_LANGUAGE,
        STORAGE_KEYS.VOICE_SPEED,
      ]);

      const newSettings: SettingsState = {
        theme: (savedSettings[0][1] as "light" | "dark" | "auto") || "auto",
        notificationsEnabled: savedSettings[1][1] !== "false",
        voiceEnabled: savedSettings[2][1] === "true",
        voiceLanguage: savedSettings[3][1] || "en",
        voiceSpeed: parseFloat(savedSettings[4][1] || "1.0"),
      };

      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string | boolean | number) => {
    try {
      await AsyncStorage.setItem(key, String(value));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Failed to save setting:", error);
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    setSettings((prev) => ({ ...prev, theme }));
    saveSetting(STORAGE_KEYS.THEME, theme);
  };

  const handleNotificationsToggle = (value: boolean) => {
    setSettings((prev) => ({ ...prev, notificationsEnabled: value }));
    saveSetting(STORAGE_KEYS.NOTIFICATIONS, value);
  };

  const handleVoiceToggle = (value: boolean) => {
    setSettings((prev) => ({ ...prev, voiceEnabled: value }));
    saveSetting(STORAGE_KEYS.VOICE_ENABLED, value);
  };

  const handleVoiceLanguageChange = (language: string) => {
    setSettings((prev) => ({ ...prev, voiceLanguage: language }));
    saveSetting(STORAGE_KEYS.VOICE_LANGUAGE, language);
  };

  const handleVoiceSpeedChange = (speed: number) => {
    setSettings((prev) => ({ ...prev, voiceSpeed: speed }));
    saveSetting(STORAGE_KEYS.VOICE_SPEED, speed);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all app data? This cannot be undone.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "All data cleared");
              await loadSettings();
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <MaterialIcons
          name="settings"
          size={40}
          color={colors.primary}
        />
        <Text className="text-muted mt-3">Loading settings...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View
          className="border-b border-border py-4 px-4"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Settings Content */}
        <View className="p-4 gap-6">
          {/* Theme Settings */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons
                name="palette"
                size={20}
                color={colors.primary}
              />
              <Text className="text-lg font-semibold text-foreground">
                Appearance
              </Text>
            </View>

            <View className="gap-2">
              {[
                { value: "auto" as const, label: "Auto (System)" },
                { value: "light" as const, label: "Light Mode" },
                { value: "dark" as const, label: "Dark Mode" },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleThemeChange(option.value)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View
                    className="p-4 rounded-lg border-2 flex-row justify-between items-center"
                    style={{
                      borderColor:
                        settings.theme === option.value
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        settings.theme === option.value
                          ? colors.primary + "10"
                          : colors.surface,
                    }}
                  >
                    <Text
                      className="text-base font-medium"
                      style={{
                        color:
                          settings.theme === option.value
                            ? colors.primary
                            : colors.foreground,
                      }}
                    >
                      {option.label}
                    </Text>
                    {settings.theme === option.value && (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notification Settings */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={colors.primary}
                />
                <Text className="text-lg font-semibold text-foreground">
                  Notifications
                </Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: colors.border, true: colors.primary + "50" }}
                thumbColor={
                  settings.notificationsEnabled ? colors.primary : colors.muted
                }
              />
            </View>
            <Text
              className="text-sm text-muted px-2"
              style={{ color: colors.muted }}
            >
              Receive notifications for new study tips and reminders
            </Text>
          </View>

          {/* Voice Settings */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="mic"
                  size={20}
                  color={colors.primary}
                />
                <Text className="text-lg font-semibold text-foreground">
                  Voice Features
                </Text>
              </View>
              <Switch
                value={settings.voiceEnabled}
                onValueChange={handleVoiceToggle}
                trackColor={{ false: colors.border, true: colors.primary + "50" }}
                thumbColor={
                  settings.voiceEnabled ? colors.primary : colors.muted
                }
              />
            </View>

            {settings.voiceEnabled && (
              <View className="gap-4 mt-3">
                {/* Voice Language */}
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Language
                  </Text>
                  <View className="gap-2">
                    {[
                      { value: "en", label: "English" },
                      { value: "es", label: "Spanish" },
                      { value: "fr", label: "French" },
                      { value: "de", label: "German" },
                      { value: "hi", label: "Hindi" },
                      { value: "ar", label: "Arabic" },
                    ].map((lang) => (
                      <Pressable
                        key={lang.value}
                        onPress={() => handleVoiceLanguageChange(lang.value)}
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <View
                          className="p-3 rounded-lg border flex-row justify-between items-center"
                          style={{
                            borderColor:
                              settings.voiceLanguage === lang.value
                                ? colors.primary
                                : colors.border,
                            backgroundColor:
                              settings.voiceLanguage === lang.value
                                ? colors.primary + "10"
                                : colors.surface,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color:
                                settings.voiceLanguage === lang.value
                                  ? colors.primary
                                  : colors.foreground,
                            }}
                          >
                            {lang.label}
                          </Text>
                          {settings.voiceLanguage === lang.value && (
                            <MaterialIcons
                              name="check"
                              size={16}
                              color={colors.primary}
                            />
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Voice Speed */}
                <View>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Playback Speed
                    </Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {settings.voiceSpeed.toFixed(1)}x
                    </Text>
                  </View>
                  <View className="gap-2">
                    {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                      <Pressable
                        key={speed}
                        onPress={() => handleVoiceSpeedChange(speed)}
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <View
                          className="p-3 rounded-lg border flex-row justify-between items-center"
                          style={{
                            borderColor:
                              settings.voiceSpeed === speed
                                ? colors.primary
                                : colors.border,
                            backgroundColor:
                              settings.voiceSpeed === speed
                                ? colors.primary + "10"
                                : colors.surface,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color:
                                settings.voiceSpeed === speed
                                  ? colors.primary
                                  : colors.foreground,
                            }}
                          >
                            {speed === 0.75
                              ? "Slow"
                              : speed === 1.0
                                ? "Normal"
                                : speed === 1.25
                                  ? "Fast"
                                  : "Very Fast"}
                          </Text>
                          {settings.voiceSpeed === speed && (
                            <MaterialIcons
                              name="check"
                              size={16}
                              color={colors.primary}
                            />
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* About Section */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons
                name="info"
                size={20}
                color={colors.primary}
              />
              <Text className="text-lg font-semibold text-foreground">
                About
              </Text>
            </View>

            <View
              className="p-4 rounded-lg gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App Name</Text>
                <Text className="text-sm font-semibold text-foreground">
                  StudyAI
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Version</Text>
                <Text className="text-sm font-semibold text-foreground">
                  1.0.0
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Built with</Text>
                <Text className="text-sm font-semibold text-foreground">
                  React Native
                </Text>
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons
                name="storage"
                size={20}
                color={colors.primary}
              />
              <Text className="text-lg font-semibold text-foreground">
                Data Management
              </Text>
            </View>

            <Pressable
              onPress={handleClearData}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="p-4 rounded-lg border-2 flex-row items-center justify-between"
                style={{
                  borderColor: colors.error,
                  backgroundColor: colors.error + "10",
                }}
              >
                <View className="flex-row items-center gap-3">
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={colors.error}
                  />
                  <Text
                    className="text-base font-semibold"
                    style={{ color: colors.error }}
                  >
                    Clear All Data
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={colors.error}
                />
              </View>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted text-center">
              Made with ❤️ for students
            </Text>
            <Text className="text-xs text-muted text-center">
              © 2026 StudyAI. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
