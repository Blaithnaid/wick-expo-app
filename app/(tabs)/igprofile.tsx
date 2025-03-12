import { View, Text, Pressable } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import Importer from "@/components/Importer";
import {
	InstagramProfile,
	exampleInstagramProfile,
} from "@/constants/Instagram";
import InstagramProfileViewer from "@/components/InstagramProfileViewer";
import { useProfileToggle } from "@/services/ProfileToggleContext";

export default function IgProfileScreen() {
	const auth = useAuthContext();
	const colorScheme = useColorScheme().colorScheme;
	const { showImporter } = useProfileToggle();

	if (!auth?.profile) {
		return (
			<View className="flex-1 items-center justify-center px-5 flex">
				<FontAwesome
					name="user-plus"
					size={80}
					color={colorScheme === "dark" ? "white" : "black"}
				/>
				<View className="mt-4 mb-3 h-[8px] rounded-full w-[55%] bg-slate-400" />
				<Text className="text-xl text-center w-2/3">
					You are not signed in!
				</Text>
				<Text className="text-lg text-red-400 text-center w-3/4 mt-4">
					Head over to <Text className="font-bold">Settings</Text> and
					create an account, or sign back in!
				</Text>
				<Text className="text-lg text-center w-3/4 mt-2">
					Once signed in, you can easily sync your profile to our{" "}
					<Text className="font-bold">Web client!</Text>
				</Text>
			</View>
		);
	}

	if (!auth.profile.igProfile) {
		return (
			<View className="h-full w-full">
				{showImporter ? (
					<Importer />
				) : (
					<InstagramProfileViewer {...exampleInstagramProfile} />
				)}
			</View>
		);
	}

	return (
		<View className="flex-1 items-center pt-3 h-full w-full">
			<View>
				<View>
					<InstagramProfileViewer {...auth.profile.igProfile} />
				</View>
			</View>
		</View>
	);
}
