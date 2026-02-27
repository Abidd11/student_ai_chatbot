import { View, Pressable, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

interface MaterialCardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  elevated?: boolean;
  disabled?: boolean;
}

export function MaterialCard({
  children,
  onPress,
  className,
  title,
  subtitle,
  icon,
  elevated = false,
  disabled = false,
}: MaterialCardProps) {
  const colors = useColors();

  const handlePress = async () => {
    if (disabled || !onPress) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent
      onPress={onPress ? handlePress : undefined}
      disabled={disabled}
      style={({ pressed }: any) => ([
        {
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
        },
      ])}
      className={cn(
        "p-4",
        elevated ? "shadow-lg" : "shadow-sm",
        className
      )}
    >
      {/* Header with icon and title */}
      {(icon || title) && (
        <View className="flex-row items-start gap-3 mb-3">
          {icon && <View className="mt-1">{icon}</View>}
          <View className="flex-1">
            {title && (
              <Text
                className="text-lg font-semibold text-foreground"
                style={{ color: colors.foreground }}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                className="text-sm text-muted mt-1"
                style={{ color: colors.muted }}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Content */}
      {children}
    </CardComponent>
  );
}
