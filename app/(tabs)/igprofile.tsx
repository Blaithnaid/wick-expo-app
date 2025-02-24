import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthContext } from "@/services/AuthProvider";
import { Image } from "expo-image";
import { Divider } from "@/components/ui/divider";
import Importer from "@/components/Importer"

export default function IgProfileScreen() {
	const auth = useAuthContext();

	if (!auth.user) {
		return (
			<View className="h-full w-full">
        <Importer />
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
