import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialCard } from "@/components/ui/material-card";
import { MaterialButton } from "@/components/ui/material-button";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";

interface StudyTool {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
  color: string;
}

const STUDY_TOOLS: StudyTool[] = [
  {
    id: "pdf",
    title: "Upload PDF",
    subtitle: "Ask questions about PDFs",
    icon: "picture-as-pdf",
    description: "Upload study materials and ask questions about them",
    color: "#EF4444",
  },
  {
    id: "notes",
    title: "Generate Notes",
    subtitle: "Create study notes",
    icon: "note-add",
    description: "Generate comprehensive notes from any topic",
    color: "#F59E0B",
  },
  {
    id: "quiz",
    title: "Create Quiz",
    subtitle: "Test your knowledge",
    icon: "quiz",
    description: "Generate MCQs and quizzes for any subject",
    color: "#0A7EA4",
  },
  {
    id: "formula",
    title: "Formula Sheet",
    subtitle: "Important formulas",
    icon: "functions",
    description: "Get all important formulas for your subject",
    color: "#6B5B95",
  },
  {
    id: "questions",
    title: "Important Questions",
    subtitle: "Exam preparation",
    icon: "help-outline",
    description: "Get important questions likely to appear in exams",
    color: "#22C55E",
  },
  {
    id: "summary",
    title: "Summarize",
    subtitle: "Condense content",
    icon: "summarize",
    description: "Get concise summaries of complex topics",
    color: "#3B82F6",
  },
];

const SUBJECTS = [
  "All",
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

export default function StudyToolsScreen() {
  const colors = useColors();

  const handleToolPress = (toolId: string) => {
    console.log("Tool pressed:", toolId);
    // TODO: Navigate to specific tool screen
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="border-b border-border py-4 px-4">
          <Text className="text-2xl font-bold text-foreground">Study Tools</Text>
          <Text className="text-sm text-muted mt-1">
            Enhance your learning with AI-powered tools
          </Text>
        </View>

        {/* Subject Filter */}
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Filter by Subject
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {SUBJECTS.map((subject) => (
              <MaterialButton
                key={subject}
                label={subject}
                variant={subject === "All" ? "primary" : "secondary"}
                size="small"
                onPress={() => console.log("Subject:", subject)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Study Tools Grid */}
        <View className="p-4 gap-4">
          {STUDY_TOOLS.map((tool) => (
            <MaterialCard
              key={tool.id}
              onPress={() => handleToolPress(tool.id)}
              icon={
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: tool.color + "20" }}
                >
                  <MaterialIcons
                    name={tool.icon}
                    size={24}
                    color={tool.color}
                  />
                </View>
              }
              title={tool.title}
              subtitle={tool.subtitle}
            >
              <Text
                className="text-sm text-muted leading-relaxed"
                style={{ color: colors.muted }}
              >
                {tool.description}
              </Text>
              <MaterialButton
                label="Open"
                variant="primary"
                size="small"
                icon="arrow-forward"
                onPress={() => handleToolPress(tool.id)}
                className="mt-4"
              />
            </MaterialCard>
          ))}
        </View>

        {/* Recent Files Section */}
        <View className="px-4 py-6 border-t border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Recent Files
          </Text>
          <View
            className="rounded-2xl p-6 items-center justify-center border-2 border-dashed"
            style={{ borderColor: colors.border }}
          >
            <MaterialIcons
              name="cloud-upload"
              size={48}
              color={colors.muted}
            />
            <Text
              className="text-sm text-muted mt-3"
              style={{ color: colors.muted }}
            >
              No recent files. Upload a PDF to get started!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
