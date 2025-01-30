import { Text } from "@/components/Themed";
import { View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function SettingsScreen() {
	return (
		<View className="flex-1 items-center justify-center h-full w-full dark:bg-oxford-500 bg-white">
			<View className="bg-oxford-300 h-32 w-[95%] rounded-2xl">
				<Pressable
					className=" rounded-2xl flex flex-row items-center"
					android_ripple={{ color: "gray" }}
					onPressOut={() => {
						console.log("Pressable pressed");
					}}
				>
					<View className="ml-3 h-24 w-24 bg-white rounded-full overflow-hidden flex justify-center items-center">
						<FontAwesome
							name="question-circle"
							size={90}
							color="gray"
						></FontAwesome>
					</View>
					<View className="h-8 w-8 bg-pink-600"></View>
					<View className="h-8 w-8 bg-pink-600"></View>
				</Pressable>
			</View>
			<View>
				<View className="bg-oxford-500 border-y-2 dark:border-oxford-300 h-16 w-full"></View>
				<View className="bg-oxford-500 border-y-2 dark:border-oxford-300 h-16 w-full"></View>
				<View className="bg-oxford-500 border-y-2 dark:border-oxford-300 h-16 w-full"></View>
				<View className="bg-oxford-500 border-y-2 dark:border-oxford-300 h-16 w-full"></View>
			</View>
		</View>
	);
}
