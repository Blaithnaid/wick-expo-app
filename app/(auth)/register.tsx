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
import { AlertCircleIcon } from "@/components/ui/icon";

export default function Signup() {
	const [isEmailInvalid, setIsEmailInvalid] = useState(false);
	const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = () => {
		if (password.length < 6) {
			setIsPasswordInvalid(true);
		} else {
			setIsPasswordInvalid(false);
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
								type="text"
								value={email}
								onChangeText={(text) => setEmail(text)}
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
						onPress={handleSubmit}
					>
						<ButtonText className="text-black dark:text-white">
							Submit
						</ButtonText>
					</Button>
				</View>
				<View className="flex-row justify-evenly mb-4">
					<Pressable
						onPress={() => {
							router.push("/(auth)/login");
						}}
					>
						<Text className="pb-2 text-center underline active:text-oxford-300">
							Already have an account?
						</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
