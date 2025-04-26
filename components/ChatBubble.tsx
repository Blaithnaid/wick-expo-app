import { View, Text, Platform } from "react-native";
import { LoadingDots } from "@/components/LoadingDots";

export default function ChatBubble({
	text,
	role,
}: {
	text: string;
	role: string;
}) {
	return (
		<View
			className={`p-3 rounded-lg mx-3 my-2 max-w-[80%] flex justify-center items-center min-h-12 text-left ${
				role === "model"
					? "bg-lavender-300 dark:bg-lavender-500 self-start"
					: "dark:bg-gray-500 bg-gray-600 self-end"
			}`}
		>
			{!text ? (
				Platform.OS !== "web" ? (
					<LoadingDots interval={300} size={8} />
				) : (
					<Text className="text-black dark:text-white text-lg">. . .</Text>
				)
			) : (
				<Text className="text-black dark:text-white text-lg">{text}</Text>
			)}
		</View>
	);
}
