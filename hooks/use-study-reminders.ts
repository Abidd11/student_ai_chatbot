import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const REMINDERS_KEY = "studyai_reminders_enabled";
const LAST_REMINDER_KEY = "studyai_last_reminder";

const REMINDER_MESSAGES = [
  "Time to study! Let's tackle some questions today.",
  "Don't forget to study! Your future self will thank you.",
  "Ready to learn? Ask StudyAI anything!",
  "Study streak! Keep the momentum going.",
  "Knowledge is power! Let's study together.",
  "Your goals are waiting! Time to study.",
  "Consistency is key! Study time!",
  "Make today count! Let's learn something new.",
  "Every question brings you closer! Study now.",
  "You got this! Time for some learning.",
];

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

export const useStudyReminders = () => {
  useEffect(() => {
    initializeReminders();
  }, []);

  const initializeReminders = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }

      const remindersEnabled = await AsyncStorage.getItem(REMINDERS_KEY);
      if (remindersEnabled === "true") {
        scheduleReminder();
      }
    } catch (error) {
      console.error("Failed to initialize reminders:", error);
    }
  };

  const enableReminders = async () => {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, "true");
      scheduleReminder();
    } catch (error) {
      console.error("Failed to enable reminders:", error);
    }
  };

  const disableReminders = async () => {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, "false");
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to disable reminders:", error);
    }
  };

  const scheduleReminder = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const randomMessage = REMINDER_MESSAGES[
        Math.floor(Math.random() * REMINDER_MESSAGES.length)
      ];

      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(9, 0, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const secondsUntilReminder = Math.max(
        Math.floor((reminderTime.getTime() - now.getTime()) / 1000),
        60
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "StudyAI Reminder",
          body: randomMessage,
          sound: "default",
          badge: 1,
        },
        trigger: {
          seconds: secondsUntilReminder,
          repeats: true,
        } as any,
      });

      await AsyncStorage.setItem(LAST_REMINDER_KEY, Date.now().toString());
    } catch (error) {
      console.error("Failed to schedule reminder:", error);
    }
  };

  const isRemindersEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem(REMINDERS_KEY);
      return enabled === "true";
    } catch (error) {
      console.error("Failed to check reminders status:", error);
      return false;
    }
  };

  const getLastReminderTime = async () => {
    try {
      const lastTime = await AsyncStorage.getItem(LAST_REMINDER_KEY);
      return lastTime ? parseInt(lastTime, 10) : null;
    } catch (error) {
      console.error("Failed to get last reminder time:", error);
      return null;
    }
  };

  return {
    enableReminders,
    disableReminders,
    isRemindersEnabled,
    scheduleReminder,
    getLastReminderTime,
  };
}
