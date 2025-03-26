import { View, Text } from "@/components/Themed";
import { Pressable, FlatList, Platform } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Stack, Link } from "expo-router";
import { useAuthContext } from "@/services/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import { InstagramProfile } from "@/constants/Instagram";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useProfiles } from "@/services/ProfilesProvider";
import Colors from "@/constants/Colors";

const ProfilesMenu = () => {
	const profiles = useProfiles();
	const colorScheme = useColorScheme().colorScheme;
	const { showActionSheetWithOptions } = useActionSheet();
	const options = ["Delete all profiles", "Cancel"];
	const destructiveButtonIndex = 0;
	const cancelButtonIndex = 1;

	const onPress = () => {
		showActionSheetWithOptions(
			{
				options,
				destructiveButtonIndex,
				cancelButtonIndex,
			},
			(i?: number) => {
				switch (i) {
					case destructiveButtonIndex:
						profiles.clearProfiles();
						profiles.loadProfiles();
						break;
					case cancelButtonIndex:
						break;
				}
			},
		);
	};

	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<FontAwesome
					name="ellipsis-h"
					size={25}
					color={Colors[colorScheme ?? "light"].text}
					style={{
						...(Platform.OS === "web" && { marginRight: 15 }),
						opacity: pressed ? 0.5 : 1,
					}}
				/>
			)}
		</Pressable>
	);
};

export default function ProfilesScreen() {
	const profiles = useProfiles();
	const auth = useAuthContext();
	const colorScheme = useColorScheme().colorScheme;

	if (!auth?.profile) {
		return (
			<>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: "Profiles",
						headerLeft: () =>
							auth.user ? (
								// only show import button if user is logged in
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
							) : (
								<></>
							),
						headerRight: () => (auth.user ? <ProfilesMenu /> : <></>),
					}}
				/>
				<View className="flex-1 items-center justify-center px-5 flex">
					<FontAwesome
						name="users"
						size={80}
						color={colorScheme === "dark" ? "white" : "black"}
					/>
					<View className="mt-4 mb-3 h-0.5 rounded-full w-[55%] bg-slate-400" />
					<Text className="text-xl text-center w-2/3">
						You are not signed in!
					</Text>
					<Text className="text-lg text-oxford-400 text-center w-3/4 mt-4">
						Head over to <Text className="font-bold">Settings</Text> and create
						an account, or sign back in!
					</Text>
					<Text className="text-lg text-center w-3/4 mt-2">
						Once signed in, you can easily sync your profile, and view it here
						in the app and on our <Text className="font-bold">Web client!</Text>
					</Text>
				</View>
			</>
		);
	}
	return (
		<>
			<Stack.Screen
				name="index"
				options={{
					title: "Profiles",
					headerLeft: () =>
						auth.user ? (
							// only show import button if user is logged in
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
						) : (
							<></>
						),
					headerRight: () => (auth.user ? <ProfilesMenu /> : <></>),
				}}
			/>
			<View className="flex-1 items-center h-full w-full">
				{profiles.profiles.length > 0 ? (
					<>
						<Text className="text-2xl font-bold mt-3 mb-2 text-left w-full pl-3">
							Instagram
						</Text>
						<FlatList
							data={profiles.profiles}
							renderItem={({ item }: { item: InstagramProfile }) => (
								<Link href={`/(profiles)/${item.id}`}>
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
					</>
				) : (
					<View className="flex-1 items-center justify-center px-5">
						<FontAwesome
							name="users"
							size={80}
							color={colorScheme === "dark" ? "white" : "black"}
						/>
						<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
						<Text className="text-xl text-center w-2/3">
							You do not have any profiles imported!
						</Text>
						<Text className="text-lg text-center">
							Click the icon in the top left to open the importer and get
							started!
						</Text>
					</View>
				)}
			</View>
		</>
	);
}
