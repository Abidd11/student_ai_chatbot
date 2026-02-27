import { ScrollView, Text, View, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialCard } from "@/components/ui/material-card";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "@/lib/theme-provider";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  type: "toggle" | "text" | "select";
}

const SETTINGS: SettingItem[] = [
  {
    id: "notifications",
    title: "Push Notifications",
    subtitle: "Receive study reminders",
    icon: "notifications",
    type: "toggle",
  },
  {
    id: "voice-input",
    title: "Voice Input",
    subtitle: "Ask questions using voice",
    icon: "mic",
    type: "toggle",
  },
  {
    id: "voice-output",
    title: "Voice Output",
    subtitle: "Hear AI responses aloud",
    icon: "volume-up",
    type: "toggle",
  },
  {
    id: "offline-mode",
    title: "Offline Mode",
    subtitle: "Use cached responses offline",
    icon: "cloud-off",
    type: "toggle",
  },
];

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { colorScheme: currentScheme, setColorScheme } = useThemeContext();
  const [settings, setSettings] = useState({
    notifications: true,
    voiceInput: false,
    voiceOutput: false,
    offlineMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSettingItem = (setting: SettingItem) => {
    let value = false;
    if (setting.id === "notifications") value = settings.notifications;
    if (setting.id === "voice-input") value = settings.voiceInput;
    if (setting.id === "voice-output") value = settings.voiceOutput;
    if (setting.id === "offline-mode") value = settings.offlineMode;

    return (
      <View
        key={setting.id}
        className="flex-row items-center justify-between p-4 border-b border-border"
        style={{ borderColor: colors.border }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <MaterialIcons
            name={setting.icon}
            size={24}
            color={colors.primary}
          />
          <View className="flex-1">
            <Text
              className="text-base font-semibold text-foreground"
              style={{ color: colors.foreground }}
            >
              {setting.title}
            </Text>
            {setting.subtitle && (
              <Text
                className="text-sm text-muted mt-1"
                style={{ color: colors.muted }}
              >
                {setting.subtitle}
              </Text>
            )}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={() => {
            const keyMap: Record<string, keyof typeof settings> = {
              notifications: "notifications",
              "voice-input": "voiceInput",
              "voice-output": "voiceOutput",
              "offline-mode": "offlineMode",
            };
            handleToggle(keyMap[setting.id]);
          }}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="border-b border-border py-4 px-4">
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
          <Text className="text-sm text-muted mt-1">
            Customize your experience
          </Text>
        </View>

        {/* Theme Section */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Appearance
          </Text>
          <MaterialCard>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <MaterialIcons
                  name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
                  size={24}
                  color={colors.primary}
                />
                <View>
                  <Text
                    className="text-base font-semibold text-foreground"
                    style={{ color: colors.foreground }}
                  >
                    Theme
                  </Text>
                  <Text
                    className="text-sm text-muted mt-1"
                    style={{ color: colors.muted }}
                  >
                    {colorScheme === "dark" ? "Dark Mode" : "Light Mode"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.muted}
              />
            </View>
            <View className="flex-row gap-3 mt-4">
              <View
                className="flex-1 rounded-lg p-3 items-center border-2"
                style={{
                  borderColor:
                    colorScheme === "light" ? colors.primary : colors.border,
                  backgroundColor:
                    colorScheme === "light"
                      ? colors.primary + "20"
                      : colors.surface,
                }}
              >
                <MaterialIcons
                  name="light-mode"
                  size={24}
                  color={
                    colorScheme === "light" ? colors.primary : colors.muted
                  }
                />
                <Text
                  className="text-xs font-semibold mt-2"
                  style={{
                    color:
                      colorScheme === "light" ? colors.primary : colors.muted,
                  }}
                >
                  Light
                </Text>
              </View>
              <View
                className="flex-1 rounded-lg p-3 items-center border-2"
                style={{
                  borderColor:
                    colorScheme === "dark" ? colors.primary : colors.border,
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.primary + "20"
                      : colors.surface,
                }}
              >
                <MaterialIcons
                  name="dark-mode"
                  size={24}
                  color={
                    colorScheme === "dark" ? colors.primary : colors.muted
                  }
                />
                <Text
                  className="text-xs font-semibold mt-2"
                  style={{
                    color:
                      colorScheme === "dark" ? colors.primary : colors.muted,
                  }}
                >
                  Dark
                </Text>
              </View>
            </View>
          </MaterialCard>
        </View>

        {/* Preferences Section */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Preferences
          </Text>
          <MaterialCard className="p-0">
            {SETTINGS.map(renderSettingItem)}
          </MaterialCard>
        </View>

        {/* About Section */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            About
          </Text>
          <MaterialCard>
            <View className="gap-4">
              <View>
                <Text
                  className="text-sm text-muted"
                  style={{ color: colors.muted }}
                >
                  App Version
                </Text>
                <Text
                  className="text-base font-semibold text-foreground mt-1"
                  style={{ color: colors.foreground }}
                >
                  1.0.0
                </Text>
              </View>
              <View>
                <Text
                  className="text-sm text-muted"
                  style={{ color: colors.muted }}
                >
                  Build Number
                </Text>
                <Text
                  className="text-base font-semibold text-foreground mt-1"
                  style={{ color: colors.foreground }}
                >
                  001
                </Text>
              </View>
              <View className="pt-4 border-t border-border">
                <Text
                  className="text-xs text-muted text-center"
                  style={{ color: colors.muted }}
                >
                  StudyAI © 2026. All rights reserved.
                </Text>
              </View>
            </View>
          </MaterialCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
