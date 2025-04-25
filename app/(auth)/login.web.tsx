import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, Text, View } from "@/components/Themed";
import { useAuthContext } from "@/services/AuthProvider";

export default function Login() {
	const auth = useAuthContext();

	const [email, setEmail] = useState("");
	const [isEmailInvalid, setIsEmailInvalid] = useState(false);

	const [password, setPassword] = useState("");
	const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [loginError, setLoginError] = useState(false);

	const emailregex =
		/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	const handleSubmit = async () => {
		const login = await auth.login(email, password);
		if (login === true) {
			router.dismissTo("/settings");
		} else {
			setLoginError(true);
		}
	};

	return (
		<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
			<SafeAreaView className="web:max-w-3xl web:mx-auto w-full flex-1">
				<View className="flex-1 justify-start">
					<View className="pt-32 px-12 mb-4 w-full">
						<Text className="dark:text-white text-lg">Email*</Text>
						<TextInput
							className="my-1 p-3 border dark:border-gray-500 border-gray-500 rounded-lg bg-slate-300 dark:bg-slate-700"
							onChangeText={(text) => {
								setEmail(text);
								if (!emailregex.test(email)) {
									setIsEmailInvalid(true);
								} else {
									setIsEmailInvalid(false);
								}
							}}
							value={email}
						/>
					</View>
					<View className="px-12 w-full">
						<Text className="dark:text-white text-lg">Password</Text>
						<TextInput
							className="my-1 p-3 border dark:border-gray-500 border-gray-500 rounded-lg bg-slate-300 dark:bg-slate-700"
							secureTextEntry
							value={password}
							onChangeText={(text) => setPassword(text)}
						/>
					</View>
					<Pressable
						className="w-fit px-5 py-4 hover:border-gray-800 border border-gray-400 rounded-lg bg-iguana-400 dark:bg-iguana-600 self-end mt-4 mr-12"
						onPress={handleSubmit}
					>
						<Text className="text-white dark:text-white">Submit</Text>
					</Pressable>
					{loginError ? (
						<View className="w-1/2 mt-8 self-center rounded-2xl p-4 bg-slate-800 dark:bg-slate-600 border-2 border-red-900 dark:border-red-900">
							<Text className="text-center text-white dark:text-white">
								Login failed. Please try again.
							</Text>
						</View>
					) : null}
				</View>
				<View className="flex-row justify-evenly mb-4">
					<Pressable
						onPress={() => {
							router.push("/(auth)/forgotpassword");
						}}
					>
						<Text className="pb-2 text-center underline">
							Forgot your password?
						</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</View>
	);
}
