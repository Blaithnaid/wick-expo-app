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
import { Image } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Login() {
	const auth = useAuthContext();

	const emailregex =
		/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	return (
		<SafeAreaView className="flex-1 px-4">
			<View className="flex-row justify-center items-center">
				<View className="bg-transparent overflow-hidden rounded-full size-16 flex items-center justify-center">
					{auth.user ? (
						<Image
							source={{ uri: auth.user.photoURL }}
							style={{
								width: 64,
								height: 64,
								borderRadius: 64,
							}}
						/>
					) : (
						<FontAwesome
							name="user"
							size={64}
							color={"#ffffff"}
							className="rounded-full"
						/>
					)}
				</View>
				<View className="pl-2 bg-transparent dark:bg-transparent">
					<Text className="text-xl text-black dark:text-white">
						{auth.profile
							? auth.profile.displayName
							: "Create account"}
					</Text>
					<Text className="text-md text-black dark:text-slate-300">
						{auth.profile
							? auth.profile.email
							: "Tap here to sign up or log in!"}
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
