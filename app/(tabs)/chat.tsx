import {
	StyleSheet,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

function ChatBubble({ text, isAi }: { text: string; isAi: boolean }) {
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView className="flex-1">
				<KeyboardAvoidingView
					className="flex-1"
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 98 : 0}
				>
					{messages.length === 0 ? (
						<View className="flex-1 items-center justify-center px-5 flex">
							<FontAwesome
								name="robot"
								size="80"
								className="dark:color-white color-black"
							/>
							<View
								darkColor="#a1a1a1"
								className="h-0.5 w-2/3 bg-gray-400 rounded-lg mb-5 mt-7"
							></View>
							<Text className="text-xl text-center w-2/3">
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

					<View className="items-center justify-center bg-gray-500 py-3 px-2">
						<TextInput
							className="rounded-2xl px-3.5 py-5 w-full bg-gray-200 dark:bg-gray-700 border border-gray-600 text-black dark:text-white"
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
		</TouchableWithoutFeedback>
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
