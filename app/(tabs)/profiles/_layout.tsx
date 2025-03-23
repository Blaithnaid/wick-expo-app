import { Stack, Link } from "expo-router";
import { View, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
					headerRight: () => (
						<Link href="/importer" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="user-plus"
										size={25}
										color={Colors[colorScheme ?? "light"].text}
										style={{
											marginRight: 15,
											opacity: pressed ? 0.5 : 1,
										}}
									/>
								)}
							</Pressable>
						</Link>
					),
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
