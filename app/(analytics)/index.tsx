import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { router, Stack } from "expo-router";

export default function AnalyticsScreen() {
	return (
		<>
			<View className="flex-1 h-full w-full items-center justify-center">
				<Text className="text-2xl">Analytics screen</Text>
			</View>
		</>
	);
}
