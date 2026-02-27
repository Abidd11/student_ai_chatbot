import { Modal, View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface MaterialDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function MaterialDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}: MaterialDialogProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          className="rounded-2xl p-6 w-5/6 max-w-sm gap-4"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Title */}
          <Text
            className="text-xl font-bold text-foreground"
            style={{ color: colors.foreground }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            className="text-base text-muted leading-relaxed"
            style={{ color: colors.muted }}
          >
            {message}
          </Text>

          {/* Actions */}
          <View className="flex-row gap-3 justify-end mt-4">
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="px-6 py-3">
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary }}
                >
                  {cancelText}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className="px-6 py-3 rounded-lg"
                style={{
                  backgroundColor: isDangerous ? colors.error : colors.primary,
                }}
              >
                <Text className="text-base font-semibold text-white">
                  {confirmText}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
