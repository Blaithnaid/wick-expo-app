import { useState } from "react";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { router } from "expo-router";
import { Pressable, TextInput } from "react-native";
import { Platform } from "react-native";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { useAuthContext } from "@/services/AuthProvider";
import { useFirebaseContext } from "@/services/FirebaseProvider";

export default function Signup() {
	// we use this to check if the user is logged in
	const auth = useAuthContext();
	const firebase = useFirebaseContext();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isEmailInvalid, setIsEmailInvalid] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
	const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] =
		useState(false);

	const [registerError, setRegisterError] = useState(false);

	// regex for email validation
	const emailregex =
		/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	const handleSubmit = async () => {
		const register = await auth.register(email, password, name);
		if (register === true) {
			router.dismiss();
		} else {
			setRegisterError(true);
		}
	};

	return (
		<View className="flex-1 w-full items-center justify-center bg-white dark:bg-oxford-500">
			<SafeAreaView className="web:max-w-3xl web:mx-auto flex-1 px-4">
				<View className="flex-1 justify-between">
					<View className="pt-32 px-8">
						<Text className="dark:text-white">Display Name</Text>
						<TextInput
							value={name}
							onChangeText={(text) => {
								setName(text);
							}}
							className="text-black dark:text-white"
						/>
						<Text className="dark:text-white">Email</Text>
						<TextInput
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								if (!emailregex.test(email)) {
									setIsEmailInvalid(true);
								} else {
									setIsEmailInvalid(false);
								}
							}}
							className="text-black dark:text-white"
						/>
						<Text className="dark:text-white">Password</Text>
						<TextInput
							secureTextEntry
							value={password}
							onChangeText={(text) => {
								setPassword(text);
								// Only mark invalid if password isn't empty and doesn't meet requirements
								if (
									text.length > 0 &&
									!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d|\W)/.test(text)
								) {
									setIsPasswordInvalid(true);
								} else {
									setIsPasswordInvalid(false);
								}
							}}
						/>
						<Text>
							Must be at least 8 characters, with at least one letter of each
							case, and one number or special character.
						</Text>
						<View>
							<Icon as={AlertCircleIcon} />
							<Text>Password does not meet requirements.</Text>
						</View>
						<Text className="dark:text-white">Confirm Password</Text>
						<TextInput
							secureTextEntry
							value={confirmPassword}
							onChangeText={(text) => {
								setConfirmPassword(text);
								// Only mark invalid if confirmPassword isn't empty and doesn't match
								if (text.length > 0 && text !== password) {
									setIsConfirmPasswordInvalid(true);
								} else {
									setIsConfirmPasswordInvalid(false);
								}
							}}
						/>
						<Icon as={AlertCircleIcon} />
						<Text>Password does not match.</Text>
						<Pressable
							className="w-fit px-5 py-4 hover:border-gray-800 border border-gray-400 rounded-lg bg-iguana-400 dark:bg-iguana-600 self-end mt-4"
							onPress={handleSubmit}
						>
							<Text className="text-white dark:text-white">Submit</Text>
						</Pressable>
						{registerError ? (
							<View className="w-1/2 mt-8 self-center rounded-2xl p-4 bg-slate-800 dark:bg-slate-600 border-2 border-red-800 dark:border-red-800">
								<Text className="text-ellipsis text-center">
									Registration failed. Please try again.
								</Text>
							</View>
						) : null}
					</View>
					<View className="flex-row justify-evenly mb-4">
						<Pressable
							onPress={() => {
								router.push("/(auth)/login");
							}}
						>
							<Text className="pb-2 font-bold text-center underline">
								Already have an account?
							</Text>
						</Pressable>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}
