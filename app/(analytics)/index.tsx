import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { router, Stack } from "expo-router";

export default function AnalyticsScreen() {
	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "",
					headerLeft: () => (
						<View className="flex-row">
							<Pressable onPress={() => router.back()}>
								<Text className="font-semibold text-lg color-iguana-600 dark:color-iguana-400">
									Back
								</Text>
							</Pressable>
						</View>
					),
				}}
			/>
			<View className="flex-1 items-center h-full w-full">
				<Text>Analytics screen</Text>
			</View>
		</>
	);
}
