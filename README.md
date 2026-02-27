# StudyAI - Student AI Chatbot Mobile App

A Material 3-designed mobile application that leverages AI to help students with study-related questions, explanations, notes generation, and exam preparation across multiple subjects.

## 🎯 Features

### 💬 AI Chat System
- **Real-time AI-powered responses** using OpenAI integration
- **Subject-specific tutoring** across 9 subjects (Math, Science, Physics, Chemistry, Biology, English, History, Geography, Islamic Studies)
- **Multiple learning modes**: General, Homework Help, Exam Prep, Doubt Solving
- **WhatsApp-style chat interface** with smooth animations
- **Typing indicators** and real-time message streaming
- **Error handling** with retry logic

### 📚 Study Tools
1. **Generate Notes** - Create comprehensive study notes with three detail levels (Brief, Standard, Detailed)
2. **Create Quizzes** - Generate multiple-choice questions for self-assessment
3. **Important Questions** - Get exam-likely questions for preparation
4. **Formula Sheets** - Quick reference formulas for STEM subjects
5. **Explain Concepts** - Understand topics at different levels (5-year, 10-year, Exam)
6. **Summarize Content** - Condense complex information

### 🎨 Material 3 UI Design
- **Light & Dark Mode** - Automatic theme switching with Material 3 colors
- **Soft Gradients** - Teal primary, purple secondary, amber tertiary
- **Smooth Animations** - Subtle transitions and micro-interactions
- **Responsive Layout** - Optimized for portrait orientation (9:16)
- **Accessible Components** - Touch targets ≥ 44pt, proper contrast ratios

### ⚙️ User Experience
- **Settings Screen** - Theme toggle, notification preferences, voice settings
- **Persistent State** - Message history and preferences saved locally
- **Haptic Feedback** - Tactile feedback on button presses
- **Loading States** - Clear visual feedback during AI processing

## 📱 Screens

1. **Chat Screen** - Main chat interface for asking questions
2. **Study Tools Screen** - Quick access to all study features
3. **Quiz Screen** - Interactive quiz with instant feedback
4. **Notes Screen** - Generate and view study notes
5. **Settings Screen** - Customize app preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS/Android device or emulator

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# On iOS
pnpm ios

# On Android
pnpm android

# On Web
pnpm web
```

### Environment Setup

The app uses the server's built-in LLM capabilities. No manual API key setup is required - credentials are injected from the platform.

## 🏗️ Project Structure

```
app/
  (tabs)/
    index.tsx           - Chat screen
    study-tools.tsx     - Study tools overview
    quiz.tsx            - Quiz interface
    notes.tsx           - Notes generation
    settings.tsx        - User settings
    _layout.tsx         - Tab navigation

components/
  ui/
    material-button.tsx - Reusable button component
    material-card.tsx   - Card component
    icon-symbol.tsx     - Icon mapping

hooks/
  use-ai-chat.ts       - AI chat state management
  use-voice-input.ts   - Voice input handling
  use-pdf-upload.ts    - PDF file management

server/
  routers.ts           - tRPC API endpoints
  _core/               - Framework code

lib/
  trpc.ts              - tRPC client
  theme-provider.tsx   - Theme context

constants/
  theme.ts             - Color palette
```

## 🎨 Design System

### Color Palette (Material 3)

| Token | Light | Dark |
|-------|-------|------|
| Primary | #0A7EA4 | #0A7EA4 |
| Secondary | #6B5B95 | #8B7BA8 |
| Tertiary | #F59E0B | #FBBF24 |
| Background | #FFFFFF | #151718 |
| Surface | #F5F5F5 | #1E2022 |
| Foreground | #11181C | #ECEDEE |
| Muted | #687076 | #9BA1A6 |
| Border | #E5E7EB | #334155 |
| Success | #22C55E | #4ADE80 |
| Error | #EF4444 | #F87171 |

### Typography

- **Heading 1**: 32pt, Bold
- **Heading 2**: 24pt, Semibold
- **Heading 3**: 20pt, Semibold
- **Body**: 16pt, Regular
- **Small**: 14pt, Regular
- **Caption**: 12pt, Regular

## 🔌 API Endpoints

All endpoints are available through tRPC:

### Chat
- `chat.sendMessage` - Send message and get AI response

### Study Tools
- `studyTools.generateNotes` - Generate study notes
- `studyTools.generateQuiz` - Create quiz questions
- `studyTools.explain` - Explain concepts at different levels
- `studyTools.generateImportantQuestions` - Get exam-likely questions
- `studyTools.generateFormulaSheet` - Generate formula reference

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 📦 Dependencies

### Core
- React Native 0.81
- Expo 54
- React 19
- TypeScript 5.9

### UI & Styling
- NativeWind 4 (Tailwind CSS)
- @expo/vector-icons
- react-native-reanimated 4

### State Management
- React Context + useReducer
- AsyncStorage for persistence
- TanStack Query for server data

### API
- tRPC for type-safe API
- Zod for validation

## 🚀 Deployment

To publish the app:

1. Create a checkpoint: `webdev_save_checkpoint`
2. Click the "Publish" button in the Management UI
3. Follow the platform's deployment instructions

## 📝 Future Enhancements

- [ ] Voice input (speech-to-text) integration
- [ ] Voice output (text-to-speech) integration
- [ ] PDF upload and OCR
- [ ] Image-based question upload
- [ ] Offline mode with cached responses
- [ ] Learning analytics and progress tracking
- [ ] Collaborative study groups
- [ ] Integration with popular learning platforms

## 🤝 Contributing

This is a student learning project. Contributions and suggestions are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, questions, or feedback, please reach out to the development team.

---

**Built with ❤️ for students, by developers**
