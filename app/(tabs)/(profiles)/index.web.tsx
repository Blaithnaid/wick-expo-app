import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { Platform } from "react-native";

export default function ProfilesScreen() {
	const colorScheme = useColorScheme().colorScheme;

	return (
		<>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: "Profiles",
				}}
			/>
			{Platform.OS === "web" ? (
				<Head>
					<title>Profile Imports | Wick</title>
				</Head>
			) : null}
			<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
				<View className="flex-1 max-w-3xl items-center justify-center px-5 flex">
					<FontAwesome
						name="mobile"
						size={120}
						color={colorScheme === "dark" ? "white" : "black"}
					/>
					<Text className="text-xl text-center w-full">
						Sorry, profile imports are not available on Wick's web client!
					</Text>
					<View className="my-4 h-0.5 rounded-full w-[55%] bg-slate-400" />
					<Text className="text-lg text-oxford-400 text-center w-3/4">
						Want to back up your profiles and look back on them later? Try our
						mobile app!
					</Text>
				</View>
			</View>
		</>
	);
}
