import { View, Text } from "@/components/Themed";
import { View as UView } from "react-native";
import { router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { Image } from "expo-image";

export default function SettingsScreen() {
	const auth = useAuthContext();

	return (
		<View className="flex-1 items-center h-full w-full">
			<Pressable
				className="bg-oxford-100 dark:bg-oxford-800 my-3 px-4 py-6 w-[95%] rounded-2xl flex flex-row items-center"
				android_ripple={{ color: "gray" }}
				onPress={() => {
					if (!auth.profile) {
						router.push("/(auth)/register");
					} else {
						router.push("/account");
					}
				}}
			>
				<View className="bg-black dark:bg-black overflow-hidden rounded-full size-20 flex items-center justify-center">
					{auth.user ? (
						<Image
							source={{ uri: auth.user.photoURL }}
							style={{
								width: 70,
								height: 70,
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
				<UView className="ml-3 bg-transparent dark:bg-transparent">
					<Text className="text-2xl font-bold text-lavender-400 dark:text-lavender-400">
						{auth.profile ? auth.profile.displayName : "Create account"}
					</Text>
					<Text className="text-md text-black dark:text-slate-300">
						{auth.profile
							? auth.profile.email
							: "Tap here to sign up or log in!"}
					</Text>
				</UView>
			</Pressable>
			<View className="w-full items-center">
				{auth.profile ? (
					<Pressable
						className="dark:bg-oxford-400 bg-neutral-300 p-3 w-full flex flex-row items-start border-t border-oxford-300"
						android_ripple={{ color: "gray" }}
						onPress={() => auth.logout()}
					>
						<Text className="text-black text-xl dark:text-white my-1">
							Log out
						</Text>
						<FontAwesome
							name="chevron-right"
							size={16}
							color={"#ffffff"}
							className="ml-auto pt-2.5"
						/>
					</Pressable>
				) : null}
				<Pressable
					className="dark:bg-oxford-400 bg-neutral-300 p-3 w-full flex flex-row items-start border-y border-oxford-300"
					android_ripple={{ color: "gray" }}
					onPress={() => console.log("Current profile name: ", auth.profile)}
				>
					<Text className="text-black text-xl dark:text-white my-1">
						Debug user info
					</Text>
					<FontAwesome
						name="chevron-right"
						size={16}
						color={"#ffffff"}
						className="ml-auto pt-2.5"
					/>
				</Pressable>
				<Pressable
					className="dark:bg-oxford-400 mt-10 bg-neutral-300 p-3 w-full flex flex-row items-start border-y border-oxford-300"
					android_ripple={{ color: "gray" }}
					onPress={() => console.log("Current profile name: ", auth.profile)}
				>
					<Text className="text-black text-xl dark:text-white my-1">
						Set theme
					</Text>
					<FontAwesome
						name="chevron-right"
						size={16}
						color={"#ffffff"}
						className="ml-auto pt-2.5"
					/>
				</Pressable>
			</View>
		</View>
	);
}
