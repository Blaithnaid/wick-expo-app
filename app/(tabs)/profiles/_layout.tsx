import { Stack } from "expo-router";
import { View, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import { router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import Colors from "@/constants/Colors";

export default function ProfilesLayout() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<Stack
			screenOptions={{
				headerShown: useClientOnlyValue(false, true),
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].headerBackground,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Profiles",
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					headerTitle: "",
					headerLeft: () => (
						<View className="flex-row">
							<Pressable onPress={() => router.back()}>
								<Text className="text-lg color-iguana-400 dark:color-iguana-400">
									Back
								</Text>
							</Pressable>
						</View>
					),
					headerShown: true,
				}}
			/>
		</Stack>
	);
}
