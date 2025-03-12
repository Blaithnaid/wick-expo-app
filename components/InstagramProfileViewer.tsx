import { ScrollView, Text, View, Pressable } from "@/components/Themed";
import { FlatList, Dimensions } from "react-native";
import { InstagramProfile } from "@/constants/Instagram";
import { Image } from "expo-image";

export default function InstagramProfileViewer(profile: InstagramProfile) {
	const numColumns = 3;
	const screenWidth = Dimensions.get("window").width;
	const itemSize = screenWidth / numColumns;

	return (
		<View className="flex justify-start items-center w-full h-full">
			<View className="h-32 w-full dark:border-oxford-400 flex flex-row items-center">
				<View className="w-24 h-24 mx-4 rounded-full overflow-hidden">
					<Image
						source={{ uri: profile.profilePicUrl }}
						contentFit="cover"
						style={{ width: "100%", height: "100%" }}
					/>
				</View>
				<View className="w-max flex flex-row justify-between mx-8 flex-grow">
					<View className="flex flex-col items-center">
						<Text className="text-2xl self-start">{profile.posts.length}</Text>
						<Text className="text-lg">posts</Text>
					</View>
					<View className="flex flex-col items-center">
						<Text className="text-2xl self-start">
							{profile.followers.length}
						</Text>
						<Text className="text-lg">followers</Text>
					</View>
					<View className="flex flex-col items-center">
						<Text className="text-2xl self-start">
							{profile.following.length}
						</Text>
						<Text className="text-lg">following</Text>
					</View>
				</View>
			</View>
			<View className="h-fit px-4 pb-4 w-full border-b-3 dark:border-oxford-600 flex flex-col items-start">
				<View>
					<Text className="font-extrabold">{profile.fullName}</Text>
					<Text className="my-1.5 dark:text-gray-300">{profile.username}</Text>
					<Text className="text-gray-500">{profile.biography}</Text>
				</View>
			</View>
			<FlatList
				data={profile.posts}
				renderItem={({ item }) => (
					<Pressable
						style={{ width: itemSize, height: itemSize }}
						className="border dark:border-oxford-800"
					>
						<Image
							source={{ uri: item.mediaUrls[0] }}
							contentFit="cover"
							style={{ width: "100%", height: "100%" }}
						/>
					</Pressable>
				)}
				keyExtractor={(index) => index.toString()}
				numColumns={numColumns}
			/>
		</View>
	);
}
