import { useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView, ScrollView, View, Text } from "@/components/Themed";
import { useAuthContext } from "@/services/AuthProvider";
import { useFirebaseContext } from "@/services/FirebaseProvider";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AccountSettings() {
	const auth = useAuthContext();
	const firebase = useFirebaseContext();
	const profile = auth.profile;

	const [didSubmit, setDidSubmit] = useState(false);

	const handlePasswordReset = async () => {
		await sendPasswordResetEmail(firebase.myAuth, profile?.email);
		setDidSubmit(true);
	};

	if (!auth.profile) {
		return (
			<SafeAreaView className="flex-1 bg-white">
				<Text className="text-red-500 text-center mt-5">
					No profile information available.
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView className="px-12 pt-10">
				<View className="mb-6">
					{/* profile picture */}
					<View className="bg-slate-900 dark:bg-slate-900 overflow-hidden rounded-full size-32 flex items-center justify-center self-center">
						{auth.user?.photoURL ? (
							<Image
								source={{ uri: "https://picsum.photos/300/300" }}
								style={{
									width: 64,
									height: 64,
									borderRadius: 64,
									alignSelf: "center",
								}}
							/>
						) : (
							<FontAwesome
								name="user"
								size={90}
								color={"#ffffff"}
								className="rounded-full"
							/>
						)}
					</View>
					<Pressable className="self-center mt-2">
						<Text className="text-sm font-bold text-lavender-300 dark:text-lavender-300">
							Change profile picture
						</Text>
					</Pressable>
					<Text className="text-lg text-center font-bold m-6">
						Welcome to your account, {auth.profile.displayName}!
					</Text>
					<View className="mb-4">
						<Text className="text-md text-gray-700 font-bold mb-1">
							Username
						</Text>
						<Input variant="outline" size="md">
							<InputField
								className="dark:text-gray-200"
								value={auth.profile.displayName}
								editable={false}
							/>
							<FontAwesome
								name="key"
								size={20}
								color={"#ffffff"}
								className="rounded-full mr-3"
							/>
						</Input>
					</View>
					<View className="mb-4">
						<Text className="text-md text-gray-700 font-bold mb-1">
							Full Name
						</Text>
						<Input variant="outline" size="md">
							<InputField
								className="dark:text-gray-200"
								value={auth.profile.fullName}
								editable={false}
							/>
							<FontAwesome
								name="key"
								size={20}
								color={"#ffffff"}
								className="rounded-full mr-3"
							/>
						</Input>
					</View>
					<View className="mb-4">
						<Text className="text-md text-gray-700 dark:text-gray-200 font-bold mb-1">
							Email
						</Text>
						<Input variant="outline" size="md">
							<InputField
								className="dark:text-gray-200"
								value={auth.profile.email}
								editable={false}
							/>
							<FontAwesome
								name="envelope"
								size={20}
								color={"#ffffff"}
								className="rounded-full mr-3"
							/>
						</Input>
					</View>
				</View>
				<View className="w-3/4 gap-8 self-center">
					<Button
						onPress={() => {
							handlePasswordReset();
						}}
						className="bg-gray-400 dark:bg-gray-600"
					>
						<ButtonText className="dark:text-white">Reset Password</ButtonText>
					</Button>
					<Button
						onPress={() => {}}
						className="bg-iguana-400 dark:bg-iguana-400"
					>
						<ButtonText className="dark:text-white">Edit Account</ButtonText>
					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
