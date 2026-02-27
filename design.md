# Student AI Chatbot - Mobile App Design

## Overview

A Material 3-based student-friendly AI chatbot application designed for portrait orientation (9:16) with one-handed usage in mind. The app enables students to ask study-related questions across multiple subjects and receive instant AI-powered answers with explanations, summaries, and study tools.

## Design Principles

- **Material 3 (Google Material You)**: Soft gradients, minimal color palette, rounded corners, smooth micro-animations
- **Light & Dark Mode**: Automatic theme switching with carefully chosen contrast ratios
- **One-Handed Usage**: Touch targets ≥ 44pt, primary actions in lower-right quadrant
- **Minimal Layout**: Clean typography, ample whitespace, no visual clutter
- **Smooth Animations**: Subtle transitions (80-300ms), no bouncy springs, meaningful motion

## Screen List

1. **Splash / Onboarding** - Welcome screen with app branding
2. **Chat Home** - Main chat interface with message history
3. **Chat Detail** - Individual conversation thread
4. **Study Tools** - Quick access to PDFs, notes, quizzes
5. **Subject Selection** - Choose subject for focused help
6. **Settings** - Theme, voice, notification preferences
7. **Profile** - User info and learning history

## Primary Content & Functionality

### Chat Home Screen
- **Header**: App logo, subject selector, settings icon
- **Chat List**: Recent conversations with preview snippets
- **Floating Action Button (FAB)**: "New Chat" button in bottom-right
- **Bottom Navigation**: Chat, Study Tools, Settings tabs

### Chat Detail Screen
- **Message Bubbles**: User messages (right, blue), AI responses (left, surface color)
- **Typing Indicator**: Animated dots while AI is responding
- **Input Area**: Text field with send button, voice input icon, attachment icon
- **Message Options**: Long-press for copy, delete, regenerate actions
- **AI Response Features**:
  - Code/formula formatting with syntax highlighting
  - Expandable sections for detailed explanations
  - "Explain Like 5/10/Exam Level" toggle buttons
  - Summary/Full Answer toggle

### Study Tools Screen
- **Quick Actions Grid**:
  - Upload PDF & Ask
  - Generate Notes
  - Create Quiz
  - Formula Sheet
  - Important Questions
- **Recent Files**: List of uploaded PDFs with quick access
- **Subject Filters**: Math, Science, Physics, Chemistry, Biology, English, History, Geography, Islamic Studies

### Subject Selection
- **Subject Cards**: Grid layout with subject icons and names
- **Focused Mode**: Select subject to get specialized prompts and suggestions

### Settings Screen
- **Theme Toggle**: Light/Dark mode selector
- **Voice Settings**: Voice input language, voice output toggle, playback speed
- **Notifications**: Toggle push notifications
- **About**: App version, privacy policy, feedback

## Key User Flows

### Flow 1: Ask a Question
1. User taps "New Chat" FAB or existing chat
2. Types question in input field (or uses voice input)
3. Taps send button
4. Typing indicator appears
5. AI response streams in with animations
6. User can tap "Explain More" or "Summarize" buttons
7. Response options appear (copy, regenerate, etc.)

### Flow 2: Upload PDF & Ask
1. User navigates to Study Tools
2. Taps "Upload PDF & Ask"
3. Selects PDF from device
4. Types question about PDF content
5. AI analyzes PDF and provides answer
6. User can ask follow-up questions about same PDF

### Flow 3: Generate Quiz
1. User navigates to Study Tools
2. Taps "Create Quiz"
3. Selects subject and topic
4. Specifies number of questions (5-20)
5. AI generates MCQ quiz
6. User answers questions with instant feedback
7. Results screen shows score and explanations

### Flow 4: Generate Notes
1. User navigates to Study Tools
2. Taps "Generate Notes"
3. Enters topic/chapter name
4. Selects detail level (brief, standard, detailed)
5. AI generates formatted notes
6. User can copy, export, or ask follow-up questions

## Color Choices (Material 3 Palette)

### Light Mode
- **Primary**: #0A7EA4 (Teal) - Main accent, buttons, highlights
- **Secondary**: #6B5B95 (Purple) - Secondary actions, badges
- **Tertiary**: #F59E0B (Amber) - Warnings, highlights
- **Background**: #FFFFFF (White) - Main background
- **Surface**: #F5F5F5 (Light Gray) - Cards, elevated surfaces
- **Foreground**: #11181C (Dark Gray) - Primary text
- **Muted**: #687076 (Medium Gray) - Secondary text
- **Border**: #E5E7EB (Light Border) - Dividers, borders
- **Success**: #22C55E (Green) - Success states, checkmarks
- **Error**: #EF4444 (Red) - Errors, destructive actions

### Dark Mode
- **Primary**: #0A7EA4 (Teal) - Consistent with light mode
- **Secondary**: #8B7BA8 (Purple) - Lighter for dark mode
- **Tertiary**: #FBBF24 (Amber) - Lighter for dark mode
- **Background**: #151718 (Very Dark) - Main background
- **Surface**: #1E2022 (Dark Gray) - Cards, elevated surfaces
- **Foreground**: #ECEDEE (Off-White) - Primary text
- **Muted**: #9BA1A6 (Light Gray) - Secondary text
- **Border**: #334155 (Dark Border) - Dividers, borders
- **Success**: #4ADE80 (Light Green) - Success states
- **Error**: #F87171 (Light Red) - Errors, destructive actions

## Component Specifications

### Chat Bubbles
- **User Message**: Teal background (#0A7EA4), white text, right-aligned, 12pt border-radius
- **AI Message**: Surface color background, foreground text, left-aligned, 12pt border-radius
- **Padding**: 12pt horizontal, 8pt vertical
- **Max Width**: 85% of screen width

### Input Area
- **Height**: 56pt (touch target minimum)
- **Background**: Surface color
- **Border**: 1pt border with border color
- **Rounded Corners**: 24pt (pill-shaped)
- **Icons**: 24pt, teal color, 12pt padding
- **Text**: 16pt, foreground color

### Floating Action Button (FAB)
- **Size**: 56pt diameter
- **Color**: Primary (teal)
- **Icon**: 24pt white
- **Position**: Bottom-right, 16pt from edges
- **Shadow**: Subtle elevation
- **Press Feedback**: Scale to 0.97, haptic feedback

### Cards
- **Background**: Surface color
- **Border Radius**: 12pt
- **Padding**: 16pt
- **Shadow**: 2pt elevation, subtle blur
- **Border**: 1pt with border color (optional)

### Buttons
- **Primary**: Teal background, white text, 12pt border-radius, 44pt minimum height
- **Secondary**: Surface background, teal text, 12pt border-radius, 1pt teal border
- **Text**: 16pt, font-weight 600
- **Padding**: 12pt horizontal, 8pt vertical

### Typography
- **Heading 1**: 32pt, font-weight 700, foreground color
- **Heading 2**: 24pt, font-weight 600, foreground color
- **Heading 3**: 20pt, font-weight 600, foreground color
- **Body**: 16pt, font-weight 400, foreground color
- **Small**: 14pt, font-weight 400, muted color
- **Caption**: 12pt, font-weight 400, muted color

## Animations & Transitions

### Typing Indicator
- Three dots that scale up and down in sequence
- Duration: 600ms per cycle
- Easing: Ease-in-out

### Chat Bubble Entrance
- Fade-in + slide-up animation
- Duration: 300ms
- Easing: Ease-out

### Button Press
- Scale to 0.97
- Duration: 80ms
- Haptic feedback: Light impact

### Message Send
- Input field scales down slightly
- Send button rotates 90° (optional)
- Duration: 150ms

### Loading Spinner
- Continuous rotation
- Duration: 1000ms per rotation
- Color: Primary teal

### Lottie Animations
- Loading: Subtle bouncing dots or wave animation
- Success: Checkmark animation
- Error: Shake animation

## Responsive Layout Notes

- **Portrait Only**: App locked to portrait orientation (9:16)
- **Safe Area**: Content respects notch and home indicator
- **Tab Bar**: Fixed at bottom, 56pt height + safe area inset
- **Keyboard**: Input area moves above keyboard, no overlap
- **Landscape**: Not supported (portrait-only design)

## Accessibility Considerations

- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Touch Targets**: Minimum 44pt × 44pt
- **Font Sizes**: Minimum 16pt for body text
- **Haptic Feedback**: Subtle, not overwhelming
- **Voice Input**: Accessible alternative to text input
- **Screen Reader**: Proper labels and descriptions for all interactive elements

## Next Steps

1. Implement Material 3 theme system with Tailwind
2. Build core chat UI with message bubbles and animations
3. Integrate AI chat backend (OpenAI API)
4. Add study tools (PDF upload, quiz generation, notes)
5. Implement voice input/output
6. Polish animations and dark mode
7. Test on iOS and Android devices
