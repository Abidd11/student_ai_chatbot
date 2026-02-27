import { ScrollView, Text, View, Pressable, Linking } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { MaterialDialog } from "@/components/ui/material-dialog";

const STORAGE_KEYS = {
  THEME: "studyai_theme",
};

interface SettingsState {
  theme: "light" | "dark" | "auto";
}

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<SettingsState>({
    theme: "auto",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.multiGet([
        STORAGE_KEYS.THEME,
      ]);

      const newSettings: SettingsState = {
        theme: (savedSettings[0][1] as "light" | "dark" | "auto") || "auto",
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
    }
  };

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    setSettings((prev) => ({ ...prev, theme }));
    saveSetting(STORAGE_KEYS.THEME, theme);
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowClearDialog(false);
      await loadSettings();
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  };

  const handleDownloadJKBose = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Replace with actual JKBose Helper app download link
      const downloadLink = "https://play.google.com/store/apps/details?id=com.jkbose.helper";
      await Linking.openURL(downloadLink);
    } catch (error) {
      console.error("Failed to open download link:", error);
    }
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

          {/* Downloads Section */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons
                name="download"
                size={20}
                color={colors.primary}
              />
              <Text className="text-lg font-semibold text-foreground">
                Recommended Apps
              </Text>
            </View>

            <Pressable
              onPress={handleDownloadJKBose}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="p-4 rounded-lg border-2 flex-row items-center justify-between"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "10",
                }}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-12 h-12 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <MaterialIcons
                      name="school"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-base font-semibold"
                      style={{ color: colors.foreground }}
                    >
                      JKBose Helper
                    </Text>
                    <Text
                      className="text-xs text-muted mt-1"
                      style={{ color: colors.muted }}
                    >
                      Your complete study companion
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.primary}
                />
              </View>
            </Pressable>
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
              onPress={() => setShowClearDialog(true)}
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

      {/* Clear Data Dialog */}
      <MaterialDialog
        visible={showClearDialog}
        title="Clear All Data"
        message="Are you sure you want to clear all app data including chat history? This cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleClearData}
        onCancel={() => setShowClearDialog(false)}
      />
    </ScreenContainer>
  );
}
