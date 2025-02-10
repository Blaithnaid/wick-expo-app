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
			router.dismiss;
		} else {
			setLoginError(true);
		}
	};

	return (
		<SafeAreaView className="flex-1 px-4">
			<View className="flex-1 justify-between">
				<View className="pt-32 px-8">
					<FormControl
						isInvalid={isEmailInvalid}
						size="md"
						isRequired={true}
					>
						<FormControlLabel>
							<FormControlLabelText className="dark:text-white">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input
							className="my-1 rounded-lg bg-slate-700"
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
							<FormControlErrorText>
								Email is invalid.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl
						isInvalid={isPasswordInvalid}
						size="md"
						isRequired={true}
					>
						<FormControlLabel>
							<FormControlLabelText className="dark:text-white">
								Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-lg" size={"md"}>
							<InputField
								type="password"
								value={password}
								onChangeText={(text) => setPassword(text)}
								className="bg-slate-700"
							/>
						</Input>
						<FormControlHelper>
							<FormControlHelperText>
								Must be at least 6 characters.
							</FormControlHelperText>
						</FormControlHelper>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								At least 6 characters are required.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<Button
						className="w-fit bg-iguana-500 self-end mt-4"
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
						<View className="w-1/2 mt-8 self-center rounded-2xl p-4 bg-slate-800 dark:bg-slate-600 border-2 border-red-800 dark:border-red-800">
							<Text className="text-center">
								Login failed. Please try again.
							</Text>
						</View>
					) : null}
				</View>
				<View className="flex-row justify-evenly mb-4">
					<Pressable
						onPress={() => {
							console.log("Forgot password pressed");
						}}
					>
						<Text className="pb-2 text-center underline">
							Forgot your password?
						</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
