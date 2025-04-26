import { Pressable } from "@/components/Themed";
import { View, Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { Text } from "@/components/Themed";
import { router, Stack } from "expo-router";
import Colors from "@/constants/Colors";

export default function AnalyticsLayout() {
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
				name="index"
				options={{
					headerTitle: "Analytics",
					...(Platform.OS === "ios"
						? {
								headerLeft: () => (
									<View className="flex-row">
										<Pressable toggle onPress={() => router.back()}>
											<Text className="font-semibold text-lg color-iguana-600 dark:color-iguana-400">
												Back
											</Text>
										</Pressable>
									</View>
								),
							}
						: {}),
				}}
			/>
		</Stack>
	);
}
