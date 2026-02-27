import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const STORAGE_KEYS = {
  THEME: "studyai_theme",
  NOTIFICATIONS: "studyai_notifications",
};

interface SettingsState {
  theme: "light" | "dark" | "auto";
  notificationsEnabled: boolean;
}

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<SettingsState>({
    theme: "auto",
    notificationsEnabled: true,
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
      ]);

      const newSettings: SettingsState = {
        theme: (savedSettings[0][1] as "light" | "dark" | "auto") || "auto",
        notificationsEnabled: savedSettings[1][1] !== "false",
      };

      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string | boolean) => {
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

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all app data including chat history? This cannot be undone.",
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
              Made with ❤️ By Rathir Aabid
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
