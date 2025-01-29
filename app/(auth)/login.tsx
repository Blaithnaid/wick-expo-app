import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function Login() {
	return (
		<View className="flex-1 items-center justify-center">
			<Text className="text-xl font-bold">Login</Text>
			<View
				className="my-8 h-px w-[80%]"
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
			<EditScreenInfo path="app/(tabs)/(login)/login.tsx" />
		</View>
	);
}
