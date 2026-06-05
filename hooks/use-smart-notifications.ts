import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useSmartNotifications() {
  const notificationListenerRef = useRef<Notifications.Subscription | null>(null);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Request permissions on iOS
    if (Platform.OS === "ios") {
      Notifications.requestPermissionsAsync();
    }

    // Listen for notifications
    notificationListenerRef.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Listen for notification responses
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
    });

    return () => {
      if (notificationListenerRef.current) {
        notificationListenerRef.current.remove();
      }
      if (responseListenerRef.current) {
        responseListenerRef.current.remove();
      }
    };
  }, []);

  const sendNotification = async (title: string, body: string, delaySeconds: number = 2) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          badge: 1,
        },
        trigger: {
          type: "time" as const,
          seconds: delaySeconds,
        } as any,
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const sendLongResponseNotification = (toolName: string) => {
    sendNotification(
      "Réponse prête",
      `Votre réponse de ${toolName} est prête à consulter.`,
      3
    );
  };

  return {
    sendNotification,
    sendLongResponseNotification,
  };
}
