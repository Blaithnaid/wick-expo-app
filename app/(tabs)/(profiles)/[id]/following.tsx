import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { Stack } from "expo-router";

export default function Following() {
	const { id } = useLocalSearchParams();

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Following",
					headerLeft: () => (
						<View className="dark:bg-transparent bg-transparent flex-row">
							<TouchableOpacity onPress={() => router.back()}>
								<Text className="text-lg color-iguana-400 dark:color-iguana-400">
									Back
								</Text>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<View className="m-0 w-full h-full">
				<Text className="font-bold">Following of Profile {id}</Text>
			</View>
		</>
	);
}
