import {
	Appearance,
	StyleSheet,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
} from "react-native";
import { useEffect } from "react";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { useState } from "react";

function ChatBubble({ text, isAi }: { text: string; isAi: boolean }) {
	const colorScheme = useColorScheme();

	useEffect(() => {
		console.log("Current color scheme:", colorScheme);
	});

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
		{ text: "Hello! How can I help you today?", isAi: true },
		{ text: "I have a question about React Native", isAi: false },
	]);

	const handleSend = () => {
		if (message.trim()) {
			setMessages([...messages, { text: message, isAi: false }]);
			setMessage("");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingView}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				{messages.length === 0 ? (
					<View style={styles.emptyStateContainer}>
						<Text style={styles.emptyStateText}>
							Send a message to start chatting with AI
						</Text>
					</View>
				) : (
					<ScrollView style={styles.chatContainer}>
						{messages.map((msg, index) => (
							<ChatBubble
								key={index}
								text={msg.text}
								isAi={msg.isAi}
							/>
						))}
					</ScrollView>
				)}

				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={message}
						onChangeText={setMessage}
						placeholder="Type a message..."
						onSubmitEditing={handleSend}
						returnKeyType="send"
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	chatContainer: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 10,
	},
	emptyStateContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	emptyStateText: {
		fontSize: 16,
		textAlign: "center",
		color: "#666",
	},
	inputContainer: {
		borderTopWidth: 1,
		borderTopColor: "#eee",
		paddingVertical: 16, // Changed from padding: 10 to ensure consistent vertical spacing
		paddingHorizontal: 10,
	},
	input: {
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	aiBubble: {
		backgroundColor: "#f0f0f0",
		padding: 10,
		borderRadius: 10,
		margin: 5,
		maxWidth: "80%",
		alignSelf: "flex-start",
	},
	userBubble: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 10,
		margin: 5,
		maxWidth: "80%",
		alignSelf: "flex-end",
	},
});
