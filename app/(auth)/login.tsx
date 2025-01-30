import { Text, ThemedView } from "@/components/Themed";

export default function Login() {
	return (
		<ThemedView className="flex-1 items-center justify-center">
			<Text className="text-xl font-bold">Login</Text>
			<ThemedView
				className="my-8 h-px w-[80%]"
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
		</ThemedView>
	);
}
