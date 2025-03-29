import { View, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { Text } from "@/components/Themed";
import { router, Stack } from "expo-router";
import Colors from "@/constants/Colors";

export default function AuthLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
				},
				presentation: "card",
				headerShown: true,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen
				name="login"
				options={{
					headerTitle: "Login",
					headerShown: true,
					headerLeft: () => (
						<View className="flex-row">
							<Pressable onPress={() => router.back()}>
								<Text className="color-iguana-400 dark:color-iguana-400">
									Back
								</Text>
							</Pressable>
						</View>
					),
				}}
			/>
			<Stack.Screen
				name="register"
				options={{
					headerTitle: "Register",
					headerShown: true,
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
				}}
			/>
			<Stack.Screen
				name="forgotpassword"
				options={{
					headerTitle: "Forgot Password",
					headerShown: true,
					headerLeft: () => (
						<View className="flex-row">
							<Pressable onPress={() => router.back()}>
								<Text className="color-iguana-400 dark:color-iguana-400">
									Back
								</Text>
							</Pressable>
						</View>
					),
				}}
			/>
		</Stack>
	);
}
