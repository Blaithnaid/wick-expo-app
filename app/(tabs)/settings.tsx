import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { Image } from "expo-image";

export default function SettingsScreen() {
	// we'll use this to check if the user is logged in
	// will control the state of the top view
	const auth = useAuthContext();

	return (
		<View className="flex-1 items-center pt-3 h-full w-full">
			<Pressable
				className="bg-oxford-300 p-4 w-[95%] rounded-2xl flex flex-row items-center"
				android_ripple={{ color: "gray" }}
				// ios equivalent of android_ripple
				onPress={() => router.push("/(auth)/register")}
			>
				<View className="bg-transparent overflow-hidden rounded-full size-16 flex items-center justify-center">
					{auth.user ? (
						<Image
							source={{ uri: auth.user.photoURL }}
							style={{
								width: 64,
								height: 64,
								borderRadius: 64,
							}}
						/>
					) : (
						<FontAwesome
							name="user"
							size={64}
							color={"#ffffff"}
							className="rounded-full"
						/>
					)}
				</View>
				<View className="pl-2 bg-transparent dark:bg-transparent">
					<Text className="text-xl text-black dark:text-white">
						{auth.user ? auth.user.displayName : "Create account"}
					</Text>
					<Text className="text-md text-black dark:text-slate-300">
						{auth.user ? null : "Tap here to sign up or log in!"}
					</Text>
				</View>
			</Pressable>
		</View>
	);
}
