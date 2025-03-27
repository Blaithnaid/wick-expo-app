import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import "react-native-reanimated";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/services/AuthProvider";
import { Text } from "@/components/Themed";
import { FirebaseProvider } from "@/services/FirebaseProvider";
import { ProfileProvider } from "@/services/ProfilesProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
			<RootLayoutNav />
		</GluestackUIProvider>
	);
}
function Providers({ children }: { children: React.ReactNode }) {
	const colorScheme = useColorScheme().colorScheme;
	return (
		<ActionSheetProvider>
			<FirebaseProvider>
				<AuthProvider>
					<ProfileProvider>
						<ThemeProvider
							value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
						>
							{children}
						</ThemeProvider>
					</ProfileProvider>
				</AuthProvider>
			</FirebaseProvider>
		</ActionSheetProvider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme().colorScheme;
	return (
		<Providers>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="modal"
					options={{
						presentation: "modal",
						headerTitle: "Wickbot Info", // Change the header text
						headerStyle: {
							backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
						},
						headerTintColor: Colors[colorScheme ?? "light"].text,
					}}
				/>
				<Stack.Screen
					name="importer"
					options={{
						presentation: "modal",
						headerTitle: "Import a profile", // Change the header text
						headerStyle: {
							backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
						},
						headerTintColor: Colors[colorScheme ?? "light"].text,
					}}
				/>
				<Stack.Screen
					name="(auth)"
					options={{
						headerShown: false,
						animation: "slide_from_bottom",
					}}
				/>
				<Stack.Screen
					name="account"
					options={{
						presentation: "modal",
						headerTitle: "Your Account",
						headerStyle: {
							backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
						},
						headerLeft: () => (
							<View className="flex-row">
								<Pressable
									onPress={() => {
										router.dismiss();
									}}
								>
									<Text className="color-iguana-400 dark:color-iguana-400">
										Cancel
									</Text>
								</Pressable>
							</View>
						),
						headerTintColor: Colors[colorScheme ?? "light"].text,
						animation: "slide_from_bottom",
					}}
				/>
			</Stack>
			<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
		</Providers>
	);
}
