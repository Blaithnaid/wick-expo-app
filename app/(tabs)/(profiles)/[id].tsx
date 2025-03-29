import { Text, View as TView } from "@/components/Themed";
import { View, Pressable, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import {
	InstagramProfile,
	InstagramPost,
	exampleInstagramProfile,
} from "@/constants/Instagram";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Link, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Modal,
	ModalBackdrop,
	ModalContent,
	ModalBody,
	ModalFooter,
} from "@/components/ui/modal";
import { useProfiles } from "@/services/ProfilesProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button, ButtonText } from "@/components/ui/button";
import Colors from "@/constants/Colors";
import { Platform } from "react-native";

const ProfileMenu = ({ profileId }: { profileId: string }) => {
	const profiles = useProfiles();
	const colorScheme = useColorScheme().colorScheme;
	const { showActionSheetWithOptions } = useActionSheet();
	const options = ["Delete profile", "Cancel"];
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
						console.log("BUTTON PRESSED deleting:", profileId);
						profiles.deleteProfile(profileId);
						profiles.loadProfiles();
						router.back();
						break;
					case cancelButtonIndex:
						break;
				}
			},
		);
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<FontAwesome
				name="ellipsis-h"
				size={25}
				color={Colors[colorScheme ?? "light"].text}
				style={{
					...(Platform.OS === "web" && { marginRight: 15 }),
				}}
			/>
		</TouchableOpacity>
	);
};

export default function InstagramProfileViewerScreen() {
	const { id } = useLocalSearchParams();
	const [profile, setProfile] = useState<InstagramProfile | null>(null);
	const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const colorScheme = useColorScheme().colorScheme;

	const numColumns = 3;
	const screenWidth = Dimensions.get("window").width;
	const itemSize = screenWidth / numColumns;

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const profileId = Array.isArray(id) ? id[0] : id;
				let profileData = await AsyncStorage.getItem(`${profileId}`);

				if (profileData) {
					const parsedProfile = JSON.parse(profileData);

					// convert to dates
					if (parsedProfile.posts) {
						parsedProfile.posts = parsedProfile.posts.map((post: any) => ({
							...post,
							timestamp: new Date(post.timestamp),
						}));
					}
					if (parsedProfile.whenImported) {
						parsedProfile.whenImported = new Date(parsedProfile.whenImported);
					}

					setProfile(parsedProfile);
				} else {
					console.log("Profile not found, using example profile instead");
					setProfile(exampleInstagramProfile);
				}
			} catch (error) {
				console.error("Error fetching profile:", error);
				setProfile(exampleInstagramProfile);
			}
		};

		fetchProfile();
	}, [id]);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "",
					headerLeft: () => (
						<View className="flex-row">
							<TouchableOpacity onPress={() => router.back()}>
								<Text className="font-semibold text-lg color-iguana-600 dark:color-iguana-400">
									Back
								</Text>
							</TouchableOpacity>
						</View>
					),
					headerRight: () => <ProfileMenu profileId={profile?.id ?? "AAA"} />,
				}}
			/>
			<TView className="flex justify-start items-center w-full h-full">
				<Modal
					isOpen={selectedPost !== null}
					onClose={() => {
						setSelectedPost(null);
					}}
					size="lg"
				>
					<ModalBackdrop />
					<ModalContent className="dark:bg-oxford-600 p-0">
						<Image
							source={{ uri: selectedPost?.mediaUrls[selectedImage] }}
							transition={200}
							style={{
								width: "100%",
								aspectRatio: 1,
							}}
						/>
						<ModalBody>
							<View className="mt-4 dark:bg-oxford-600 flex flex-row w-full justify-center items-center">
								<TouchableOpacity
									className="mr-4"
									onPress={() => {
										if (selectedImage > 0) {
											setSelectedImage(selectedImage - 1);
										} else if (selectedPost?.mediaUrls) {
											setSelectedImage(selectedPost.mediaUrls.length - 1);
										}
									}}
								>
									<FontAwesome
										name="chevron-left"
										size={24}
										color={Colors[colorScheme ?? "light"].text}
										className="rounded-full"
									/>
								</TouchableOpacity>
								{selectedPost?.mediaUrls.map((url, index) => (
									<View
										key={url}
										className={
											"size-2.5 mx-1.5 rounded-full " +
											(index === selectedImage
												? "dark:bg-white bg-black"
												: "dark:bg-oxford-700 bg-gray-300")
										}
									/>
								))}
								<TouchableOpacity
									className="ml-4"
									onPress={() => {
										if (
											selectedImage <
											(selectedPost?.mediaUrls?.length ?? 0) - 1
										) {
											setSelectedImage(selectedImage + 1);
										} else {
											setSelectedImage(0);
										}
									}}
								>
									<FontAwesome
										name="chevron-right"
										size={24}
										color={Colors[colorScheme ?? "light"].text}
										className="rounded-full"
									/>
								</TouchableOpacity>
							</View>
							<View className="dark:bg-transparent">
								{selectedPost?.caption && (
									<Text className="text-lg mt-4">{selectedPost.caption}</Text>
								)}
							</View>
						</ModalBody>
						<ModalFooter className="p-2">
							<Pressable>
								{({ pressed }) => (
									<Button
										onPress={() => {
											setSelectedPost(null);
										}}
										style={{
											opacity: pressed ? 0.2 : 1,
										}}
										className="dark:bg-lavender-400 bg-lavender-300"
									>
										<ButtonText className="dark:text-white text-black">
											Close
										</ButtonText>
									</Button>
								)}
							</Pressable>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<View className="h-32 w-full dark:border-oxford-400 flex flex-row items-center">
					<View className="w-24 h-24 dark:bg-oxford-800 mx-4 rounded-full overflow-hidden flex items-center justify-center">
						{profile?.profilePicUrl ? (
							<Image
								source={{ uri: profile?.profilePicUrl }}
								contentFit="cover"
								style={{ width: "100%", height: "100%" }}
							/>
						) : (
							<FontAwesome
								className=""
								name="user-circle"
								size={84}
								color="gray"
							/>
						)}
					</View>
					<View className="w-max flex flex-row justify-between mx-8 flex-grow">
						<View className="flex flex-col items-center">
							<Text className="text-2xl font-bold self-start">
								{profile?.posts.length}
							</Text>
							<Text className="text-lg">posts</Text>
						</View>
						<Link href={`/(profiles)/${profile?.id}/followers`} asChild>
							<TouchableOpacity>
								<View className="flex flex-col items-center">
									<Text className="text-2xl font-bold self-start">
										{profile?.followers.length}
									</Text>
									<Text className="text-lg">followers</Text>
								</View>
							</TouchableOpacity>
						</Link>
						<Link href={`/(profiles)/${profile?.id}/following`} asChild>
							<TouchableOpacity>
								<View className="flex flex-col items-center">
									<Text className="text-2xl font-bold self-start">
										{profile?.following.length}
									</Text>
									<Text className="text-lg">following</Text>
								</View>
							</TouchableOpacity>
						</Link>
					</View>
				</View>
				<View className="h-fit px-4 pb-4 w-full border-b-3 dark:border-oxford-600 flex flex-col items-start">
					<View>
						<Text className="font-extrabold">{profile?.fullName}</Text>
						<Text className="my-1.5 dark:text-gray-300">
							{profile?.username}
						</Text>
						<Text className="text-gray-500">{profile?.biography}</Text>
					</View>
				</View>
				<FlatList
					className="dark:bg-oxford-800"
					data={profile?.posts}
					renderItem={({ item }) => (
						<Pressable
							style={{ width: itemSize, height: itemSize }}
							className="border border-gray-400 dark:border-oxford-800"
							onPress={() => {
								setSelectedPost(item);
								setSelectedImage(0);
							}}
						>
							{({ pressed }) => (
								<Image
									source={{ uri: item.mediaUrls[0] }}
									contentFit="cover"
									style={{
										width: "100%",
										height: "100%",
										opacity: pressed ? 0.7 : 1,
									}}
								/>
							)}
						</Pressable>
					)}
					keyExtractor={(_, index) => index.toString()}
					numColumns={numColumns}
				/>
			</TView>
		</>
	);
}
