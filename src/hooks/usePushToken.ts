import { useEffect } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushToken(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    async function register() {
      if (Platform.OS === "web" || !Device.isDevice) return;

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id",
      });

      await supabase
        .from("profiles")
        .update({ expo_push_token: tokenData.data })
        .eq("id", userId!);
    }

    register();
  }, [userId]);
}
