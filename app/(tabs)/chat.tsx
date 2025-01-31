import {
	StyleSheet,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	View,
	SafeAreaView,
	Text,
} from "react-native";
import { ThemedView } from "@/components/Themed";
import { useState, useEffect, useRef } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import chatWithGemini from "@/services/aiAPI";

function ChatBubble({ text, isAi }: { text: string; isAi: boolean }) {
	return (
		<View
			className={`p-3 rounded-lg mx-3 my-2 max-w-[80%] flex justify-center align-center text-left ${
				isAi
					? "bg-lavender-300 dark:bg-lavender-500 self-start"
					: "dark:bg-gray-500 bg-gray-600 self-end"
			}`}
		>
			<Text className="text-black dark:text-white">{text}</Text>
		</View>
	);
}

export default function ChatScreen() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<{ text: string; isAi: boolean }[]>(
		[]
	);

	const scrollViewRef = useRef<ScrollView>(null);
	const colorScheme = useColorScheme().colorScheme;

	useEffect(() => {
		const showListener = Keyboard.addListener("keyboardDidShow", () => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		});
		return () => showListener.remove();
	}, []);

	const handleSend = async () => {
		if (message.trim() === "") return;

		const userMessage = { text: message, isAi: false };
		setMessages((prev) => [...prev, userMessage]);

		const response = await chatWithGemini(message);
		let aiMessage = { text: response, isAi: true };
		setMessages((prev) => [...prev, aiMessage]);

		setMessage("");
	};

	return (
		<SafeAreaView className="flex-1 dark:bg-oxford-500 bg-slate-200">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 98 : 0}
			>
				{messages.length === 0 ? (
					<View className="flex-1 items-center justify-center px-5 flex">
						<FontAwesome
							name="robot"
							size={80}
							color={colorScheme === "dark" ? "white" : "black"}
						/>
						<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
						<Text className="text-xl text-center w-2/3 color:black dark:color-white">
							Send a message to start chatting with Wickbot!
						</Text>
					</View>
				) : (
					<ScrollView
						ref={scrollViewRef}
						onContentSizeChange={() =>
							scrollViewRef.current?.scrollToEnd({
								animated: true,
							})
						}
						keyboardDismissMode="on-drag"
					>
						<ThemedView
							className="mt-8 mb-6 h-px w-[90%] self-center dark:bg-oxford-300 bg-oxford-200"
							lightColor="#eee"
							darkColor="rgba(255,255,255,0.1)"
						/>
						{[...messages].map((msg, index) => (
							<ChatBubble
								key={index}
								text={msg.text}
								isAi={msg.isAi}
							/>
						))}
					</ScrollView>
				)}

				<ThemedView className="items-center justify-center py-3 px-2">
					<TextInput
						className="rounded-2xl px-3.5 py-5 w-full bg-gray-400 dark:bg-gray-700 border border-gray-600 text-black dark:text-white"
						value={message}
						onChangeText={setMessage}
						onSubmitEditing={handleSend}
						placeholder="Type a message..."
						// placeholderTextColor={}
						returnKeyType="send"
						inputMode="text"
					/>
				</ThemedView>
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
