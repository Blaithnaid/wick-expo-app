import { View, Text } from "@/components/Themed";
import { FlatList, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect, Link } from "expo-router";
import { useAuthContext } from "@/services/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { InstagramProfile } from "@/constants/Instagram";

export default function ProfilesScreen() {
	const [profiles, setProfiles] = useState<InstagramProfile[]>([]);

	const loadProfiles = useCallback(async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const profileKeys = keys.filter((key) => key.startsWith("profile_"));
			const profilePromises = profileKeys.map(async (key) => {
				const profileData = await AsyncStorage.getItem(key);
				if (profileData) {
					const profile = JSON.parse(profileData) as InstagramProfile;
					profile.posts = profile.posts.map((post: any) => ({
						...post,
						timestamp: new Date(post.timestamp),
					}));
					profile.whenImported = new Date(profile.whenImported);
					return { ...profile };
				}
				return null;
			});
			const profiles = await Promise.all(profilePromises);
			setProfiles(
				profiles.filter((profile) => profile !== null) as InstagramProfile[],
			);
		} catch (error) {
			console.error("Error loading profiles:", error);
		}
	}, []);

	const clearProfiles = async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const profileKeys = keys.filter((key) => key.startsWith("profile_"));
			profileKeys.forEach((key) => {
				AsyncStorage.removeItem(key);
			});

			const mediaDir = `${FileSystem.documentDirectory}instagram_media/`;
			const profilePicsDir = `${FileSystem.documentDirectory}profile_pics/`;

			await FileSystem.deleteAsync(mediaDir, { idempotent: true });
			await FileSystem.deleteAsync(profilePicsDir, { idempotent: true });
			console.log("Successfully deleted profiles!");
		} catch (error) {
			console.log("Error clearing profiles:", error);
		}
	};

	useEffect(() => {
		loadProfiles();
	}, [loadProfiles]);

	useFocusEffect(
		useCallback(() => {
			loadProfiles();
		}, [loadProfiles]),
	);

	const auth = useAuthContext();
	const colorScheme = useColorScheme().colorScheme;

	if (!auth?.profile) {
		return (
			<View className="flex-1 items-center justify-center px-5 flex">
				<FontAwesome
					name="users"
					size={80}
					color={colorScheme === "dark" ? "white" : "black"}
				/>
				<View className="mt-4 mb-3 h-[8px] rounded-full w-[55%] bg-slate-400" />
				<Text className="text-xl text-center w-2/3">
					You are not signed in!
				</Text>
				<Text className="text-lg text-oxford-400 text-center w-3/4 mt-4">
					Head over to <Text className="font-bold">Settings</Text> and create an
					account, or sign back in!
				</Text>
				<Text className="text-lg text-center w-3/4 mt-2">
					Once signed in, you can easily sync your profile, and view it here in
					the app and on our <Text className="font-bold">Web client!</Text>
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 items-center h-full w-full">
			<Text className="text-2xl font-bold mt-3 mb-2 text-left w-full pl-3">
				Instagram
			</Text>
			<FlatList
				data={profiles}
				renderItem={({ item }: { item: InstagramProfile }) => (
					<Link href={`/profiles/${item.id}`}>
						<View className="dark:bg-oxford-400 p-3 w-full flex flex-row items-center justify-center border-y border-oxford-300">
							{item.profilePicUrl ? (
								<Image
									source={{ uri: item.profilePicUrl }}
									style={{
										width: 64,
										height: 64,
										borderRadius: 64,
									}}
								/>
							) : (
								<FontAwesome
									className=""
									name="user-circle"
									size={64}
									color="gray"
								/>
							)}
							<View className="ml-2 dark:bg-transparent">
								<Text className="text-black text-xl font-bold dark:text-white my-1">
									{item.username}
								</Text>
								<Text className="text-gray-400 text-md dark:text-white my-1">
									imported:{" "}
									{item.whenImported
										? item.whenImported.toLocaleDateString()
										: "Unknown"}
								</Text>
							</View>
							<FontAwesome
								name="chevron-right"
								size={16}
								color={"#ffffff"}
								className="ml-auto pt-2.5"
							/>
						</View>
					</Link>
				)}
			/>
			<Pressable
				className="bg-iguana-400 h-fit w-fit p-6"
				onPress={() => {
					clearProfiles();
					loadProfiles();
				}}
			>
				<Text className="text-xl font-bold">wipe profiles</Text>
			</Pressable>
		</View>
	);
}
