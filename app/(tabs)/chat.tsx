import {
	StyleSheet,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";

function ChatBubble({ text, isAi }: { text: string; isAi: boolean }) {
	const colorScheme = useColorScheme();

	return (
		<View style={isAi ? styles.aiBubble : styles.userBubble}>
			<Text>{text}</Text>
		</View>
	);
}

export default function ChatScreen() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<
		Array<{ text: string; isAi: boolean }>
	>([
		// { text: "Hello! How can I help you today?", isAi: true },
		// { text: "I have a question about React Native", isAi: false },
	]);

	const handleSend = () => {
		if (message.trim()) {
			setMessages([...messages, { text: message, isAi: false }]);
			setMessage("");
		}
	};

	return (
		<SafeAreaView className="flex-1">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				{messages.length === 0 ? (
					<View className="flex-1 items-center justify-center px-5">
						<Text className="text-xl text-center w-2/3 text-red-500">
							Send a message to start chatting with Wickbot!
						</Text>
					</View>
				) : (
					<ScrollView className="flex-1 w-full py-1">
						{messages.map((msg, index) => (
							<ChatBubble
								key={index}
								text={msg.text}
								isAi={msg.isAi}
							/>
						))}
					</ScrollView>
				)}

				<View className="items-center justify-center border-2 border-[#212631] py-3 px-2">
					<TextInput
						className="rounded-xl px-3.5 py-5 w-full bg-gray-700 border border-gray-600 text-white"
						value={message}
						onChangeText={setMessage}
						placeholder="Type a message..."
						onSubmitEditing={handleSend}
						returnKeyType="send"
						inputMode="text"
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	aiBubble: {
		backgroundColor: "#7870EB",
		padding: 10,
		borderRadius: 10,
		margin: 5,
		maxWidth: "80%",
		alignSelf: "flex-start",
	},
	userBubble: {
		backgroundColor: "gray",
		padding: 10,
		borderRadius: 10,
		margin: 5,
		maxWidth: "80%",
		alignSelf: "flex-end",
	},
});
