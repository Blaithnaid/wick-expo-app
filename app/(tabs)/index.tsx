import { ScrollView, Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { useAuthContext } from "@/services/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
	const auth = useAuthContext();
	const profileImage =
		auth.profile?.photoURL || "https://via.placeholder.com/50";

	return (
		<ScrollView className="flex-1 w-full px-5 py-4">
			{/* Header Section */}
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center">
					<Image
						source={{ uri: profileImage }}
						className="w-12 h-12 rounded-full"
					/>
					<View className="ml-3">
						<Text className="text-gray-500">Hello!</Text>
						<Text className="text-lg font-semibold text-indigo-600">
							{auth.profile?.displayName || "Username"}
						</Text>
					</View>
				</View>
				<FontAwesome size={24} name="bell" />
			</View>
			{/* In Progress Section */}
			<View className="mt-5">
				<Text className="text-lg font-semibold">In Progress</Text>
				<View className="flex-row space-x-3 mt-2">
					{/* Task Card */}
					<View className="bg-purple-500 p-4 rounded-lg w-[160px]">
						<Text className="text-white font-semibold">
							Task Almost Complete!
						</Text>
						<TouchableOpacity className="mt-2 bg-white py-1 px-3 rounded-full">
							<Text className="text-blue-500 text-sm">View Task</Text>
						</TouchableOpacity>
						<View className="flex-row justify-between mt-2 items-center">
							<Text className="text-white text-sm">90%</Text>
							<View className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
								<Text className="text-white text-xs">⟳</Text>
							</View>
						</View>
					</View>
					<View className="bg-purple-400 p-4 rounded-lg w-[160px]">
						<Text className="text-white font-semibold">
							Task Almost Complete!
						</Text>
						<TouchableOpacity className="mt-2 bg-white py-1 px-3 rounded-full">
							<Text className="text-blue-500 text-sm">View Task</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/* Monthly Preview Section */}
			<Text className="mt-6 text-lg font-semibold">Monthly Preview</Text>
			<View className="grid grid-cols-2 gap-4 mt-3">
				<View className="bg-green-400 p-5 rounded-lg items-center">
					<Text className="text-white text-2xl font-bold">22</Text>
					<Text className="text-white">Done</Text>
				</View>
				<View className="bg-orange-400 p-5 rounded-lg items-center">
					<Text className="text-white text-2xl font-bold">7</Text>
					<Text className="text-white">In Progress</Text>
				</View>
				<View className="bg-red-400 p-5 rounded-lg items-center">
					<Text className="text-white text-2xl font-bold">12</Text>
					<Text className="text-white">Ongoing</Text>
				</View>
				<View className="bg-blue-400 p-5 rounded-lg items-center">
					<Text className="text-white text-2xl font-bold">14</Text>
					<Text className="text-white">Waiting For Review</Text>
				</View>
			</View>

			{/* Recommended Section */}
			<Text className="mt-6 text-lg font-semibold">Recommended for you</Text>
			<View className="flex-row space-x-4 mt-3">
				<Image
					source={{ uri: "https://via.placeholder.com/100" }}
					className="w-20 h-20 rounded-lg"
				/>
				<Image
					source={{ uri: "https://via.placeholder.com/100" }}
					className="w-20 h-20 rounded-lg"
				/>
			</View>
		</ScrollView>
	);
}
