import { useState } from "react";
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
import { router } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { AlertCircleIcon } from "@/components/ui/icon";
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
				<View className="flex-1 justify-between">
					<View className="pt-32 px-12 w-full">
						<FormControl
							isInvalid={isEmailInvalid}
							size="md"
							isRequired={true}
							className="pb-2 w-full"
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
									className="text-black dark:text-white"
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
								/>
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>Email is invalid.</FormControlErrorText>
							</FormControlError>
						</FormControl>
						<FormControl
							className="w-full"
							isInvalid={isPasswordInvalid}
							size="md"
							isRequired={true}
						>
							<FormControlLabel>
								<FormControlLabelText className="dark:text-white">
									Password
								</FormControlLabelText>
							</FormControlLabel>
							<Input isFullWidth className="my-1 rounded-lg">
								<InputField
									className="bg-slate-300 dark:bg-slate-700"
									type="password"
									value={password}
									onChangeText={(text) => setPassword(text)}
								/>
							</Input>
						</FormControl>
						<Button
							className="w-fit bg-iguana-400 dark:bg-iguana-600 self-end mt-4"
							size="md"
							onPress={() => {
								handleSubmit();
							}}
						>
							<ButtonText className="text-black dark:text-white">
								Submit
							</ButtonText>
						</Button>
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
				</View>
			</SafeAreaView>
		</View>
	);
}
