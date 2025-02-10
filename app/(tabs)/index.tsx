import { Text, View } from "@/components/Themed";
import { useAuthContext } from "@/services/AuthProvider";
import { useFirebaseContext } from "@/services/FirebaseProvider";

export default function HomeScreen() {
	const auth = useAuthContext();

	const cards = [{}];

	return (
		<View className="flex-1 items-center h-full w-full">
			<View className="self-start p-5">
				<Text className="text-3xl">
					Hey, {auth.profile?.displayName}!
				</Text>
				<Text className="text-md">
					Check out some of the latest features below.
				</Text>
			</View>
			<View></View>
		</View>
	);
}
