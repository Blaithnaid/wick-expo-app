import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)'); // Or wherever your main screen is
      }
      setChecking(false); // important so loading spinner disappears
    }

    checkOnboarding();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
