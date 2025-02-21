import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { Divider } from "@/components/ui/divider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { Image } from "expo-image";

export default function IgProfileScreen() {
	const auth = useAuthContext();

	if (!auth.user) {
		return (
			<View className="flex-1 items-center pt-3 h-full w-full">
				<Text className="text-center">Click below to import your profile!</Text>
				<Pressable
					className="bg-blue-500 rounded-lg p-2 mt-2"
					onPress={() => router.push("/importig")}
				>Import</Pressable>
			</View>
		);
	}

	return (
		<View className="flex-1 items-center pt-3 h-full w-full">
            <View>
			</View>
		</View>
	);
}
