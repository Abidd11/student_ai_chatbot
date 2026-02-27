import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

interface MaterialButtonProps {
  onPress: () => void;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "small" | "medium" | "large";
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  haptic?: boolean;
}

export function MaterialButton({
  onPress,
  label,
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  fullWidth = false,
  className,
  haptic = true,
}: MaterialButtonProps) {
  const colors = useColors();

  const handlePress = async () => {
    if (disabled) return;
    if (haptic) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeClasses = {
    small: "px-3 py-2",
    medium: "px-6 py-3",
    large: "px-8 py-4",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const variantStyles = {
    primary: {
      bg: colors.primary,
      text: "#FFFFFF",
      border: colors.primary,
    },
    secondary: {
      bg: colors.surface,
      text: colors.primary,
      border: colors.primary,
    },
    tertiary: {
      bg: colors.warning,
      text: "#FFFFFF",
      border: colors.warning,
    },
    text: {
      bg: "transparent",
      text: colors.primary,
      border: "transparent",
    },
  };

  const style = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ([
        {
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          backgroundColor: style.bg,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: style.border,
        },
      ])}
      className={cn(
        "rounded-full items-center justify-center flex-row gap-2",
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={size === "small" ? 16 : size === "medium" ? 20 : 24}
          color={style.text}
        />
      )}
      <Text
        className={cn(
          "font-semibold",
          textSizeClasses[size]
        )}
        style={{ color: style.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
