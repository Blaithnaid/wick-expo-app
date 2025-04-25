import { useState } from "react";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { router } from "expo-router";
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
	FormControlHelper,
	FormControlHelperText,
} from "@/components/ui/form-control";
import { Pressable } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Platform } from "react-native";
import { AlertCircleIcon } from "@/components/ui/icon";
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
						<FormControl
							isInvalid={isEmailInvalid}
							size="md"
							isRequired={true}
							className="pb-2"
						>
							<FormControlLabel>
								<FormControlLabelText className="dark:text-white">
									Display Name
								</FormControlLabelText>
							</FormControlLabel>
							<Input
								className="my-1 rounded-lg bg-slate-300 dark:bg-slate-700"
								size={"md"}
							>
								<InputField
									type="text"
									value={name}
									onChangeText={(text) => {
										setName(text);
									}}
									className="text-black dark:text-white"
								/>
							</Input>
						</FormControl>
						<FormControl
							isInvalid={isEmailInvalid}
							size="md"
							isRequired={true}
							className="pb-2"
						>
							<FormControlLabel>
								<FormControlLabelText className="dark:text-white">
									Email
								</FormControlLabelText>
							</FormControlLabel>
							<Input
								className="my-1 rounded-lg bg-slate-300 dark:bg-slate-700"
								size={"md"}
							>
								<InputField
									type="text"
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
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>Email is invalid.</FormControlErrorText>
							</FormControlError>
						</FormControl>
						<FormControl
							isInvalid={isPasswordInvalid}
							size="md"
							isRequired={true}
							className="pb-2"
						>
							<FormControlLabel>
								<FormControlLabelText className="dark:text-white">
									Password
								</FormControlLabelText>
							</FormControlLabel>
							<Input
								className="my-1 rounded-lg bg-slate-300 dark:bg-slate-700"
								size={"md"}
							>
								<InputField
									type="password"
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
							</Input>
							<FormControlHelper>
								<FormControlHelperText>
									Must be at least 8 characters, with at least one letter of
									each case, and one number or special character.
								</FormControlHelperText>
							</FormControlHelper>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									Password does not meet requirements.
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
						<FormControl
							isInvalid={isConfirmPasswordInvalid}
							size="md"
							isRequired={true}
							className="pb-2"
						>
							<FormControlLabel>
								<FormControlLabelText className="dark:text-white">
									Confirm Password
								</FormControlLabelText>
							</FormControlLabel>
							<Input
								className="my-1 rounded-lg bg-slate-300 dark:bg-slate-700"
								size={"md"}
							>
								<InputField
									type="password"
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
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									Password does not match.
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
						{Platform.OS !== "web" ? (
							<Button
								className="w-fit bg-iguana-400 dark:bg-iguana-600 self-end mt-4"
								size="md"
								onPress={handleSubmit}
							>
								<ButtonText className="text-black dark:text-white">
									Submit
								</ButtonText>
							</Button>
						) : (
							<Pressable
								className="w-fit px-5 py-4 hover:border-gray-800 border border-gray-400 rounded-lg bg-iguana-400 dark:bg-iguana-600 self-end mt-4"
								onPress={handleSubmit}
							>
								<Text className="text-white dark:text-white">Submit</Text>
							</Pressable>
						)}
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
