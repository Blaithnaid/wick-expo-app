import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AuthProvider } from "@/services/AuthProvider";
import { FirebaseProvider } from "@/services/FirebaseProvider";
import { ProfileProvider } from "@/services/ProfilesProvider";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";

SplashScreen.preventAutoHideAsync();

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme().colorScheme;
  return (
    <ActionSheetProvider>
      <FirebaseProvider>
        <AuthProvider>
          <ProfileProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              {children}
            </ThemeProvider>
          </ProfileProvider>
        </AuthProvider>
      </FirebaseProvider>
    </ActionSheetProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <GluestackUIProvider mode="system">
      <Providers>
        <Slot />
        <StatusBar style="auto" />
      </Providers>
    </GluestackUIProvider>
  );
}
