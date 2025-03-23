import { Text, View as TView } from "@/components/Themed";
import { View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import {
	InstagramProfile,
	InstagramPost,
	exampleInstagramProfile,
} from "@/constants/Instagram";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	Modal,
	ModalBackdrop,
	ModalContent,
	ModalBody,
	ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";

export default function InstagramProfileViewerScreen() {
	const { id } = useLocalSearchParams();
	const [profile, setProfile] = useState<InstagramProfile | null>(null);
	const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
	const [selectedImage, setSelectedImage] = useState(0);

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
						style={{
							width: "100%",
							aspectRatio: 1,
						}}
					/>
					<ModalBody>
						<View className="mt-4 dark:bg-oxford-600 flex flex-row w-full justify-center items-center">
							<Pressable
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
									color={"#ffffff"}
									className="rounded-full"
								/>
							</Pressable>
							{selectedPost?.mediaUrls.map((url, index) => (
								<View
									key={url}
									className={
										"size-2.5 mx-1.5 rounded-full " +
										(index === selectedImage
											? "dark:bg-white bg-black"
											: "dark:bg-oxford-700")
									}
								/>
							))}
							<Pressable
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
									color={"#ffffff"}
									className="rounded-full"
								/>
							</Pressable>
						</View>
						<View className="dark:bg-transparent">
							{selectedPost?.caption && (
								<Text className="text-lg mt-4">{selectedPost.caption}</Text>
							)}
						</View>
					</ModalBody>
					<ModalFooter className="p-2">
						<Button
							onPress={() => {
								setSelectedPost(null);
							}}
						>
							<ButtonText>Close</ButtonText>
						</Button>
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
					<View className="flex flex-col items-center">
						<Text className="text-2xl font-bold self-start">
							{profile?.followers.length}
						</Text>
						<Text className="text-lg">followers</Text>
					</View>
					<View className="flex flex-col items-center">
						<Text className="text-2xl font-bold self-start">
							{profile?.following.length}
						</Text>
						<Text className="text-lg">following</Text>
					</View>
				</View>
			</View>
			<View className="h-fit px-4 pb-4 w-full border-b-3 dark:border-oxford-600 flex flex-col items-start">
				<View>
					<Text className="font-extrabold">{profile?.fullName}</Text>
					<Text className="my-1.5 dark:text-gray-300">{profile?.username}</Text>
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
						<Image
							source={{ uri: item.mediaUrls[0] }}
							contentFit="cover"
							style={{ width: "100%", height: "100%" }}
						/>
					</Pressable>
				)}
				keyExtractor={(_, index) => index.toString()}
				numColumns={numColumns}
			/>
		</TView>
	);
}
