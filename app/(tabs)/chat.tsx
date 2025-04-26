import {
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { httpsCallable } from "firebase/functions";
import { useFirebaseContext } from "@/services/FirebaseProvider";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { useState, useEffect, useRef } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import ChatBubble from "@/components/ChatBubble";
import Head from "expo-router/head";

export default function ChatScreen() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<{ text: string; role: string }[]>(
		[],
	);

	const functions = useFirebaseContext().myFunctions;
	const chatWithGemini = httpsCallable(functions, "chatWithGemini");

	const sendMessage = async (
		message: string,
		prevMessages: { text: string; role: string }[],
	) => {
		try {
			const result = await chatWithGemini({
				prevMessages: prevMessages,
				userMessage: message,
			});

			return result.data;
		} catch (error) {
			console.error("Error calling function:", error);
		}
	};

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

		const userMessage = { text: message, role: "user" };
		setMessages((prev) => [...prev, userMessage]);
		setMessages((prev) => [...prev, { text: "", role: "model" }]);

		const response = await sendMessage(message, messages);
		let aiMessage = { text: (response as string).trim(), role: "model" };
		setMessages((prev) => [...prev.slice(0, -1), aiMessage]);

		setMessage("");
	};

	return (
		<>
			<Head>
				<title>Chat | Wick</title>
			</Head>
			<SafeAreaView className="flex-1">
				<KeyboardAvoidingView
					className="flex-1"
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 98 : 0}
				>
					{messages.length === 0 ? (
						Platform.OS !== "web" ? (
							<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
								<View className="flex-1 items-center justify-center px-5 flex">
									<FontAwesome
										name="robot"
										size={80}
										color={colorScheme === "dark" ? "white" : "black"}
									/>
									<Text className="text-xl text-center w-2/3">
										Send a message to start chatting with Wickbot!
									</Text>
									<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
									<Text className="text-lg text-center w-3/4 mt-4">
										Click the icon in the top right to get some tips!
									</Text>
								</View>
							</TouchableWithoutFeedback>
						) : (
							<View className="flex-1 web:max-w-3xl web:self-center">
								<View className="flex-1 items-center justify-center px-5">
									<FontAwesome
										name="robot"
										size={80}
										color={colorScheme === "dark" ? "white" : "black"}
									/>
									<View className="mt-4 mb-3 h-[2px] rounded-full w-[55%] bg-slate-400" />
									<Text className="text-xl text-center w-2/3">
										Send a message to start chatting with Wickbot!
									</Text>
									<Text className="text-lg text-center w-3/4 mt-4">
										Click the icon in the top right to get some tips!
									</Text>
								</View>
							</View>
						)
					) : (
						<ScrollView
							className="web:max-w-3xl web:min-w-lg web:self-center"
							ref={scrollViewRef}
							onContentSizeChange={() =>
								scrollViewRef.current?.scrollToEnd({
									animated: true,
								})
							}
							keyboardDismissMode="on-drag"
						>
							<View
								className="mt-8 mb-6 h-px w-[90%] self-center dark:bg-oxford-300 bg-oxford-200"
								lightColor="#eee"
								darkColor="rgba(255,255,255,0.1)"
							/>
							{[...messages].map((msg, index) => (
								<ChatBubble key={index} text={msg.text} role={msg.role} />
							))}
						</ScrollView>
					)}

					<View className="items-center justify-center py-3 px-2">
						<TextInput
							className="rounded-2xl px-3.5 py-5 w-full bg-neutral-200 dark:bg-gray-700 border border-gray-600 text-black dark:text-white"
							value={message}
							onChangeText={setMessage}
							onSubmitEditing={handleSend}
							placeholder="Type a message..."
							// placeholderTextColor={}
							returnKeyType="send"
							inputMode="text"
						/>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</>
	);
}
