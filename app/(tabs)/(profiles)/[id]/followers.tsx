import {
	router,
	useLocalSearchParams,
	Link,
	ExternalPathString,
} from "expo-router";
import { TouchableOpacity, FlatList } from "react-native";
import { View, Text } from "@/components/Themed";
import { Stack } from "expo-router";
import { useProfiles } from "@/services/ProfilesProvider";
import { createInstagramDeepLink } from "@/util/InstagramDeepLink";

export default function Followers() {
	const { id } = useLocalSearchParams();
	const followers = useProfiles().profiles.find((p) => p.id === id)?.followers;

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
				<FlatList
					data={followers}
					renderItem={({
						item,
					}: { item: { name: string; profileUrl: string } }) => (
						<View className="dark:bg-oxford-400 w-full h-fit p-4 flex flex-row items-center justify-start border-y dark:border-gray-800">
							<Link href={item.profileUrl as ExternalPathString}>
								<Text className="font-bold">{item.name}</Text>
							</Link>
						</View>
					)}
				/>
			</View>
		</>
	);
}
