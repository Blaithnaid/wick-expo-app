import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { Stack } from "expo-router";

export default function Followers() {
	const { id } = useLocalSearchParams();

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Followers",
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
				<Text className="font-bold">Followers of Profile {id}</Text>
			</View>
		</>
	);
}
