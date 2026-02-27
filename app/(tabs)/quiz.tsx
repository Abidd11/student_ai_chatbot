import { ScrollView, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialCard } from "@/components/ui/material-card";
import { MaterialButton } from "@/components/ui/material-button";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  userAnswer?: string;
}

export default function QuizScreen() {
  const colors = useColors();
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: "Paris",
      explanation: "Paris is the capital and largest city of France.",
      userAnswer: undefined,
    },
    {
      id: "2",
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4",
      explanation: "2 + 2 equals 4.",
      userAnswer: undefined,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answered = questions.filter((q) => q.userAnswer).length;
  const correct = questions.filter(
    (q) => q.userAnswer === q.correct
  ).length;

  const handleAnswer = (option: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = option;
    setQuestions(updatedQuestions);

    // Move to next question after 1 second
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setQuestions(
      questions.map((q) => ({
        ...q,
        userAnswer: undefined,
      }))
    );
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((correct / questions.length) * 100);
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View className="border-b border-border py-4 px-4">
            <Text className="text-2xl font-bold text-foreground">
              Quiz Results
            </Text>
          </View>

          {/* Results Summary */}
          <View className="p-4 gap-4">
            <MaterialCard elevated>
              <View className="items-center gap-4">
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <Text
                    className="text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {percentage}%
                  </Text>
                </View>
                <View className="items-center gap-2">
                  <Text
                    className="text-2xl font-bold text-foreground"
                    style={{ color: colors.foreground }}
                  >
                    {correct} out of {questions.length}
                  </Text>
                  <Text
                    className="text-sm text-muted"
                    style={{ color: colors.muted }}
                  >
                    Correct Answers
                  </Text>
                </View>
              </View>
            </MaterialCard>

            {/* Review Answers */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-3">
                Review Your Answers
              </Text>
              {questions.map((q, idx) => {
                const isCorrect = q.userAnswer === q.correct;
                return (
                  <MaterialCard
                    key={q.id}
                    className="mb-3"
                    title={`Question ${idx + 1}`}
                  >
                    <Text
                      className="text-sm text-muted mb-3"
                      style={{ color: colors.muted }}
                    >
                      {q.question}
                    </Text>
                    <View className="gap-2 mb-3">
                      <View
                        className="p-3 rounded-lg border-2"
                        style={{
                          borderColor: isCorrect
                            ? colors.success
                            : colors.error,
                          backgroundColor: isCorrect
                            ? colors.success + "10"
                            : colors.error + "10",
                        }}
                      >
                        <Text
                          className="text-sm font-semibold"
                          style={{
                            color: isCorrect
                              ? colors.success
                              : colors.error,
                          }}
                        >
                          Your Answer: {q.userAnswer}
                        </Text>
                      </View>
                      {!isCorrect && (
                        <View
                          className="p-3 rounded-lg border-2"
                          style={{
                            borderColor: colors.success,
                            backgroundColor: colors.success + "10",
                          }}
                        >
                          <Text
                            className="text-sm font-semibold"
                            style={{ color: colors.success }}
                          >
                            Correct Answer: {q.correct}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Text
                        className="text-xs font-semibold text-muted mb-1"
                        style={{ color: colors.muted }}
                      >
                        Explanation
                      </Text>
                      <Text
                        className="text-sm text-foreground"
                        style={{ color: colors.foreground }}
                      >
                        {q.explanation}
                      </Text>
                    </View>
                  </MaterialCard>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mt-4">
              <MaterialButton
                label="Retake Quiz"
                variant="primary"
                icon="refresh"
                onPress={resetQuiz}
                fullWidth
              />
              <MaterialButton
                label="Back to Study Tools"
                variant="secondary"
                icon="arrow-back"
                onPress={() => console.log("Navigate back")}
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
        {/* Header with Progress */}
        <View className="border-b border-border py-4 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-foreground">Quiz</Text>
            <Text
              className="text-sm font-semibold text-muted"
              style={{ color: colors.muted }}
            >
              {currentIndex + 1} / {questions.length}
            </Text>
          </View>
          {/* Progress Bar */}
          <View
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.border }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: colors.primary,
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Question */}
        <View className="p-4 gap-4">
          <MaterialCard elevated>
            <Text
              className="text-lg font-semibold text-foreground mb-4"
              style={{ color: colors.foreground }}
            >
              {currentQuestion.question}
            </Text>

            {/* Options */}
            <View className="gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentQuestion.userAnswer === option;
                const isCorrect = option === currentQuestion.correct;
                const showResult = currentQuestion.userAnswer !== undefined;

                let borderColor = colors.border;
                let bgColor = colors.surface;

                if (showResult) {
                  if (isCorrect) {
                    borderColor = colors.success;
                    bgColor = colors.success + "10";
                  } else if (isSelected && !isCorrect) {
                    borderColor = colors.error;
                    bgColor = colors.error + "10";
                  }
                } else if (isSelected) {
                  borderColor = colors.primary;
                  bgColor = colors.primary + "10";
                }

                return (
                  <Pressable
                    key={idx}
                    onPress={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View
                      className="flex-row items-center p-4 rounded-lg border-2"
                      style={{
                        borderColor,
                        backgroundColor: bgColor,
                      }}
                    >
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center mr-3"
                        style={{
                          borderWidth: 2,
                          borderColor,
                        }}
                      >
                        {isSelected && showResult && isCorrect && (
                          <MaterialIcons
                            name="check"
                            size={16}
                            color={colors.success}
                          />
                        )}
                        {isSelected && showResult && !isCorrect && (
                          <MaterialIcons
                            name="close"
                            size={16}
                            color={colors.error}
                          />
                        )}
                      </View>
                      <Text
                        className="text-base font-semibold flex-1"
                        style={{
                          color: borderColor,
                        }}
                      >
                        {option}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </MaterialCard>

          {/* Navigation Buttons */}
          {currentQuestion.userAnswer !== undefined && (
            <View className="gap-3">
              {currentIndex < questions.length - 1 && (
                <MaterialButton
                  label="Next Question"
                  variant="primary"
                  icon="arrow-forward"
                  onPress={() => setCurrentIndex(currentIndex + 1)}
                  fullWidth
                />
              )}
              {currentIndex === questions.length - 1 && (
                <MaterialButton
                  label="See Results"
                  variant="primary"
                  icon="check-circle"
                  onPress={() => setShowResults(true)}
                  fullWidth
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
