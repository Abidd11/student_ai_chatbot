import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialCard } from "@/components/ui/material-card";
import { MaterialButton } from "@/components/ui/material-button";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";

const SUBJECTS = [
  "Math",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Islamic Studies",
];

const DETAIL_LEVELS = [
  { value: "brief", label: "Brief", description: "Quick summary" },
  { value: "standard", label: "Standard", description: "Comprehensive" },
  { value: "detailed", label: "Detailed", description: "In-depth" },
];

export default function NotesScreen() {
  const colors = useColors();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Math");
  const [detailLevel, setDetailLevel] = useState<"brief" | "standard" | "detailed">("standard");
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNotesMutation = trpc.studyTools.generateNotes.useMutation();

  const handleGenerateNotes = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateNotesMutation.mutateAsync({
        topic,
        subject,
        detailLevel,
      });

      if (response.success) {
        setGeneratedNotes(
          typeof response.notes === "string" ? response.notes : ""
        );
      } else {
        alert("Failed to generate notes");
      }
    } catch (error) {
      alert("Error generating notes");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyNotes = () => {
    // Placeholder for copy to clipboard
    alert("Notes copied to clipboard!");
  };

  const handleExportNotes = () => {
    // Placeholder for export functionality
    alert("Export feature coming soon!");
  };

  if (generatedNotes) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View className="border-b border-border py-4 px-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-foreground">
                Study Notes
              </Text>
              <Text className="text-sm text-muted mt-1">
                {topic} - {subject}
              </Text>
            </View>
            <Pressable
              onPress={() => setGeneratedNotes("")}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          </View>

          {/* Notes Content */}
          <View className="p-4 gap-4">
            <MaterialCard>
              <Text
                className="text-base leading-relaxed text-foreground"
                style={{ color: colors.foreground }}
              >
                {generatedNotes}
              </Text>
            </MaterialCard>

            {/* Action Buttons */}
            <View className="gap-3">
              <MaterialButton
                label="Copy Notes"
                variant="primary"
                icon="content-copy"
                onPress={handleCopyNotes}
                fullWidth
              />
              <MaterialButton
                label="Export as PDF"
                variant="secondary"
                icon="download"
                onPress={handleExportNotes}
                fullWidth
              />
              <MaterialButton
                label="Generate New Notes"
                variant="text"
                icon="refresh"
                onPress={() => setGeneratedNotes("")}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="border-b border-border py-4 px-4">
          <Text className="text-2xl font-bold text-foreground">
            Generate Notes
          </Text>
          <Text className="text-sm text-muted mt-1">
            Create study notes from any topic
          </Text>
        </View>

        {/* Form */}
        <View className="p-4 gap-4">
          {/* Topic Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Topic
            </Text>
            <TextInput
              className="border border-border rounded-lg p-3 text-foreground"
              placeholder="Enter topic (e.g., Photosynthesis, Quadratic Equations)"
              placeholderTextColor={colors.muted}
              value={topic}
              onChangeText={setTopic}
              style={{
                borderColor: colors.border,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Subject Selection */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Subject
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {SUBJECTS.map((subj) => (
                <Pressable
                  key={subj}
                  onPress={() => setSubject(subj)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View
                    className="px-4 py-2 rounded-full border-2"
                    style={{
                      borderColor:
                        subject === subj ? colors.primary : colors.border,
                      backgroundColor:
                        subject === subj
                          ? colors.primary + "20"
                          : colors.surface,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color:
                          subject === subj ? colors.primary : colors.foreground,
                      }}
                    >
                      {subj}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Detail Level Selection */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Detail Level
            </Text>
            <View className="gap-2">
              {DETAIL_LEVELS.map((level) => (
                <Pressable
                  key={level.value}
                  onPress={() =>
                    setDetailLevel(level.value as "brief" | "standard" | "detailed")
                  }
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View
                    className="p-3 rounded-lg border-2 flex-row justify-between items-center"
                    style={{
                      borderColor:
                        detailLevel === level.value
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        detailLevel === level.value
                          ? colors.primary + "10"
                          : colors.surface,
                    }}
                  >
                    <View>
                      <Text
                        className="text-sm font-semibold"
                        style={{
                          color:
                            detailLevel === level.value
                              ? colors.primary
                              : colors.foreground,
                        }}
                      >
                        {level.label}
                      </Text>
                      <Text
                        className="text-xs text-muted mt-1"
                        style={{
                          color: colors.muted,
                        }}
                      >
                        {level.description}
                      </Text>
                    </View>
                    {detailLevel === level.value && (
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

          {/* Generate Button */}
          <MaterialButton
            label={isGenerating ? "Generating..." : "Generate Notes"}
            variant="primary"
            icon="auto-awesome"
            onPress={handleGenerateNotes}
            disabled={isGenerating || !topic.trim()}
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
