import { Text, View } from "@/components/Themed";
import { createInstagramDeepLink } from "@/util/InstagramDeepLink";
import { useProfiles } from "@/services/ProfilesProvider";
import {
	ExternalPathString,
	Link,
	router,
	useLocalSearchParams,
} from "expo-router";
import { Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, TouchableOpacity, Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Following() {
	const { id } = useLocalSearchParams();
	const colorScheme = useColorScheme().colorScheme;
	const followers = useProfiles().profiles.find((p) => p.id === id)?.followers;
	const platform =
		Platform.OS === "ios" || Platform.OS === "android" || Platform.OS === "web"
			? Platform.OS
			: "web"; // Default to "web" for unsupported platforms

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Following",
					headerLeft: () => (
						<View className="dark:bg-transparent bg-transparent flex-row">
							<TouchableOpacity onPress={() => router.back()}>
								<Text className="font-semibold text-lg color-iguana-600 dark:color-iguana-400">
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
						<View className="dark:bg-oxford-400 w-full h-fit p-4 flex flex-row items-center justify-between border-b border-gray-500/50 dark:border-gray-600">
							<Link
								className="mr-2"
								href={
									createInstagramDeepLink({
										profileUrl: item.profileUrl,
										platform: platform,
									}) as ExternalPathString
								}
							>
								<Text className="font-semibold text-xl">{item.name}</Text>
							</Link>
							<FontAwesome
								size={14}
								name="chevron-right"
								color={colorScheme === "dark" ? "white" : "black"}
							/>
						</View>
					)}
				/>
			</View>
		</>
	);
}
